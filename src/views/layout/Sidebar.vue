<template>
    <div class="sidebar">
        <h1 class="logo">
            <router-link to="/">
                <img src="./logo.png" alt="证宝宝" width="111" height="33">
            </router-link>
        </h1>
        <ul class="nav">
            <li>
                <router-link to="/print" class="icon-print"><span class="tab-link">网页取证</span></router-link>
            </li>
            <li v-if="userFlag">
                <router-link to="/robot" class="icon-robot pl12"><span class="tab-link">取证机器人</span></router-link>
            </li>
            <li>
                <router-link to="/doc" class="icon-safe"><span class="tab-link">文档保全</span></router-link>
            </li>
            <li>
                <router-link to="/file" class="icon-file"><span class="tab-link">文件管理</span></router-link>
            </li>
            <li>
                <router-link to="/trade" class="icon-trade"><span class="tab-link">交易流水</span></router-link>
            </li>
            <li>
                <router-link to="/pay" class="icon-pay"><span class="tab-link">充值中心</span></router-link>
            </li>
            <li>
                <router-link to="/user" class="icon-user"><span class="tab-link">用户设置</span></router-link>
            </li>
            <!-- <li>
                <router-link to="/robot" class="icon-user"><span class="tab-link">公证机器人</span></router-link>
            </li> -->
            <li>
                <!-- <router-link to="/robotBegin" class="icon-user"><span class="tab-link">公证机器人录制</span></router-link> -->
            </li>
        </ul>
        <div class="bottom">
            <div class="item">
                <span class="title">容量</span><br>
                <span class="all">{{used_size}}</span>/<span class="used">{{total_size}}</span>
                <div class="all-bar">
                    <div class="used-bar" :style="{width: usedPercent + '%'}"></div>
                </div>
            </div>
            <!--<div class="item">-->
            <!--<span class="title">赠送容量 :</span>-->
            <!--<span class="size">{{gift_available}}G</span>-->
            <!--</div>-->
            <div class="item">
                <span class="title">已购容量 :</span>
                <span class="size">{{total_size}}</span>
            </div>
            <template v-if="total_size">
                <div class="item">
                    <span class="title">到期时间 :</span>
                    <div class="time">{{expire_at}}</div>
                </div>
            </template>
            <router-link to="/buy">
                <button class="add" v-waves.button>
                    扩容
                </button>
            </router-link>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';

    export default {
        computed: {
            ...mapGetters([
                'total_size',
                'used_size',
                'expire_at',
                'gift_available',
                'size_percent'
            ]),
            usedPercent() {
                return this.size_percent > 100 ? 100 : this.size_percent;
            },
            userFlag() {
                return localStorage.getItem('userFlag') === '1';
            }
        },
        methods: {
            highLight(index) {
                this.currentTabIndex = index;
            }
        }
    };
</script>

<style lang="scss" scoped>

    @import url("../../common/scss/icon.scss");

    .sidebar {
        position: fixed;
        z-index: 999;
        top: 0;
        left: 0;
        bottom: 0;
        width: 180px;
        background: #1a253a;
        text-align: center;
        .logo {
            padding: 30px 0 24px;
        }
        .nav {
            li {
                /*margin: 1px 0;*/
                /*.active {*/
                /*box-shadow: 5px 0 0 #437dff inset;*/
                /*color: #437dff;*/
                /*background: #161f2f;*/
                /*}*/
                .router-link-active {
                    box-shadow: 5px 0 0 #437dff inset;
                    color: #437dff;
                    background: #161f2f;
                }
                a {
                    box-sizing: border-box;
                    display: inline-block;
                    width: 100%;
                    height: 47px;
                    line-height: 47px;
                    font-size: 14px;
                    color: #dfdfe1;
                    &:hover {
                        box-shadow: 5px 0 0 #437dff inset;
                        color: #437dff;
                        background: #161f2f;
                    }
                    .tab-link {
                        padding-left: 8px;
                    }
                }
            }
        }
        .bottom {
            box-sizing: border-box;
            width: 90%;
            position: absolute;
            bottom: 0;
            padding: 0 0 30px 35px;
            color: #b1b3b8;
            font-size: 1.3rem;
            text-align: left;
            .item {
                padding-bottom: 10px;
                line-height: 23px;
                width: 100%;
                .title {
                    position: relative;
                    &::after {
                        position: absolute;
                        top: 50%;
                        left: 0;
                        margin-top: -3px;
                        margin-left: -12px;
                        content: '';
                        width: 6px;
                        height: 6px;
                        border-radius: 50%;
                    }
                }
                &:nth-child(1) .title::after {
                    background: #437dff;
                }
                &:nth-child(2) .title::after {
                    background: #ebbe43;
                }
                &:nth-child(3) .title::after {
                    background: #eb4343;
                }
                .all-bar {
                    position: relative;
                    width: 100%;
                    height: 7px;
                    margin-top: 12px;
                    margin-bottom: 12px;
                    background: #243350;
                    .used-bar {
                        position: absolute;
                        height: 100%;
                        background: #437dff;
                    }
                }
            }
            .add {
                padding: 2px 20px;
                border: none;
                border-radius: 4px;
                outline: none;
                margin-top: 6px;
                margin-left: 18px;
                color: #fff;
                background: #4cd492;
                cursor: pointer;
                a {
                    color: #fff;
                }
            }
        }
    }
</style>
