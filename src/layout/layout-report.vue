<template>
    <div class="layout-report" v-if="loaded" :class="{ show }">
        <iframe :src="iframeSrc" frameborder="0"></iframe>
    </div>
</template>

<script>
import bus from '@/bus'

export default {
    name: 'layout-report',
    data () {
        return {
            loaded: false,
            show: false,
            iframeSrc: ''
        }
    },
    created () {
        this.initUrl()
    },
    mounted () {
        bus.$on('load-report', this.handleLoad)
        bus.$on('show-report', this.handleShow)
    },
    methods: {
        initUrl () {
            let url = window.location.href
            let index = String(url).indexOf('#/')
            url = url.slice(0, index) + '#/report/iframe'
            this.iframeSrc = process.env.NODE_ENV === 'development' ? '/#/report/iframe' : url
        },
        handleLoad (loaded) {
            this.loaded = loaded
        },
        handleShow (show) {
            this.show = show
        }
    }
}
</script>

<style lang="less">
.layout-report {
    bottom: 0;
    left: 0;
    width: 100%;
    height: ~'calc(100% - 95px)';
    z-index: 10;
    position: fixed;
    background-color: #fff;
    transform: translateX(200%);
    iframe {
        width: 100%;
        height: 100%;
    }
    &.show {
        transform: translateX(0);
    }
}
</style>
