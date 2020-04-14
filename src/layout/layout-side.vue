<template lang="html">
    <aside class="layout-side">
        <div class="side-logo" @click="toHome">
            <img height="30" src="@/assets/images/logo-simple.png" alt="">
        </div>
        <div class="side-menu" @mouseenter="handleEnter" @mouseleave="handleLeave">
            <div
                v-for="(menu, i) in menuList"
                :key="menu.title"
                class="side-menu-item"
                :class="{ active: isActive(menu, i) }"
                @mouseenter="handleMouseover(menu, i, $event)"
            >
                <yt-icon :icon="menu.icon || 'el-icon-picture-outline'" :size="20"></yt-icon>
                <p class="side-menu-label">{{ menu.title }}</p>
            </div>
            <div ref="pop" class="side-pop" @mouseenter="handleEnter" :style="popStyle" v-show="isPopShow">
                <div class="side-pop-content">
                    <div
                        class="side-pop-item"
                        v-for="option in popOptions"
                        :key="option.title"
                        @click.stop="handleSelect(option)"
                    >
                        {{ option.title }}
                        <yt-icon class="fr" icon="el-icon-arrow-right" v-if="option.children && option.children.length" />
                        <div class="side-pop side-pop-children" v-if="option.children && option.children.length">
                            <div class="side-pop-content">
                                <div
                                    class="side-pop-item side-child"
                                    v-for="child in option.children"
                                    :key="child.title"
                                    @click.stop="handleSelect(child)"
                                >
                                    <p>
                                        {{ child.title }}
                                        <yt-icon class="fr" icon="el-icon-arrow-right" v-if="child.children && child.children.length" />
                                    </p>
                                    <div class="side-pop side-pop-children" v-if="child.children && child.children.length">
                                        <div class="side-pop-content">
                                            <div
                                                class="side-pop-item"
                                                v-for="sub in child.children"
                                                :key="sub.link + sub.title"
                                                @click.stop="handleSelect(sub)"
                                            >
                                                {{ sub.title }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </aside>
</template>

<script>
export default {
    props: {
        menuList: {
            type: Array,
            default: () => []
        }
    },
    data () {
        return {
            activeIndex: 0,
            popTop: 0,
            isPopShow: false,
            subIndex: null
        }
    },
    computed: {
        popOptions () {
            if (!this.menuList.length) {
                return []
            }
            return this.menuList[this.activeIndex].children
        },
        popStyle () {
            return {
                top: this.popTop + 'px'
            }
        }
    },
    methods: {
        toHome () {
            this.$router.push('/home')
        },
        handleMouseover (menu, i, e) {
            let $el = e.target
            let top = $el.offsetTop
            this.activeIndex = i
            this.popTop = top
            this.$nextTick(() => {
                this.fixTop()
            })
        },
        fixTop () {
            let top = this.popTop
            let $pop = this.$refs.pop
            let rect = $pop.getBoundingClientRect()
            let windowHeight = window.innerHeight
            if (windowHeight - rect.height < top) {
                this.popTop = windowHeight - rect.height - 44
            }
        },
        handleEnter () {
            this.timer && clearTimeout(this.timer)
            this.isPopShow = true
        },
        handleLeave () {
            this.timer && clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.isPopShow = false
            }, 100)
        },
        handleSelect (option) {
            this.$emit('change', option.link)
        },
        isActive (menu, i) {
            if (this.isPopShow && i === this.activeIndex) {
                return true
            }
            let path = this.$route.path
            for (let i = 0; i < menu.children.length; i++) {
                let item = menu.children[i]
                if (item.link === path) {
                    return true
                } else if (item.children && item.children.length) {
                    for (let j = 0; j < item.children.length; j++) {
                        if (item.children[j].link === path) {
                            return true
                        }
                    }
                }
            }
            return false
        }
    }
}
</script>

<style lang="less">
.layout-side {
    top: 0;
    left: 0;
    width: @size;
    height: 100%;
    .borderRight(#DBE3EA);
    // box-shadow: 0 0 4px rgba(135, 145, 162, 0.4);
    z-index: 1000;
    background-color: @bg;
    position: fixed;
    user-select: none;
}
.side-logo {
    height: 50px;
    font-size: 20px;
    color: #fff;
    z-index: 1;
    background-color: #6DA6F1;
    background-image: linear-gradient(120deg, #6DA6F1, #3B6DDF);
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    cursor: pointer;
}
.side-menu {
    position: relative;
}
.side-menu-label {
    margin-top: @space;
}
.side-menu-item {
    height: @size;
    .borderBottom(#DBE3EA);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    position: relative;
    animation: menu-item-show 500ms;
    &.active {
        border-color: transparent;
        color: #fff;
        background-color: #6DA6F1;
        background-image: linear-gradient(120deg, #6DA6F1, #3B6DDF);
    }
    &:hover {
        // background-color: #3B6DDF;
    }
    &:first-of-type {
        .borderTop(#DBE3EA);
    }
}
@keyframes menu-item-show {
    0% { opacity: .5;transform: translateY(-100%); }
    100% { opacity: 1; transform: translateY(0); }
}
.side-pop {
    left: 100%;
    margin-top: -@space;
    padding: @space;
    position: absolute;
    transition: 100ms ease-out;
}
.side-pop-content {
    min-width: 220px;
    // min-height: 100px;
    padding: 10px 0;
    border-radius: @space * .5;
    color: #fff;
    background-color: #6DA6F1;
    background-image: linear-gradient(120deg, #6DA6F1, #3B6DDF);
    z-index: 2;
    position: relative;
}
.side-pop-item {
    font-size: @space2;
    padding: @space;
    cursor: pointer;
    white-space: nowrap;
    transition: padding-left 100ms;
    position: relative;
    &:hover {
        padding-left: 20px;
        color: #333;
        background-color: #fff;
        .side-pop-children {
            display: block;
        }
    }
}
.side-pop-children {
    top: -2px;
    margin-top: -@space2;
    display: none;
}
.side-child .side-pop-content {
    display: none;
}
.side-child {
    &:hover {
        .side-pop-content {
            display: block;
        }
    }
}
</style>
