<template>
  <div class="wrap df">
      <div class="title">
          <h1>证宝宝智能取证机器人</h1>
      </div>
        <div class="balance" v-if="userPassword===0">

        </div>
        <div class="balance" v-else>
            <!-- <img class="vm" src="../img/balance.png" alt="">
            <h2 class="f14 dib vm color-white" id="vncpassword">vnc密码:{{userPassword}}</h2>
            <el-button class="" @click="copy(userPassword)" size="small">复制密码</el-button> -->
        </div>
        <!-- <div class="balance">
            <img class="vm" src="../img/balance.png" alt="">
            <h2 class="f14 dib vm color-white">vnc密码:dsfajierofjsd{{userPassword}}</h2>
        </div> -->
        <div class="balance">
            <div class="">
                <img class="vm" src="../img/balance.png" alt="">
                <h2 class="f14 dib vm color-white">账户余额：{{userBalance}}元</h2>&nbsp;
                <el-tooltip placement="top" class="">
                    <div slot="content">该余额信息仅供参考,待录制成功后才会正式<br/>计费,若录制失败会退还本次录制所消耗的余额.  </div>
                    <span class="f16 color-white"> <img class="vm" src="./roundabout.png" alt="" width="17" height="17"></span>
                </el-tooltip>
            </div>
        </div>
        <div class="recordingTime">
            <img class="vm" src="../img/time.png" alt="">
            <h2 class="f14 vm dib color-white">可以录制：{{availHour}}小时{{availMinute}}分钟{{availSecond}}秒</h2>
        </div>
  </div>
</template>
<script>
// import {detail} from '../../../../api/robot/detail.js';
// import {test} from '../../../../api/robot/test.js';
// import {getToken} from '../../../../utils/auth';
export default {
    created() {
        // this.getDetails();
    },
    data() {
        return {
            user: {
                balance: 99,
                recordingTime: 99
            }
        };
    },
    props: ['userTime', 'userBalance', 'userPassword', 'availHour', 'availMinute', 'availSecond'],
    methods: {
        copy(text) {
            var textArea = document.createElement('textarea');
            textArea.style.position = 'fixed';
            textArea.style.top = 0;
            textArea.style.left = 0;
            textArea.style.width = '2em';
            textArea.style.height = '2em';
            textArea.style.padding = 0;
            textArea.style.border = 'none';
            textArea.style.outline = 'none';
            textArea.style.boxShadow = 'none';
            textArea.style.background = 'transparent';
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                var msg = document.execCommand('copy') ? '成功' : '失败';
                if (msg) {
                    this.$message({
                        type: 'success',
                        message: '复制成功'
                    });
                }
                console.log('复制内容 ' + msg);
            } catch (err) {
                console.log('不能使用这种方法复制内容');
            }
            document.body.removeChild(textArea);
        }
    }
};
</script>
<style lang="scss" scoped>
    @import url('../../../../common/scss/index.scss');
    .wrap {
        height: 70px;
        background-color: #306ffc;
        .title {
            flex: 3;
            h1 {
                font-size: 16px;
                color: #ffffff;
                line-height: 70px;
                padding: 0 20px;
            }
        }
        .balance{
            line-height: 70px;
            flex: 2;
            .balance_item{
                display: flex;
                align-items: center;
            }
        }
        .recordingTime{
            line-height: 70px;
            flex: 2;
        }

    }
</style>


