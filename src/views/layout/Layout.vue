<template>
    <div class="app-wrapper">
        <keep-alive>
            <sidebar></sidebar>
        </keep-alive>
        <div class="content">
            <keep-alive>
                <topbar></topbar>
            </keep-alive>
            <div class="main">
                <template>
                    <transition name="fade" mode="out-in">
                        <router-view :key="key"></router-view>
                    </transition>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
    import sidebar from './Sidebar';
    import topbar from './Topbar';

    export default {
        name: 'app',
        computed: {
            key() {
                return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date();
            }
        },
        components: {
            sidebar,
            topbar
        }
    };
</script>

<style lang="scss" scoped>
    @import '../../common/scss/animate.css';

    .app-wrapper {
        .content {
            margin-left: 180px;
            .main {
                padding: 0 2rem;
            }
        }
        .fade-enter-active {
            animation: fadeIn .2s;
        }

        .fade-leave-active {
            animation: fadeIn .2s reverse;
        }
    }
</style>
