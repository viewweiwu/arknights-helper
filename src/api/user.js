import ajax from '../utils/ajax'

export const login = (params) => ajax.post('/j_spring_security_check', { ...params, transform: true })

export const logout = () => ajax.post('/j_spring_security_logout')

// export const getProfile = (realName) => {
//     let params = {
//         pagination: {
//             pageSize: 1,
//             pageNumber: 1
//         },
//         search: {
//             userName: realName
//         }
//     }
//     return ajax.post('/sysUser/listByPage', params)
// }
export const getProfile = () => ajax.post('/sysUser/findCurrentUser')

export const updatePassword = (params) => ajax.post('/sysUser/updatePassword', { ...params, transform: true })

export const getUserMenu = (params) => ajax.post('/sysResources/findUserRes', { ...params, transform: true })

export const getSystemConfig = () => ajax.post('/sysConfigure/getAllUsingConfig')

export const uploadImg = (file) => ajax.uploadFile('/marketingBase/uploadActivityFile', file)

export const getSystemParams = (file) => ajax.get('/sysParam/getSysparam', file)

export const emptyApi = (params) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(params)
        }, 1000)
    })
}

// 客户经理 - 列表
export const getCustomerList = (params) => ajax.post('/pasSysUseOrgRole/getCstMgrByOrgAndSelf', params)

// 通知 - 个数
export const getMessageCount = (params) => ajax.post('/sysMessagePas/getSysMessageCount', params)

// 待办事项 - 个数
export const getWaitCount = (params) => ajax.post('/backlogEvent/getBacklogEventCount', params)

// 跑批日期 - 列表
export const getReportCount = (params) => ajax.post('/sysMessagePas/getMaxDateValue', params)

// 操作手册 - 文件下载
export const downloadCategory = (params) => ajax.downloadFile('/sysMessagePas/download', params)
