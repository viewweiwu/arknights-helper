import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'
import { formatFullDateTime, copy } from '@/components/yt-ui/util'

const ajax = axios.create({
    timeout: 15000 // 请求超时时间
})
const cancelToken = {}
const prefix = process.env.NODE_ENV === 'development' ? '/api' : '/pas'
const transformURL = (config) => {
    config.url = prefix + config.url
    return config
}
const transformPost = (config) => {
    if (config.data && config.data.transform) {
        delete config.data.transform
        config.transformRequest = [
            function (data) {
                let ret = ''
                for (const it in data) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return ret
            }
        ]
    }
    return config
}
const addToken = (config) => {
    // whiteList 不加入 token
    const whiteList = [
        '/j_spring_security_check'
    ]
    if (whiteList.some(url => config.url.includes(url))) {
        return config
    }
    // 添加token
    const token = store.state.token
    if (token && !config.headers.Authorization) {
        config.headers.Authorization = `${token}`
    }
    const source = axios.CancelToken.source()
    config.cancelToken = source.token

    const fullPath = router.currentRoute.fullPath
    // 把token存入到对象里面
    if (!cancelToken[fullPath]) {
        cancelToken[fullPath] = []
    }

    // 页面跳转是否自动取消请求
    if (!config.isAutoCancel) {
        cancelToken[fullPath].push(source)
    }
    return config
}

const logResponse = (res) => {
    console.groupCollapsed(`%c ${res.config.method} ${res.config.url}`, 'color: mediumseagreen;')
    console.log('data', copy(res.data || {}))
    try {
        console.log('params', res.config && res.config.data && JSON.parse(res.config.data))
    } catch (e) {
        console.log('params', res.config && res.config.data)
    }
    console.log('res', res)
    console.log('date', formatFullDateTime(new Date()))
    console.groupEnd()
}

// 请求拦截处理
ajax.interceptors.request.use(config => {
    transformPost(config)
    transformURL(config)
    addToken(config)
    return config
}, error => Promise.reject(error))

// 响应拦截处理
ajax.interceptors.response.use(response => {
    logResponse(response)
    if (response.headers['content-type'].includes('image')) {
        return 'data:image/png;base64,' + btoa(new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))
    } else if (['multipart/octet-stream;charset=utf-8', 'multipart/form-data', 'multipart/octet-stream', 'octets/stream;charset=UTF-8'].includes(response.headers['content-type'])) {
        return response
    }
    let { data, config } = response
    // whiteList 里不会弹出错误消息
    const whiteList = [
        '/j_spring_security_check'
    ]

    let isTokenError = data.errorType === 'tokenError' || data.errorType === 'notLogin' // token 过期

    if (!data.success && data.status !== 1) {
        if (isTokenError) {
            store.dispatch('logout')
            if (store.state.config && store.state.config.LOGOUT_HREF) {
                window.location.href = store.state.config.LOGOUT_HREF
            } else {
                router.push('/login')
            }
        }
        if (!whiteList.some(url => config.url.includes(url)) && data.msg) {
            if (isTokenError) {
                if (window.loginTip) {
                    Message({
                        showClose: true,
                        message: data.exception ? data.detail : data.msg,
                        type: 'error'
                    })
                    window.loginTip = false
                }
            } else {
                Message({
                    showClose: true,
                    message: data.exception ? data.detail : data.msg,
                    type: 'error'
                })
            }
        }
        return Promise.reject(data)
    }
    return data
}, error => {
    if (error.message !== undefined) {
        Message({
            showClose: true,
            message: '服务器请求错误',
            type: 'error'
        })
    }
    return Promise.reject(error)
})

ajax.uploadFile = (url, file, data = {}, cancelToken) => {
    const formData = new FormData()
    formData.append('file', file.raw, file.name)
    for (let key in data) {
        formData.append(`${key}`, data[key])
    }
    let config = { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 1000 * 60 * 60 * 2 }
    let uploadAjax = ajax.post(url, formData, config)
    return uploadAjax
}

ajax.downloadFile = (url, params) => {
    return ajax({
        method: 'post',
        url,
        data: params,
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        },
        responseType: 'blob'
    }).then(res => {
        let fileName = res.headers['content-disposition'].split('filename=')[1]
        fileName = decodeURI(fileName)
        let blob = new Blob([res.data], { type: 'application/octet-stream;charset=utf-8' })
        if ('download' in document.createElement('a')) {
            const elink = document.createElement('a')
            const href = URL.createObjectURL(blob)
            elink.download = fileName
            elink.style.display = 'none'
            elink.href = href
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(href)
            document.body.removeChild(elink)
        } else {
            navigator.msSaveBlob(blob, fileName)
        }
    }).catch(error => {
        return Promise.reject(error)
    })
}

ajax.downloadFileByFormData = (url, params) => {
    const formData = new FormData()
    appendParamsToFormData(formData, params) // 对象递归判断转平级
    let config = { headers: { 'Content-Type': 'multipart/form-data' } }
    return ajax.post(url, formData, config).then(res => {
        let fileName = res.headers['content-disposition'].split('filename=')[1]
        fileName = decodeURI(fileName)
        let blob = new Blob([res.data], { type: 'application/octet-stream;charset=utf-8' })
        if ('download' in document.createElement('a')) {
            const elink = document.createElement('a')
            const href = URL.createObjectURL(blob)
            elink.download = fileName
            elink.style.display = 'none'
            elink.href = href
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(href)
            document.body.removeChild(elink)
        } else {
            navigator.msSaveBlob(blob, fileName)
        }
    }).catch(error => {
        return Promise.reject(error)
    })
}

ajax.postWithFile = (url, params) => {
    const formData = new FormData()
    appendParamsToFormData(formData, params) // 对象递归判断转平级
    let config = { headers: { 'Content-Type': 'multipart/form-data' } }
    return ajax.post(url, formData, config)
}

let appendParamsToFormData = (formData, params) => {
    for (let key in params) {
        let value = params[key]
        let prototypeStr = Object.prototype.toString.call(value)
        if (prototypeStr === '[object File]') {
            formData.append(key, value, value.filename)
        } else if (prototypeStr === '[object Object]') {
            appendParamsToFormData(formData, value)
        } else {
            formData.append(key, value)
        }
    }
}

export default ajax
