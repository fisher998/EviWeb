<template>
    <div class="wrap">
        <div class="center">
            <h1 class="f24">"智能取证机器人"使用须知</h1>
            <div class="line"></div>
            <div class="section">
                <p class="f16">
                    1. 点击左下方"开始取证"按钮后开始取证过程，同时进行计费。
                </p>
                <p class="f16">
                    2. 点击"开始录制"按钮后请勿直接关闭浏览器窗口，否则会继续计费一段时间，以免对您的金钱造成不必要的浪费。
                </p>
                <p class="f16">
                    3. 点击"停止取证"按钮结束取证，同时计费停止。方可关闭浏览器窗口或者直接退出浏览器
                </p>
                <p class="f16" style="color:red">
                    请务必不要在Windows中直接进行“关机”操作，这样会导致你的取证失败，并使你的账号被冻结。
                </p>
            </div>

        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            // height: window.screen.availHeight - 140
        };
    }
};
</script>
<style lang="scss" scoped>
    .wrap{
        color: #333333;
        min-height: calc(100vh - 140px);
        // min-height: calc(100vh);
        display: flex;
        align-items: center;
        .center{
            // padding-top: 15%;
            padding-left: 15%;
            .line {
                width: 26px;
                height: 4px;
                background-color: #333333;
                margin-top: 20px;
            }
            .section {
                margin-top: 40px;
                line-height: 40px;
            }
        }
    }
</style>


