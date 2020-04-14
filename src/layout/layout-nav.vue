<template>
    <nav class="layout-nav">
        <div class="nav">
            <div class="nav-prev" @click="handlePrev">
                <yt-icon icon="el-icon-d-arrow-left"></yt-icon>
            </div>
            <div class="nav-container" ref="container">
                <div class="nav-list" ref="list" :style="navListStyle">
                    <div class="nav-item"
                        v-for="(nav, index) in navList"
                        :key="nav.path"
                        ref="nav"
                        :class="{ active: index === activeIndex }"
                        :title="nav | navName"
                        @click="handleSelect(nav, index)"
                        @contextmenu.prevent="handleContextmenu(nav, index, $event)"
                        :draggable="nav.meta.draggable === false ? false : true"
                        @dragstart="(e) => handleDragStart(e, nav, index)"
                        @dragenter="(e) => handleDragEnter(e, nav, index)"
                        @dragend.prevent="handleDragEnd"
                        @dragover.prevent
                        @dragleave.prevent
                    >
                        <span>{{ nav | navName }}</span>
                        <yt-icon
                            v-if="nav.meta.closable !== false"
                            class="nav-close"
                            icon="el-icon-close"
                            @click.stop="handleClose(nav, index)"
                        />
                    </div>
                </div>
            </div>
            <div class="nav-next" @click="handleNext">
                <yt-icon icon="el-icon-d-arrow-right" />
            </div>
            <el-dropdown class="nav-down" trigger="hover">
                <span class="el-dropdown-link">
                    <yt-icon icon="el-icon-arrow-down" />
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                        class="nav-down-item"
                        v-for="(nav, index) in navList"
                        :key="index"
                        @click.native.stop="handleSelect(nav, index)"
                    >{{ nav | navName }}</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
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
            >{{ menu.title }}</div>
        </div>
    </nav>
</template>

<script>
import clickoutside from '@/utils/clickoutside'
// import { MAX_OVER_MESSAGE } from '@/utils/variable'
import { mapState } from 'vuex'

const isQueryEqual = (query1, query2) => {
    return JSON.stringify(query1) === JSON.stringify(query2)
}

export default {
    name: 'layout-nav',
    inject: ['reload'],
    directives: { clickoutside },
    data () {
        return {
            // 导航栏向左偏移位置
            navLeft: 0,
            // 每次向左或向右的偏移量
            navOffset: 400,
            activeIndex: 0,
            activeMenuIndex: 0, // 打开 右键菜单 时标记的第几个 nav
            contextMenuTop: -1000, // 右键菜单 上边距
            contextMenuLeft: 0, // 右键菜单 左边距
            navList: [
                {
                    path: '/home',
                    name: 'home',
                    meta: {
                        draggable: false,
                        title: '首页',
                        closable: false,
                        keepAlive: true
                    }
                }
            ],
            menuList: [
                { key: 'refresh', title: '刷新' },
                { key: 'close', title: '关闭' },
                { key: 'close-all', title: '关闭全部' },
                { key: 'close-other', title: '关闭其它' },
                { key: 'close-left', title: '关闭左侧' },
                { key: 'close-right', title: '关闭右侧' }
            ]
        }
    },
    filters: {
        navName (nav) {
            if (nav.params && nav.params.title) {
                return nav.params.title
            } else if (nav.meta && nav.meta.title) {
                return nav.meta.title
            } else {
                return nav.name
            }
        }
    },
    computed: {
        ...mapState(['config']),
        max () {
            return this.config.NAV_MAX_SIZE ? +this.config.NAV_MAX_SIZE : 1000
        },
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
        }
    },
    watch: {
        $route (route) {
            this.handleRouteChange(route)
        }
    },
    created () {
        this.load()
    },
    methods: {
        // 保存 nav 到本地
        save () {
            let navList = JSON.stringify(this.navList)
            localStorage.setItem('NAV_LIST', navList)
            localStorage.setItem('ACTIVE_INDEX', this.activeIndex)
        },
        // 提取本地 nav 数据
        load () {
            let data = localStorage.getItem('NAV_LIST')
            if (data) {
                data = JSON.parse(data)
                this.navList = data
            }
            let activeIndex = localStorage.getItem('ACTIVE_INDEX')
            activeIndex = activeIndex ? parseInt(activeIndex) : 0
            this.activeIndex = activeIndex
            let path = this.$route.path
            if (this.navList.every(nav => nav.path !== path)) {
                this.handleRouteChange(this.$route)
            } else {
                this.$nextTick(() => {
                    this.handleRouteChange(this.$route)
                })
            }
            // this.$router.push(this.navList[this.activeIndex])
        },
        // 清空本地 nav 数据
        clear () {
            localStorage.removeItem('NAV_LIST')
            localStorage.removeItem('ACTIVE_INDEX')
        },
        // 往左移动 ←
        handlePrev () {
            let { navLeft, navOffset } = this
            navLeft -= navOffset
            navLeft = this.getStartLeft(navLeft)
            this.navLeft = navLeft
        },
        // 往右移动 →
        handleNext () {
            let { navLeft, navOffset } = this
            navLeft += navOffset
            navLeft = this.getEndLeft(navLeft)
            navLeft = this.getStartLeft(navLeft)
            this.navLeft = navLeft
        },
        // 小于左边边界返回左边界
        getStartLeft (navLeft) {
            let min = 0
            return navLeft < min ? min : navLeft
        },
        // 大于有边界返回右边界
        getEndLeft (navLeft) {
            let containerWidth = this.$refs.container.offsetWidth // 容器宽度
            let listWidth = this.$refs.list.offsetWidth // 内容宽度
            let max = listWidth - containerWidth // 最多可移动到的有边界距离
            navLeft = navLeft > max ? max : navLeft
            return navLeft
        },
        // nav 选择
        handleSelect (nav, index) {
            this.activeIndex = index
            this.$router.push(nav)
            this.moveToVisble(nav, index)
        },
        // 将选中的 nav 移动到可显示的位置
        moveToVisble (nav, index) {
            let { navLeft } = this
            let targetNav = this.$refs.nav[index]
            let containerWidth = this.$refs.container.offsetWidth // 容器宽度
            let listWidth = this.$refs.list.offsetWidth // 内容宽度
            let offsetLeft = targetNav.offsetLeft
            let offsetWidth = targetNav.offsetWidth
            // 在可视范围内
            if (listWidth < containerWidth || offsetLeft < containerWidth - offsetWidth) {
                navLeft = 0
                // 不在可视范围内
            } else if (offsetLeft > containerWidth - offsetWidth) {
                navLeft = offsetLeft - containerWidth / 2
                navLeft = this.getStartLeft(navLeft)
            }
            this.navLeft = navLeft
        },
        // 关闭 nav
        handleClose (nav, index) {
            let { activeIndex, navList } = this
            navList.splice(index, 1)
            if (index <= activeIndex) {
                activeIndex -= 1
            }
            this.activeIndex = activeIndex
            this.$router.push(navList[activeIndex])
        },
        // 监听路由变化
        handleRouteChange (route) {
            let { name } = route
            let nav = this.navList.find(nav => nav.name === route.name)
            if (name === 'base' || (name === this.activeTab && isQueryEqual(nav.query, route.query))) return
            let { navList, activeIndex } = this
            let temp = {
                name: route.name,
                path: route.path,
                meta: route.meta,
                query: route.query,
                params: route.params
            }
            if (this.navList.every(nav => nav.name !== name)) {
                if (this.navList.length >= this.max) {
                    // this.$info(MAX_OVER_MESSAGE)
                    this.$router.back()
                    return
                }
                activeIndex += 1
                navList.splice(activeIndex, 0, temp)
                this.activeIndex = activeIndex
            } else {
                this.$nextTick(() => {
                    if (!isQueryEqual(nav.query, temp.query)) {
                        nav.query = temp.query
                    }
                    let index = this.navList.findIndex(nav => nav.name === route.name)
                    this.activeIndex = index
                })
            }
            this.$nextTick(() => {
                this.moveToVisble(navList[activeIndex], activeIndex)
                this.save()
            })
        },
        // 右键点击导航弹出菜单
        handleContextmenu (nav, index, e) {
            if (nav.meta.closable === false) return
            this.activeMenuIndex = index
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
                case 'refresh':
                    this.reload()
                    break
                case 'close':
                    this.close()
                    break
                case 'close-all':
                    this.closeAll()
                    break
                case 'close-other':
                    this.closeOther()
                    break
                case 'close-left':
                    this.closeLeft()
                    break
                case 'close-right':
                    this.closeRight()
                    break
            }
            this.save()
            this.closeMenu()
        },
        close () {
            let { navList, activeMenuIndex, activeIndex } = this
            navList.splice(activeMenuIndex, 1)
            if (activeMenuIndex <= activeIndex) {
                this.activeIndex -= 1
                let activeNav = navList[this.activeIndex]
                this.$router.push({
                    ...activeNav
                })
            }
        },
        // 关闭左侧 关闭右侧 关闭其它 逻辑差不多一致，就提出来了
        closeNavByCb (cb = () => {}) {
            let { navList, activeMenuIndex } = this
            let activeNav = navList[activeMenuIndex]
            // 过滤掉 不允许关闭的 剩下的由 cb 判断
            this.navList = navList.filter((nav, i) => nav.meta.closable === false || cb(i, activeMenuIndex))
            this.activeIndex = this.navList.findIndex(nav => nav === activeNav)
            this.$router.push({
                ...activeNav
            })
        },
        // 菜单 - 关闭全部
        closeAll () {
            let { navList } = this
            this.navList = navList.filter((nav, i) => nav.meta.closable === false)
            this.activeIndex = 0
            let nav = this.navList[0]
            if (nav) {
                this.$router.push({
                    ...nav
                })
            } else {
                this.$router.push({
                    path: '/home'
                })
            }
        },
        // 菜单 - 关闭其它
        closeOther () {
            this.closeNavByCb((i, activeMenuIndex) => activeMenuIndex === i)
        },
        // 菜单 - 关闭左侧
        closeLeft () {
            this.closeNavByCb((i, activeMenuIndex) => activeMenuIndex <= i)
            this.$nextTick(() => {
                let { navList, activeIndex } = this
                this.moveToVisble(navList[activeIndex], activeIndex)
            })
        },
        // 菜单 - 关闭右侧
        closeRight () {
            this.closeNavByCb((i, activeMenuIndex) => activeMenuIndex >= i)
        },
        handleDragEnter (e, nav, index) {
            if (index === this.startIndex || nav.meta.draggable === false) {
                return
            }
            let { navList, startIndex } = this;
            [navList[index], navList[startIndex]] = [navList[startIndex], navList[index]]
            this.startIndex = index
            this.activeIndex = index
            navList.splice()
        },
        handleDragStart (e, nav, index) {
            this.startIndex = index
            this.handleSelect(nav, index)
            // e.dataTransfer.setData('text/plain', index)
        },
        handleDragEnd () {
            this.save()
        },
        changeRoute (name) {
            if (!name) return
            if (this.navList.length >= this.max) {
                // this.$info(MAX_OVER_MESSAGE)
                return
            }
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
                    if (index <= this.activeIndex) {
                        this.activeIndex -= 1
                    }
                    this.save()
                    resolve()
                }, 0)
            })
        }
    }
}
</script>

<style lang="less">
.layout-nav {
    height: @space * 5;
    .borderBottom();
    background-color: #fff;
    user-select: none;
    position: relative;
    flex-shrink: 0;

    .nav {
        height: 100%;
        display: flex;
        justify-content: space-between;
    }
    .nav-container {
        flex: 1;
        position: relative;
    }
    .nav-list {
        height: 100%;
        display: flex;
        position: absolute;
        white-space: nowrap;
        transition: left 300ms;
    }
    .nav-prev,
    .nav-item,
    .nav-next,
    .nav-down {
        min-width: 40px;
        padding: 0 10px;
        background-color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-shrink: 0;
        cursor: pointer;
        float: left;
    }
    .nav-prev,
    .nav-next {
        .borderRight();
        z-index: 1;
        position: relative;
    }
    .nav-item {
        min-width: 100px;
        .borderRight();
        position: relative;
        text-align: center;
        justify-content: space-between;
        &.active {
            background-color: @color-bg;
            &::before {
                content: '';
                top: 0;
                left: 0;
                width: 100%;
                height: 3px;
                background-color: @primary;
                z-index: 1;
                position: absolute;
            }
            &::after {
                content: '';
                top: 100%;
                left: 0;
                width: 100%;
                height: 1px;
                background-color:  @color-bg;
                position: absolute;
            }
        }
        &:hover {
            color: #000;
        }
    }
    .nav-next {
        .borderLeft();
    }
    .nav-down {
        padding: 0;
        z-index: 1;
        position: relative;
        &:hover {
            .nav-down-menu {
                display: block;
            }
        }
        .el-dropdown-link {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
    .nav-down-poper {
        top: 100%;
        right: 0;
        padding: @space;
        .border();
        min-width: 200px;
        background-color: #fff;
        position: absolute;
    }
    .nav-down-menu {
        top: 100%;
        right: -1px;
        min-width: 120px;
        max-width: 300%;
        max-height: 400px;
        .border();
        background-color: #fff;
        position: absolute;
        display: none;
        overflow: auto;
    }
    .nav-down-item,
    .nav-menu-item {
        padding: @space @space2;
        cursor: pointer;
        &:hover {
            color: @primary;
            background-color: @primary-bg;
        }
    }
    .nav-close {
        margin-left: 5px;
        color: #999;
        &:hover {
            color: #000;
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
        z-index: 12;
        position: absolute;
    }
}
</style>
