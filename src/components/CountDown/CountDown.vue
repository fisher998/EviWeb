<template>
    <el-button type="primary" size="small" @click="start" :disabled="time > 0">{{text}}</el-button>
</template>

<script>
    export default {
        data () {
            return {
                time: 0
            };
        },
        props: {
            startTime: {
                type: Number,
                default: 60
            }
        },
        computed: {
            text () {
                return this.time > 0 ? `重新发送(${this.time})` : '获取验证码';
            }
        },
        methods: {
            start () {
                this.$emit('start');
                this.time = this.startTime;
                this.timer();
            },
            timer() {
                if (this.time > 0) {
                    this.time--;
                    setTimeout(this.timer, 1000);
                }
            }
        }
    };
</script>

<style>

</style>
