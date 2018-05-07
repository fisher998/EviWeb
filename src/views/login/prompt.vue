<template>
    <div class="dialog-container">
        <el-dialog
            title="提示"
            :visible.sync="visible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :show-close="false"
            @close="$emit('update:show', false)"
            :show="show">
            <div class="content">
                “温馨提示：当前版本为体验版，仅供亲们体验证宝宝功能使用。体验期结束后，保全数据和体验余额将会被清空，请不要保全重要数据。”
            </div>
            <div class="btn-wrapper">
                <el-button type="primary" class="w120" @click="$emit('open')">确定</el-button>
            </div>
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
            }
        },
        watch: {
            show () {
                this.visible = this.show;
            }
        }
    };
</script>

<style lang="scss">
    .dialog-container {
        .el-dialog {
            width: 400px;
            .content {
                font-size: 15px;
                font-weight: bold;
                line-height: 25px;
            }
            .btn-wrapper {
                text-align: center;
                margin-top: 20px;
            }
        }
    }
</style>
