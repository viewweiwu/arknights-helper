<template>
    <nav class="layout-nav">
        <div v-html="closeStyle" />
        <vue-tabs-chrome
            ref="tab"
            v-model="activeTab"
            theme="custom"
            @input="handleInput"
            :tabs="navList"
            :gap="2"
            :maxWidth="200"
            :props="{ key: 'name' }"
            :renderLabel="renderLabel"
            :insert-to-after="true"
            @contextmenu="handleContextmenu"
        />
        <div
            class="nav-menu"
            :style="menuStyle"
            v-clickoutside="closeMenu"
        >
            <div
                class="nav-menu-item"
                v-for="menu in menuList"
                :key="menu.key"
                @click="handleMenuSelect(menu.key)"
            >
                {{ menu.title }}
            </div>
        </div>
    </nav>
</template>
<script>
import clickoutside from '@/utils/clickoutside'
import VueTabsChrome from 'vue-tabs-chrome'
import Vue from 'vue'
Vue.use(VueTabsChrome)

const getTabByName = (navList, name) => {
    return navList.find(nav => nav.name === name)
}
const isQueryEqual = (query1, query2) => {
    return JSON.stringify(query1) === JSON.stringify(query2)
}

export default {
    inject: ['reload'],
    directives: { clickoutside },
    data () {
        return {
            // 导航栏向左偏移位置
            navLeft: 0,
            // 每次向左或向右的偏移量
            navOffset: 400,
            activeTab: 'home',
            activeMenuTab: null, // 打开 右键菜单 时标记的那个 nav
            contextMenuTop: -1000, // 右键菜单 上边距
            contextMenuLeft: 0, // 右键菜单 左边距
            navList: [
                {
                    path: '/home',
                    name: 'home',
                    meta: {
                        title: '首页',
                        closable: false,
                        keepAlive: true
                    }
                }
            ]
        }
    },
    computed: {
        navListStyle () {
            return {
                left: -this.navLeft + 'px'
            }
        },
        menuStyle () {
            return {
                top: this.contextMenuTop + 'px',
                left: this.contextMenuLeft + 'px'
            }
        },
        menuList () {
            let { activeMenuTab, navList } = this
            let menuNav = getTabByName(navList, activeMenuTab)
            let list = [
                { key: 'reload', title: '刷新' },
                { key: 'close', title: '关闭' },
                { key: 'closeAll', title: '关闭全部' },
                { key: 'closeOther', title: '关闭其它' },
                { key: 'closeLeft', title: '关闭左侧' },
                { key: 'closeRight', title: '关闭右侧' }
            ]
            if (menuNav && menuNav.meta.closable === false) {
                list.splice(1, 1)
            }
            return list
        },
        closeStyle () {
            let list = this.navList.filter(nav => nav.meta.closable === false)
            let style = `<style>${list.map(item => `.tab-${item.name} .tabs-close { display: none }`)}</style>`
            return style
        }
    },
    watch: {
        $route (route) {
            this.handleRouteChange(route)
        },
        activeTab () {
            this.save()
        }
    },
    created () {
        this.load()
    },
    methods: {
        // 保存 nav 到本地
        save () {
            let navList = JSON.stringify(this.$refs.tab.getTabs())
            localStorage.setItem('NAV_LIST', navList)
            localStorage.setItem('ACTIVE_TAB', this.activeTab)
        },
        // 提取本地 nav 数据
        load () {
            let data = localStorage.getItem('NAV_LIST')
            if (data) {
                data = JSON.parse(data)
                if (data.length) {
                    this.navList = data
                }
            }
            let activeTab = localStorage.getItem('ACTIVE_TAB')
            if (this.$route.name !== activeTab) {
                activeTab = this.$route.name
            }
            this.activeTab = activeTab
        },
        // 清空本地 nav 数据
        clear () {
            localStorage.removeItem('NAV_LIST')
            localStorage.removeItem('ACTIVE_TAB')
        },
        // 监听路由变化
        handleRouteChange (route) {
            let { name } = route
            let nav = this.navList.find(nav => nav.name === route.name)
            if (name === 'base' || (name === this.activeTab && isQueryEqual(nav.query, route.query))) return
            let temp = {
                name: route.name,
                path: route.path,
                meta: route.meta,
                query: route.query,
                params: route.params
            }
            if (this.navList.every(nav => nav.name !== name)) {
                this.addTab(temp)
            } else {
                this.$nextTick(() => {
                    if (!isQueryEqual(nav.query, temp.query)) {
                        nav.query = temp.query
                    }
                })
                this.activeTab = name
            }
        },
        handleInput () {
            this.$nextTick(() => {
                let { activeTab, $route } = this
                if ($route.name !== activeTab) {
                    let tab = this.navList.find(tab => tab.name === activeTab)
                    this.$router.push(tab)
                }
            })
        },
        addTab (tab) {
            this.activeTab = tab.name
            this.$refs.tab.addTab(tab)
        },
        // 右键点击导航弹出菜单
        handleContextmenu (e, nav, index) {
            e.preventDefault()
            this.activeMenuTab = nav.name
            const offsetLeft = this.$el.getBoundingClientRect().left
            this.contextMenuTop = e.pageY - 40
            this.contextMenuLeft = e.pageX - offsetLeft
        },
        // 关闭菜单
        closeMenu () {
            this.contextMenuTop = -1000
            this.activeMenuIndex = -1
        },
        // 菜单选择
        handleMenuSelect (key) {
            switch (key) {
                case 'reload':
                    this.reload(this.activeTab)
                    break
                default:
                    this[key]()
                    break
            }
            this.$nextTick(() => {
                this.save()
                this.closeMenu()
            })
        },
        // 关闭左侧 关闭右侧 关闭其它 逻辑差不多一致，就提出来了
        closeNavByCb (cb = () => {}) {
            let { navList, activeTab, activeMenuTab } = this
            let activeMenuNav = getTabByName(navList, activeMenuTab)
            let tab = null
            // 过滤掉 不允许关闭的 剩下的由 cb 判断
            navList = navList.filter((nav, i) => nav.meta.closable === false || cb(nav, activeMenuNav))
            if (navList.every(nav => nav.name !== activeTab)) {
                tab = navList[navList.length - 1]
                // this.activeTab = tab.name
            }
            this.navList = navList
            this.$nextTick(() => {
                // this.save()
                if (tab) {
                    this.$router.push({ name: tab.name })
                }
                this.$refs.tab.doLayout()
            })
        },
        // 菜单 - 关闭当前
        close () {
            this.closeNavByCb((nav, activeMenuNav) => nav.name !== activeMenuNav.name)
        },
        // 菜单 - 关闭全部
        closeAll () {
            this.closeNavByCb()
        },
        // 菜单 - 关闭其它
        closeOther () {
            this.closeNavByCb((nav, activeMenuNav) => nav.name === activeMenuNav.name)
        },
        // 菜单 - 关闭左侧
        closeLeft () {
            this.closeNavByCb((nav, activeMenuNav) => nav._x >= activeMenuNav._x)
        },
        // 菜单 - 关闭右侧
        closeRight () {
            this.closeNavByCb((nav, activeMenuNav) => nav._x <= activeMenuNav._x)
        },
        renderLabel (nav, i) {
            if (!nav) return
            if (nav.query && nav.query.title) {
                return nav.query.title
            } else if (nav.meta && nav.meta.title) {
                return nav.meta.title
            } else {
                return nav.name
            }
        },
        changeRoute (name) {
            if (!name) return
            let { navList } = this
            name = name.slice(1, name.length)
            let nav = navList.find(nav => nav.name === name)
            if (nav) {
                this.$router.push(nav)
            } else {
                this.$router.push({
                    name: name,
                    query: {
                        _: +new Date()
                    }
                })
            }
        },
        removeNav (name) {
            return new Promise(resolve => {
                setTimeout(() => {
                    let { navList } = this
                    let index = navList.findIndex(nav => nav.name === name)
                    navList.splice(index, 1)
                    this.$refs.tab.doLayout()
                    resolve()
                }, 300)
            })
        }
    }
}
</script>

<style lang="less">
.layout-nav {
    height: @space * 5;
    background-color: #fff;
    user-select: none;
    position: relative;
    flex-shrink: 0;
    .nav-menu-item {
        padding: @space @space2;
        cursor: pointer;
        &:hover {
            color: @primary;
            background-color: @primary-bg;
        }
    }
    .nav-menu {
        top: 0;
        left: 300px;
        min-width: 100px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        border-radius: @space * .5;
        padding: @space 0;
        .border();
        background-color: #fff;
        z-index: 15;
        position: absolute;
        white-space: nowrap;
    }
}
.vue-tabs-chrome.theme-custom {
    padding-top: 0;
    background-color: transparent;
    overflow: hidden;
    .tabs-footer,
    .tabs-divider,
    .tabs-background-before,
    .tabs-background-after {
        display: none;
    }
    .tabs-label {
        color: #3F3F3F;
        margin-left: 0;
    }
    .tabs-close-icon {
        stroke: #818181;
    }
    .tabs-item {
        cursor: pointer;
        &:hover {
            .tabs-main {
                opacity: 1;
            }
        }
        .tabs-main {
            opacity: .65;
        }
    }
    // .tab-home {
    //     .tabs-close {
    //         display: none;
    //     }
    // }
    .tabs-content {
        height: 40px;
        overflow: unset;
        margin-left: -1px;
        border-bottom: 1px solid #e4e7ed;
    }
    .tabs-background {
        padding: 0;
    }
    .tabs-background-content {
        border-left: 1px solid #e4e7ed;
        border-right: 1px solid #e4e7ed;
        border-radius: 0;
        background-color: #fff;
    }
    .active {
        .tabs-main {
            opacity: 1;
        }
        .tabs-background-content {
            background-color: @color-bg !important;
        }
        .tabs-background {
            &::after,
            &::before {
                top: 0;
                left: 0;
                content: '';
                width: 100%;
                height: 2px;
                background-color: @primary;
                z-index: 1;
                position: absolute;
            }
            &::after {
                top: 100%;
                background-color: @color-bg;
            }
        }
    }
}
</style>
