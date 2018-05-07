<template>
    <div class="topbar">
        <div class="tel">
            010-53274715
        </div>
        <ul>
            <li>
                (+{{area_code}}){{cell_phone}}
            </li>
            <span class="seprate"></span>
            <li>
                余额：<span class="remain">{{available}}</span>元
                <div class="btn-wrapper">
                    <router-link to="/pay">
                        <button class="btn">
                            充值
                        </button>
                    </router-link>
                </div>
            </li>
            <span class="seprate"></span>
            <li>
                <router-link to="/notice" class="rel">通知中心
                    <i class="notice-count" :class="{dn: !+notice_count}">{{notice_count}}</i></router-link>
            </li>
            <span class="seprate"></span>
            <li>
                <router-link to="/suggest">投诉建议</router-link>
            </li>
            <!--<span class="seprate"></span>-->
            <!--<li style="padding: 0 15px 0 0;">-->
            <!--<span class="logout" style="cursor: pointer;"><router-link to="/doc">文档保全</router-link></span>-->
            <!--</li>-->
            <span class="seprate"></span>
            <li style="padding: 0;">
                <span class="logout" style="cursor: pointer;" @click="logout">退出登录</span>
            </li>
        </ul>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';

    export default {
        computed: {
            ...mapGetters([
                'cell_phone',
                'area_code',
                'available',
                'notice_count'
            ])
        },
        methods: {
            logout() {
                this.$store.dispatch('LogOut')
                    .then(() => {
                        location.reload();// 为了重新实例化vue-router对象 避免bug
                    });
            }
        }
    };
</script>

<style lang="scss">
    .topbar {
        box-sizing: border-box;
        width: 100%;
        height: 4.5rem;
        padding: 0 2rem;
        line-height: 4.5rem;
        background: #fff;
        .tel {
            float: left;
            padding-left: 28px;
            background: url('./service.png') no-repeat 0 50%;
        }
        ul {
            font-size: 0;
            text-align: right;
            li {
                position: relative;
                display: inline-block;
                font-size: 1.2rem;
                padding-right: 16px;
                padding-left: 30px;
                vertical-align: middle;
                &:nth-of-type(1) {
                    padding-left: 25px;
                    background: url('./avatar.png') no-repeat 0 50%;
                    background-size: 20px;
                }
                &:nth-of-type(2) {
                    padding-left: 28px;
                    background: url('./balance.png') no-repeat 0 50%;
                    background-size: 20px;
                }
                &:nth-of-type(3) {
                    padding-left: 28px;
                    background: url('./notice.png') no-repeat 0 50%;
                    background-size: 20px;
                }
                &:nth-of-type(4) {
                    padding-left: 28px;
                    background: url('./suggestion.png') no-repeat 0 50%;
                    background-size: 20px;
                }
                .btn-wrapper {
                    position: relative;
                    display: inline-block;
                    width: 75px;
                    .btn {
                        position: absolute;
                        top: -20px;
                        left: 0;
                        border: none;
                        background: #ff4949;
                        padding: 4px 18px;
                        margin: 0 7px;
                        border-radius: 5px;
                        font-size: 12px;
                        line-height: 20px;
                        color: #fff;
                        width:70px;
                        height: 30px;
                        vertical-align: middle;
                    }
                }
                .notice-count {
                    position: absolute;
                    top: -9px;
                    right: -12px;
                    font-size: 12px;
                    line-height: 12px;
                    color: #fff;
                    padding: 1px;
                    background-color: #f10215;
                    border-radius: 6px;
                    min-width: 12px;
                    text-align: center;
                    font-style: normal;
                }
            }
        }
        .seprate {
            padding: 8px 8px;
            border-left: 1px solid #999;
        }
    }
</style>
