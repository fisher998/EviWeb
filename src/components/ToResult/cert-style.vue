<template>
    <transition name="fade" mode="out-in">
        <div class="certStyle-container" v-if="visible">
            <div class="close" @click="close"></div>
            <div class="cert-wrapper">
                <img src="./cert_style.png" alt="证书样式">
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        props: {
            visible: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            close () {
                this.$emit('update:visible', false);
            }
        }
    };
</script>

<style lang="scss">
    .fade-enter-active {
        animation: fadeIn .3s;
    }

    .fade-leave-active {
        animation: fadeIn .3s reverse;
    }

    .certStyle-container {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: rgba(229, 229, 229, .95);
        z-index: 99994;
        overflow: auto;
        padding: 50px 0;
        .close {
            position: absolute;
            top: 10px;
            right: 10px;
            width: 38px;
            height: 38px;
            background: url("./btn_close.png") no-repeat 0 0;
            cursor: pointer;
            &:hover {
                background: url("./btn_close.png") no-repeat 0 -50px;
            }
        }
        .cert-wrapper {
            text-align: center;
            img {
                width: 60%;
            }
        }
    }
</style>
