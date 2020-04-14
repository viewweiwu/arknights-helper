<template>
    <div class="layout-menu">
        <ul class="layout-menu-list">
            <li
                v-for="menu in menuList"
                :key="menu.id"
                class="layout-menu-item"
                @click.stop="handleSelect(menu, 'root')"
            >
                <span>{{ menu.title }}</span>
                <div class="layout-menu-poper" v-if="menu.children && menu.children.length">
                    <ul class="poper-list">
                        <li
                            v-for="sub in menu.children"
                            :key="sub.id"
                            class="poper-item"
                            @click.stop="handleSelect(sub, 'sub', menu)"
                        >{{ sub.title }}</li>
                    </ul>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
// import { defaultMenuList } from './layout-menu-data'
import bus from '@/bus'

export default {
    props: {
        menuList: {
            type: Array,
            default: () => []
        }
    },
    // data () {
    //     return {
    //         menuList: defaultMenuList
    //     }
    // },
    methods: {
        handleSelect (menu, level, parent) {
            if (['root', 'sub'].includes(level) && !menu.children.length && menu.link) {
                this.$router.push(menu.link)
            }
            bus.$emit('menu-select', menu, level, parent)
        }
    }
}
</script>

<style lang="less">
.layout-menu {
    height: 100%;
}
.layout-menu-list {
    height: 100%;
    display: flex;
}
.layout-menu-item {
    flex: 1;
    padding: 0 @space2;
    cursor: pointer;
    white-space: nowrap;
    position: relative;
    .flex();
    &:hover {
        background-color: rgba(255, 255, 255, .1);
        .layout-menu-poper {
            display: block;
        }
    }
}
.layout-menu-poper {
    top: 100%;
    left: 0;
    min-width: 100%;
    border-radius: 4px;
    box-shadow: 0 0 5px rgba(0, 0, 0, .2);
    padding: @space;
    color: #333;
    background-color: #fff;
    z-index: 11;
    position: absolute;
    display: none;
    .poper-list {
        .flex();
    }
    .poper-item {
        padding: @space;
        position: relative;
        &:hover {
            color: #58abce;
        }
    }
    .poper-item + .poper-item {
        &::after {
            content: '';
            top: 50%;
            left: 0;
            height: 50%;
            width: 1px;
            .borderLeft(#ccc);
            position: absolute;
            transform: translateY(-50%);
        }
    }
}
</style>
