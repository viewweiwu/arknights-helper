<template>
    <component :is="isSubMenu ? 'el-submenu' : 'el-menu-item'" :index="menu.id">
        <template slot="title" v-if="isSubMenu">{{ menu.title }}</template>
        <template v-else>{{ menu.title }}</template>
        <template v-if="isSubMenu">
            <layout-menu-item
                v-for="sub in menu.children"
                :key="sub.title"
                :menu="sub"
            />
        </template>
    </component>
</template>

<script>
export default {
    name: 'layout-menu-item',
    props: {
        menu: {
            type: Object,
            default: () => ({})
        }
    },
    computed: {
        isSubMenu () {
            let { menu } = this
            return menu.children && menu.children.length
        }
    }
}
</script>
