<template>
    <div class="layout-menu-side">
        <div class="side-header">
            <yt-icon class="mr" icon="header-list" />
            {{ parent.title }}
        </div>
        <ul>
            <li
                v-for="item in list"
                :key="item.id"
                class="side-item"
                @click="handleSelect(item)"
            >
                {{ item.title }}
            </li>
        </ul>
    </div>
</template>

<script>
import bus from '@/bus'
// import { defaultMenuList } from './layout-menu-data'

export default {
    props: {
        menuList: {
            type: Array,
            default: () => []
        }
    },
    data () {
        return {
            parent: {},
            // menuList: defaultMenuList,
            list: []
        }
    },
    watch: {
        $route: {
            handler () {
                this.handleRouteChange()
            },
            immediate: true
        }
    },
    methods: {
        handleSelect (child) {
            if (child.link) {
                this.$router.push({
                    path: child.link
                    // query: {
                    //     _: Date.now()
                    // }
                })
            }
        },
        handleRouteChange () {
            let { menuList } = this
            let path = this.$route.path
            for (let i = 0; i < menuList.length; i++) {
                let root = menuList[i]
                if (root.children) {
                    for (let j = 0; j < root.children.length; j++) {
                        let parent = root.children[j]
                        if (parent.children) {
                            for (let k = 0; k < parent.children.length; k++) {
                                let item = parent.children[k]
                                if (item.link && path.includes(item.link)) {
                                    this.parent = parent
                                    this.list = parent.children
                                    this.$nextTick(() => {
                                        bus.$emit('menu-parent-show', true)
                                    })
                                    return
                                }
                            }
                        }
                    }
                }
            }
            this.$nextTick(() => {
                bus.$emit('menu-parent-show', false)
            })
        }
    }
}
</script>

<style lang="less">
.layout-menu-side {
    bottom: 0;
    left: 0;
    height: ~'calc(100vh - 56px)';
    width: 200px;
    box-shadow: 0px 2px 6px 1px rgba(0, 0, 0, 0.12);
    z-index: 2;
    position: absolute;
    overflow: auto;
    user-select: none;
    .side-header {
        height: 56px;
        margin: 0 20px;
        .borderBottom(#116088);
        font-size: 16px;
        font-weight: bold;
        color: #116088;
        .flex(@justify: flex-start);
        .yt-icon {
            font-weight: normal;
        }
    }
    .side-item {
        height: 36px;
        padding-left: 40px;
        color: #116088;
        cursor: pointer;
        .flex(@justify: flex-start);
        position: relative;
        &:hover {
            background-color: rgba(17, 96, 136, .2);
        }
        &::after {
            content: '';
            left: 20px;
            bottom: 0;
            width: ~'calc(100% - 40px)';
            height: 1px;
            .borderBottom(rgba(17, 96, 136, .2));
            position: absolute;
        }
    }

}
</style>
