<template>
    <div class="paySuccess-container">
        <panel-title title="充值中心" border-left-color="#F7BA2A"></panel-title>
        <div class="content">
            <div class="pic-wrapper">
                <img src="./pay_success.png" alt="支付成功">
            </div>
            <div class="info">充值成功！</div>
            <div class="back">
                <el-button type="primary" @click.native="back">返回</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import PanelTitle from '../PanelTitle/PanelTitle';

    export default {
        methods: {
            back () {
                this.$router.push({
                    path: '/pay'
                });
            }
        },
        components: {
            PanelTitle
        }
    };
</script>

<style lang="scss">
    .paySuccess-container {
        .content {
            display: flex;
            flex-direction: column;
            align-items: center;
            background: #fff;
            min-height: calc(100vh - 142px);
            & > div {
                padding-bottom: 30px;
            }
            .info {
                font-size: 15px;
                color: #333;
            }
            .back {
                .el-button {
                    width: 120px;
                }
            }
            .pic-wrapper {
                padding-top: 60px;
            }
        }
    }
</style>
