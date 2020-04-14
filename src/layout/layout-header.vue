<template>
    <header class="layout-header">
        <div class="layout-header-left">
            <div class="logo" @click="reload">
                <img class="logo-img" src="../assets/images/logo.png" alt=""><!-- width="153" -->
            </div>
            <layout-menu :menuList="menuList" />
        </div>
        <div class="layout-header-right">
            <div class="menu">
                <el-popover
                    title="系统数据时间"
                >
                    <p v-for="date in dateList" :key="date">您可以查看<span class="font-primary"> {{ date }} </span>的绩效</p>
                    <yt-icon slot="reference" icon="header-setting" :size="24" />
                </el-popover>
            </div>
            <div class="menu">
                <yt-icon icon="header-help" :size="24" @click="download" />
            </div>
            <div class="menu">
                <el-badge :value="waitCount">
                    <yt-icon icon="header-list" :size="24" @click="goWait" />
                </el-badge>
            </div>
            <div class="menu">
                <el-badge :value="messageCount">
                    <yt-icon icon="header-tip" :size="24" @click="goMessage" />
                </el-badge>
            </div>
            <p class="menu" v-if="config.SHOW_PROFILE_MENU === '0'" @click="showDetail">
                    <yt-icon icon="header-avatar mr" :size="24" />
                <span class="layout-header-name">{{ profile.realName }}</span>
            </p>
            <el-dropdown v-else class="menu" placement="bottom-start" @command="handleCommand">
                <span class="el-dropdown-link">
                    <yt-icon icon="header-avatar mr" :size="24" />
                    <span class="layout-header-name">{{ profile.realName }}</span>
                    <yt-icon icon="el-icon-arrow-down" />
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="profile">用户信息</el-dropdown-item>
                    <el-dropdown-item command="update">修改密码</el-dropdown-item>
                    <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <yt-dialog-form
            defaultTitle="用户信息"
            ref="form"
            autoloadOptions
            :fields="fields"
            :formExtend="{ grid: [2, 2, 2, 2, 2, 1], contentWidth: '100%' }"
            :dialogExtend="{ width: 800 }"
        />
        <yt-dialog-form
            ref="edit"
            name="密码"
            :fields="fieldsByPassword"
            :updateApi="updateApi"
            :beforeSubmit="beforeSubmit"
            :dialogExtend="{ width: 400 }"
        />
    </header>
</template>

<script>
import { updatePassword, getMessageCount, getWaitCount, downloadCategory, getReportCount } from '@/api/user'
import { mapState, mapActions } from 'vuex'
import LayoutMenu from './layout-menu'

export default {
    inject: ['reload'],
    components: {
        LayoutMenu
    },
    props: {
        menuList: {
            type: Array,
            default: () => []
        }
    },
    data () {
        return {
            dialog: false,
            updateApi: updatePassword,
            messageCount: null,
            waitCount: null,
            dateList: [],
            fields: [
                { title: '用户账号', key: 'userName', type: 'input' },
                { title: '用户姓名', key: 'realName', type: 'input' },
                { title: '所属机构', key: 'orgName', type: 'input' },
                { title: '权限机构', key: 'rootOrgName', type: 'input' },
                { title: '证件号', key: 'idCard', type: 'input' },
                { title: '联系方式', key: 'contact', type: 'input' },
                { title: '岗位', key: 'positionId', type: 'select', options: [] },
                { title: '用户类型', key: 'type', type: 'select', options: [] },
                { title: '在职状态', key: 'state', type: 'select', options: [] },
                { render: () => {} }
            ],
            fieldsByPassword: [
                {
                    title: '原密码',
                    key: 'oldPwd',
                    type: 'password',
                    isRequired: true
                },
                {
                    title: '新密码',
                    key: 'newPwd',
                    type: 'password',
                    isRequired: true
                },
                {
                    title: '确认密码',
                    key: 'rePwd',
                    type: 'password',
                    isRequired: true
                }
            ]
        }
    },
    computed: {
        ...mapState(['profile', 'config'])
    },
    created () {
        this.init()
        this.getProfile()
    },
    methods: {
        ...mapActions(['getProfile', 'logout']),
        init () {
            this.loadMessage()
            this.loadWait()
            this.loadReport()
        },
        loadMessage () {
            let params = {}
            getMessageCount(params).then(data => {
                this.messageCount = data.obj || null
            })
        },
        loadWait () {
            let params = {}
            getWaitCount(params).then(data => {
                this.waitCount = data.total || null
            })
        },
        loadReport () {
            let params = {}
            getReportCount(params).then(data => {
                this.dateList = data.obj
            })
        },
        handleCommand (command) {
            switch (command) {
                case 'profile':
                    this.showDetail()
                    break
                case 'update':
                    this.$refs.edit.update().then(() => {
                        this.$success('修改密码成功！')
                    })
                    break
                case 'logout':
                    this.$confirm('确定要退出登录吗？', '退出提示').then(() => {
                        this.logout().then(() => {
                            if (this.config.LOGOUT_HREF) {
                                window.location.href = this.config.LOGOUT_HREF
                            } else {
                                this.$router.replace('/login')
                            }
                        })
                    })
                    break
            }
        },
        showDetail () {
            let profile = this.profile
            this.$refs.form.view(profile)
        },
        beforeSubmit (params) {
            if (params.rePwd !== params.newPwd) {
                this.$info('确认密码需要跟新密码相同')
                return false
            }
            delete params.rePwd
            return true
        },
        goMessage () {
            this.$router.push({
                path: '/system/message',
                query: {
                    _: Date.now()
                }
            })
        },
        goWait () {
            this.$router.push({
                path: '/system/wait',
                query: {
                    _: Date.now()
                }
            })
        },
        download () {
            downloadCategory()
        }
    }
}
</script>

<style lang="less">
.layout-header {
    height: 56px;
    .borderBottom();
    flex-shrink: 0;
    color: #fff;
    background-color: #fff;
    background-image: linear-gradient(90deg, #157392, #073271);
    position: relative;
    display: flex;
    justify-content: space-between;

    .layout-header-left {
        flex: 1;
        display: flex;
        align-items: center;
    }
    .logo {
        height: 100%;
        padding: @space;
    }
    .logo-img {
        height: 100%;
    }
    .menu {
        height: 100%;
        padding: 0 @space * 1.2;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    }
    .el-dropdown-link {
        outline: none !important;
        .flex();
    }
    .layout-header-name {
        margin-right: @space * .5;
        vertical-align: middle;
    }
    .user-form {
        input {
            color: #333 !important;
            background-color: #fff !important;
            cursor: unset !important;
        }
        .el-icon-arrow-up {
            display: none;
        }
    }
    .el-badge__content {
        border: none;
        color: #fff;
        background-color: #D23F2E;
    }
}
.layout-header-right {
    padding-right: @space;
    display: flex;
}
</style>
