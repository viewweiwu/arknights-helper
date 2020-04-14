export const defaultMenuList = [
    {
        id: '1',
        title: '首页',
        link: '/home'
    },
    {
        id: '2',
        title: '业绩中心',
        children: [
            {
                id: '2-1',
                title: '我的绩效',
                link: '/kpi/center'
            },
            {
                id: '2-2',
                title: '业绩报表',
                link: '/kpi/report',
                children: [
                    {
                        id: '2-2-1',
                        title: '最近访问',
                        link: '/kpi/report/recent'
                    },
                    {
                        id: '2-2-2',
                        title: '报表收藏',
                        link: '/kpi/report/collect'
                    },
                    {
                        id: '2-2-3',
                        title: '精准营销',
                        link: '/kpi/report/market'
                    },
                    {
                        id: '2-2-4',
                        title: '业务线条',
                        link: '/kpi/center'
                    },
                    {
                        id: '2-2-5',
                        title: '支行特色'
                    }
                ]
            },
            {
                id: '2-3',
                title: '业绩认定',
                children: [
                    {
                        id: '2-3-1',
                        title: '存款认定',
                        link: '/kpi/claim/deposit'
                    },
                    {
                        id: '2-3-2',
                        title: '贷款认定',
                        link: '/kpi/claim/loan'
                    },
                    // {
                    //     id: '2-3-3',
                    //     title: '中间业务认定',
                    //     link: '/kpi/claim/intermediary'
                    // },
                    {
                        id: '2-3-4',
                        title: '其它业务认定',
                        link: '/kpi/claim/other'
                    }
                ]
            },
            {
                id: '2-4',
                title: '业绩审批',
                link: '/kpi/oa'
            }
        ]
    },
    {
        id: '3',
        title: '配置中心',
        children: [
            {
                id: '3-1',
                title: '指标管理',
                children: [
                    {
                        id: '3-1-1',
                        title: '指标管理',
                        link: '/config/norm/index'
                    },
                    {
                        id: '3-1-2',
                        title: '参数设置',
                        link: '/config/norm/param'
                    },
                    {
                        id: '3-1-3',
                        title: '交易码设置',
                        link: '/config/norm/tradecode'
                    },
                    {
                        id: '3-1-4',
                        title: '定价查询',
                        link: '/config/norm/setprice'
                    }
                ]
            },
            {
                id: '3-2',
                title: '方案管理',
                children: [
                    {
                        id: '3-2-1',
                        title: '方案管理',
                        link: '/config/plan/scheme'
                    },
                    {
                        id: '3-2-2',
                        title: '模板管理',
                        link: '/config/plan/template'
                    },
                    {
                        id: '3-2-3',
                        title: '考核角色',
                        link: '/config/plan/assess'
                    }
                ]
            }
        ]
    },
    {
        id: '4',
        title: '营销中心',
        children: [
            {
                id: '4-1',
                title: '任务管理',
                children: [
                    {
                        id: '4-1-1',
                        title: '任务制定',
                        link: '/market/task/appoint'
                    },
                    {
                        id: '4-1-2',
                        title: '任务分配',
                        link: '/market/task/distribute'
                    },
                    {
                        id: '4-1-3',
                        title: '任务查询',
                        link: '/market/task/query'
                    }
                ]
            }
        ]
    },
    {
        id: '5',
        title: '维护中心',
        name: '/maintain',
        children: [
            {
                id: '5-1',
                title: '业绩管理',
                name: '/maintain/kpi',
                children: [
                    {
                        id: '5-1-1',
                        title: '招标类账户',
                        link: '/maintain/kpi/bidding'
                    },
                    {
                        id: '5-1-2',
                        title: '存款类账户',
                        link: '/maintain/kpi/deposit'
                    },
                    {
                        id: '5-1-3',
                        title: '贷款类账户',
                        link: '/maintain/kpi/loan'
                    },
                    {
                        id: '5-1-4',
                        title: '考核角色参数设置',
                        link: '/maintain/kpi/role'
                    },
                    {
                        id: '5-1-5',
                        title: '二次分配薪酬设置',
                        link: '/maintain/kpi/setting'
                    },
                    {
                        id: '5-1-6',
                        title: '二次分配薪酬维护',
                        link: '/maintain/kpi/maintain'
                    }
                ]
            }
        ]
    },
    {
        id: '6',
        title: '补录中心',
        children: [
            {
                id: '6-1',
                title: '补录管理',
                children: [
                    {
                        id: '6-1-1',
                        title: '补录模板',
                        link: '/data/manage/template'
                    },
                    {
                        id: '6-1-2',
                        title: '数据冻结配置',
                        link: '/data/manage/freeze'
                    },
                    {
                        id: '6-1-3',
                        title: '数据权限控制',
                        link: '/data/manage/authority'
                    },
                    {
                        id: '6-1-4',
                        title: '数据补录',
                        link: '/data/manage/supplement'
                    }
                ]
            }
        ]
    },
    {
        id: '7',
        title: '系统管理',
        children: [
            {
                id: '7-1',
                title: '系统菜单',
                children: [
                    {
                        id: '7-1-1',
                        title: '菜单管理',
                        link: '/system/menu'
                    },
                    {
                        id: '7-1-2',
                        title: '机构管理',
                        link: '/system/org'
                    },
                    {
                        id: '7-1-3',
                        title: '角色管理',
                        link: '/system/role'
                    },
                    {
                        id: '7-1-4',
                        title: '用户管理',
                        link: '/system/user'
                    },
                    {
                        id: '7-1-5',
                        title: '权限管理',
                        link: '/system/permission'
                    },
                    {
                        id: '7-1-6',
                        title: '业务参数管理',
                        link: '/system/param'
                    },
                    {
                        id: '7-1-7',
                        title: '系统参数管理',
                        link: '/system/configure'
                    },
                    {
                        id: '7-1-8',
                        title: '日志管理',
                        link: '/system/log'
                    }
                ]
            },
            {
                title: '流程管理',
                children: [
                    {
                        id: '7-2-1',
                        title: '待办事项',
                        link: '/system/wait'
                    },
                    {
                        id: '7-2-2',
                        title: '通知管理',
                        link: '/system/message'
                    },
                    {
                        id: '7-2-3',
                        title: '流程部署',
                        link: '/system/process'
                    },
                    {
                        id: '7-2-4',
                        title: '版本管理',
                        link: '/system/version'
                    },
                    {
                        id: '7-2-5',
                        title: '任务参数配置',
                        link: '/system/task-params'
                    }
                ]
            },
            {
                id: '7-3',
                title: '报表服务管理',
                children: [
                    {
                        id: '7-3-1',
                        title: '报表分类管理',
                        link: '/system/report/sort'
                    },
                    {
                        id: '7-3-2',
                        title: '服务器管理',
                        link: '/system/report/server'
                    },
                    {
                        id: '7-3-3',
                        title: '参数模板管理',
                        link: '/system/report/templete'
                    },
                    {
                        id: '7-3-4',
                        title: '报表信息管理',
                        link: '/system/report/info'
                    },
                    {
                        id: '7-3-5',
                        title: '报表参数管理',
                        link: '/system/report/params'
                    },
                    {
                        id: '7-3-6',
                        title: '报表访问统计',
                        link: '/system/report/statistic'
                    },
                    {
                        id: '7-3-7',
                        title: '报表权限分配',
                        link: '/system/report/authority'
                    }
                ]
            }
        ]
    },
    {
        id: '8',
        title: '产品管理',
        children: [
            {
                id: '8-1',
                title: '产品管理',
                children: [
                    {
                        id: '8-1-1',
                        title: '产品管理',
                        link: '/product/center'
                    },
                    {
                        id: '8-1-2',
                        title: '推荐产品设置',
                        link: '/product/priority'
                    }
                ]
            }
        ]
    }
]
