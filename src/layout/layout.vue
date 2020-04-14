<template>
    <div class="layout">
        <layout-header :menuList="menuList" />
        <layout-menu-side :class="{ 'no-side': !hasSide }" :menuList="menuList" v-if="status === 'pass'" />
        <div class="layout-container" :class="{ 'no-side': !hasSide }" v-if="status === 'pass'">
            <layout-chrome-nav ref="nav" />
            <main class="layout-main" :class="{ nopadding }" v-if="status === 'pass'">
                <keep-alive>
                    <router-view :key="$route.fullPath" v-if="$route.meta.keepAlive" />
                </keep-alive>
                <router-view :key="$route.fullPath" v-if="!$route.meta.keepAlive" />
            </main>
        </div>
        <div class="full-loading" v-if="fullLoading" />
        <layout-report />
    </div>
</template>

<script>
import LayoutHeader from './layout-header'
import LayoutChromeNav from './layout-chrome-nav'
// import LayoutNav from './layout-nav'
import LayoutMenuSide from './layout-menu-side'
import LayoutReport from './layout-report'
import { mapState, mapActions } from 'vuex'
// eslint-disable-next-line no-unused-vars
import { getProfile, getUserMenu, getSystemConfig, checkToken } from '@/api/user'
import bus from '@/bus'

const listToMap = (list) => {
  let map = {}
  list.forEach(item => {
    map[item.id] = item
  })
  return map
}

// 从 map 里一层一层向上找，直到拼接出完成的 key，key 可能的结果是 'market.event.add'
const getKey = (item, map, keys = []) => {
  if (!item) return keys.join('.')
  let parent = map[item.parentid]
  if (parent && parent.menucode !== 'tailong-admin') {
    keys.unshift(item.menucode)
    return getKey(parent, map, keys)
  } else {
    return keys.join('.')
  }
}

// eslint-disable-next-line no-unused-vars
const getMenuAndBtn = (data, listToTree) => {
  if (data.every(item => item.id !== '297ee3ef6cff46ec016cff4e04230000')) {
    data.push({
      id: '297ee3ef6cff46ec016cff4e04230000',
      menucode: 'tailong-admin',
      parentid: '1',
      menuenable: '1',
      menutype: '1'
    })
  }
  // 转化为 tree
  let rootTree = listToTree({
    data: data.filter(item => item.menutype === '1'),
    parentKey: 'parentid',
    labelKey: 'menuname',
    childrenKey: 'children',
    valueKey: 'id',
    rootValue: '-1',
    format: (item) => {
      return {
        code: item.menucode,
        title: item.menuname,
        icon: item.iconurl || '',
        parentid: item.parentid,
        id: item.id,
        link: item.menuurl,
        isBtn: item.menutype === '5',
        children: item.children
      }
    }
  })
  // 转化为 map
  let map = listToMap(data)
  let result = []
  data.forEach(item => {
    if (item.menutype === '5') {
      let key = getKey(item, map)
      result.push(key)
    }
  })

  let root = rootTree.find(item => item.code === 'resRoot')

  return {
    menuList: root ? root.children : [],
    menuOptions: data.map(item => item.menuurl).filter(item => item),
    authList: result
  }
}

export default {
  components: {
    LayoutMenuSide,
    LayoutHeader,
    LayoutChromeNav,
    LayoutReport
    // LayoutNav
  },
  provide () {
    return {
      reload: this.reload,
      removeNav: this.removeNav
    }
  },
  data () {
    return {
      status: 'loading',
      isRouterAlive: true,
      menuList: [],
      hasSide: false
    }
  },
  computed: {
    ...mapState(['profile', 'fullLoading', 'token', 'config', 'menuOptions']),
    nopadding () {
      return this.$route.meta.nopadding
    }
  },
  watch: {
    $route () {
      this.handleRouteChange()
    },
    hasSide () {
      // this.doLayout()
    }
  },
  mounted () {
    this.init()
    bus.$on('menu-parent-show', this.handleMenuToggle)
    bus.$on('menu-select', this.handleMenuSelect)
  },
  methods: {
    ...mapActions(['setProfile', 'setAuthList', 'setConfig', 'logout', 'setMenuOptions']),
    async init () {
      this.status = 'loading'
      try {
        // await this.checkToken()
        if (this.config || !this.config.default_password) {
          // get system config
          let config = await getSystemConfig()
          this.setConfig(config.obj)
        }
        // get profile
        await this.$getOptionsForSystemParams('depId')
        let profile = await getProfile()
        this.setProfile(profile.obj)
        let params = {
          type: "'1', '5'",
          rootId: '0'
        }
        // get menuList & authList
        let UserMenu = await getUserMenu(params)
        let { menuList, authList, menuOptions } = getMenuAndBtn(UserMenu.obj, this.$util.listToTree)
        this.setAuthList(authList)
        this.setMenuOptions(menuOptions)
        this.menuList = menuList
        this.status = 'pass'
      } catch (e) {
        this.status = 'pass'
      }
    },
    // checkToken () {
    //     return new Promise((resolve, reject) => {
    //         let params = {
    //             token: this.token
    //         }
    //         checkToken(params).then(() => {
    //             resolve()
    //         }).catch(() => {
    //             this.logout().then(() => {
    //                 if (this.config.LOGOUT_HREF) {
    //                     window.location.href = this.config.LOGOUT_HREF
    //                 } else {
    //                     this.$router.replace('/login')
    //                 }
    //             })
    //         })
    //     })
    // },
    reload (key) {
      let { $route } = this
      this.$router.replace({
        path: $route.path,
        query: {
          ...$route.query,
          _: +new Date()
        }
      })
    },
    handleChange (name) {
      this.$refs.nav.changeRoute(name)
    },
    removeNav (name) {
      this.$refs.nav.removeNav(name)
    },
    handleMenuSelect (menu, level, parent) {
      if (level === 'sub' && menu.children) {
        let first = menu.children[0]
        if (first && first.link) {
          this.$router.push(first.link)
        }
      }
    },
    handleMenuToggle (show) {
      this.hasSide = show
    },
    doLayout () {
      if (this.status === 'loading') {
        return
      }
      this.status = 'loading'
      this.$nextTick(() => {
        this.status = 'pass'
      })
    },
    handleRouteChange () {
      let path = this.$route.path
      let whiteList = ['/home', '/login']
      if (this.$route.meta.show === true) {
        return
      }
      if (!this.menuOptions.includes(path) && !whiteList.includes(path)) {
        this.$router.replace('/noauth')
      }
    }
  }
}
</script>

<style lang="less">
html,
body,
#app,
.layout {
    height: 100%;
}
// .no-side {
//     .layout-container {
//         margin-left: 0;
//     }
//     .layout-menu-side {
//         display: none;
//     }
// }

.layout-menu-side {
    &.no-side {
        display: none;
    }
}
.layout-container {
    height: ~'calc(100% - 56px)';
    margin-left: 200px;
    background-color: @color-bg;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    flex-shrink: 0;
    position: relative;
    &.no-side {
        margin-left: 0;
    }
}
.layout-main {
    padding: @space * 1.5;
    flex: 1;
    overflow: auto;
    position: relative;
    &.nopadding {
        padding: 0
    }
}

.layout-error {
    left: 50%;
    width: 1000px;
    margin: @size 0;
    padding: @space;
    border-radius: @space2;
    box-shadow: 0 @space * .5 @space #d4d4d4;
    background-color: #fff;
    overflow: hidden;
    position: absolute;
    transform: translateX(-50%);
}
.layout-error-msg {
    width: 50%;
    padding: @space3 @space;
    margin: @size * 1.3 auto @size;
    border-radius: @space2;
    border: 6px solid @primary;
    box-shadow: @space @space2 @space2 fadeout(@primary, 70%);
    font-size: 30px;
    letter-spacing: 1px;
    color: @primary;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: rotate(10deg);
    position: relative;
    &::before,
    &::after {
        content: '';
        left: @size * 1.5;
        bottom: 100%;
        width: 5px;
        height: @size * 5;
        box-shadow: inherit;
        background-color: @primary;
        position: absolute;
        transform: rotate(-10deg);
        transform-origin: left bottom;
    }
    &::after {
        left: unset;
        right: @size * 1.5;
    }
}
.layout-error-info {
    margin: @size * 1.5 0;
    display: flex;
    justify-content: center;
    .left,
    .right {
        flex: 1;
        padding: 0 30px;
    }
    .left {
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }
    .right {
        color: #99a2aa;
        border-left: 1px dashed #ccd0d7;
    }
    p {
        margin: @space 0;
    }
}
</style>
