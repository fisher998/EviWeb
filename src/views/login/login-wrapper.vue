<template>
    <div class="mask">
        <div class="mask-container">
            <div class="logo"></div>
            <div class="welcome-wrapper"></div>
            <div class="login-container">
                <transition name="fade" mode="out-in">
                    <router-view></router-view>
                </transition>
            </div>
        </div>
    </div>
</template>

<script></script>

<style lang="scss">
    @import '../../common/scss/animate.css';

    .mask {
        position: absolute;
        width: 100%;
        height: 100%;
        background: url("./bg.png") no-repeat center;
        background-size: cover;
        .mask-container {
            position: relative;
            width: 1020px;
            height: 100%;
            margin: 0 auto;
            .logo {
                position: absolute;
                top: 20px;
                left: 0;
                width: 100px;
                height: 50px;
                background: url("./logo.svg") no-repeat;
            }
        }
        .welcome-wrapper {
            position: absolute;
            top: 50%;
            left: 0;
            width: 450px;
            height: 90px;
            margin-top: -100px;
            background: url("./welcome.png"), url("./desc.png");
            background-repeat: no-repeat;
            background-size: contain, 360px 22px;
            background-position: 0 0, 0 65px;
        }
    }

    .login-container {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        margin: auto;
        width: 404px;
        height: 525px;
        background: #fff;
        box-shadow: 0 0 8px -2px rgba(0, 0, 0, .2);
        overflow: hidden;
        .fade-enter-active {
            animation: slideInRight .4s;
        }
        .fade-leave-active {
            animation: slideInLeft .4s reverse;
        }
    }
</style>
