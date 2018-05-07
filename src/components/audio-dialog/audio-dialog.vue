<template>
    <div class="dialog-container">
        <el-dialog
            class="audio-dialog"
            :visible.sync="visible"
            @close="close"
            :show="show">
            <audio ref="audio" :src="src" controls autoplay></audio>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                visible: this.show
            };
        },
        props: {
            show: {
                type: Boolean,
                default: false
            },
            src: {
                type: String
            }
        },
        watch: {
            show () {
                this.visible = this.show;
            }
        },
        methods: {
            close () {
                this.$emit('update:show', false);
                this.$refs.audio.pause();
            }
        }
    };
</script>

<style lang="scss">
    .audio-dialog {
        text-align: center;
        .el-dialog {
            width: 360px;
            height: 65px;
            text-align: center;
        }
        .el-dialog__header {
            display: none;
        }
    }
</style>
