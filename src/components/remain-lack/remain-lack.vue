<template>
    <div class="remain-lack">
        <el-dialog
            title="提示"
            :visible.sync="visible"
            @close="$emit('update:show', false)"
            :show="show">
            <div class="dialog-wrapper">
                <div class="tip">帐户余额不足</div>
                <div class="btn-wrapper">
                    <el-button type="warning" size="small" @click.native="goPay">去充值</el-button>
                    <el-button size="small" @click.native="visible = false">取消</el-button>
                </div>
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
        },
        methods: {
            goPay () {
                this.visible = false;
                this.$router.push({
                    path: '/pay'
                });
            }
        }
    };
</script>

<style lang="scss">
    .remain-lack {
        .el-dialog {
            width: 342px;
        }
        .dialog-wrapper {
            .tip {
                padding-top: 5px;
                padding-bottom: 23px;
                text-align: center;
                font-size: 17px;
                font-weight: bold;
            }
            .btn-wrapper {
                text-align: center;
                .el-button {
                    width: 120px;
                }
            }
        }
    }
</style>
