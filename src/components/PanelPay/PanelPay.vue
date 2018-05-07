<template>
    <div class="pay-panel">
        <panelTitle title="充值中心" border-left-color="#F7BA2A"></panelTitle>
        <div class="pay-container">
            <div class="pay-header">
                <h2 class="title alipay-title" :class="{active: active}" @click="payShow('alipay')">支付宝支付</h2>
                <h2 class="title wechat-title" :class="{active: !active}" @click="payShow('wechat')">微信支付</h2>
            </div>
            <!-- 支付宝支付 -->
            <div class="pay-content" v-show="!flag">
                <div class="remain b">证宝宝余额：<span>{{available}}</span> 元</div>
                <div class="alipay-wrapper">
                    <img src="./alipay_logo.png" alt="支付宝" class="vt" width="100" height="100">
                </div>
                <div class="b">充值金额</div>
                <el-input type="text" v-model="payForm.alipayNum"></el-input>
                元
                <el-button type="danger" class="el-button" @click="submitAlipay">充值
                </el-button>
                <div>未使用的充值余额经申请随时可退，请联系客服处理。</div>
            </div>
            <!-- 微信支付 -->
            <div class="pay-content" v-show="flag">
                <div class="remain b">证宝宝余额：<span>{{available}}</span> 元</div>
                <div class="b">充值金额</div>
                <el-input type="text" v-model="payForm.wechatPayNum"></el-input>
                元
                <transition name="fade">
                    <div v-show="isWeChatShow">
                        <div class="tip">请扫描下方二维码完成支付</div>
                        <img :src="wechatPay.qrcode_url" class="db auto" alt="微信" width="100" height="100">
                    </div>
                </transition>
                <el-button type="danger" class="el-button" @click="submitWechat">充值
                </el-button>
                <div>未使用的充值余额经申请随时可退，请联系客服处理。</div>
            </div>
        </div>
        <!-- 离开当前页面进入支付宝弹窗 -->
        <el-dialog class="dialog" :visible.sync="leaveDialogVisible" title="提示" size="tiny">
            <div class="content">当前操作将离开本页，前往支付宝页面完成支付</div>
            <div class="footer">
                <el-button type="primary" @click="goAlipay" style="width: 120px; margin-top: 20px;" size="small">确 定
                </el-button>
                <el-button @click="leaveDialogVisible = false" style="width: 120px; margin-top: 20px;" size="small">取 消
                </el-button>
            </div>
        </el-dialog>
        <!-- 微信充值成功弹窗 -->
        <el-dialog class="dialog"
                   :visible.sync="isWechatPaySuccess"
                   title="提示">
            <div class="content b" style="margin: 10px 0 20px 0;">您已成功充值</div>
            <el-button type="primary" class="w120"
                       @click.native="isWechatPaySuccess = false">确定
            </el-button>
        </el-dialog>
    </div>
</template>

<script>
    import PanelTitle from '../PanelTitle/PanelTitle';
    import {isValidNum} from '../../utils/validate';
    import {mapGetters} from 'vuex';
    import * as pay from '../../api/pay';

    export default {
        data() {
            return {
                activeName: 'alipay',
                isWeChatShow: false, // 微信二维码显示标志
                leaveDialogVisible: false, // 离开本页进入支付宝
                flag: false,
                active: true,
                isWechatPaySuccess: false, // 微信充值成功弹窗
                payForm: {
                    alipayNum: '',
                    wechatPayNum: ''
                },
                wechatPay: {
                    order_no: '',
                    qrcode_url: ''
                },
                turnTimes: 0 // 轮询的次数
            };
        },
        computed: {
            ...mapGetters([
                'available'
            ]),
            user_id() {
                return localStorage.getItem('user_id');
            }
        },
        methods: {
            payShow(val) {
                if (this.activeName !== val) {
                    this.activeName = val;
                    this.flag = !this.flag;
                    this.active = !this.active;
                }
            },
            submitAlipay() {
                if (isValidNum(this.payForm.alipayNum)) {
                    if (this.payForm.alipayNum > 100000000) {
                        this.$message({
                            message: '充值金额超过限制',
                            type: 'warning',
                            showClose: true,
                            duration: 2000
                        });
                    } else {
                        const newTab = window.open();
                        pay.getAliPay(this.payForm.alipayNum * 100, 1, this.user_id)
                            .then(res => {
                                const div = document.createElement('div');
                                div.innerHTML = res.data; // html code
                                newTab.document.body.appendChild(div);
                                newTab.document.forms.alipaysubmit.submit();
                            });
//                    this.leaveDialogVisible = true;
                    }
                } else {
                    this.$message({
                        message: '充值金额必须为数字',
                        type: 'warning',
                        showClose: true,
                        duration: 2000
                    });
                }
            },
            submitWechat() {
                if (isValidNum(this.payForm.wechatPayNum)) {
                    if (this.payForm.wechatPayNum > 10000000) {
                        this.$message({
                            message: '充值金额超过限制',
                            type: 'warning',
                            showClose: true,
                            duration: 2000
                        });
                    } else {
                        pay.getWechatQrcode(+this.payForm.wechatPayNum * 100)
                            .then(res => {
                                if (res.data.error === 0) {
                                    this.wechatPay = Object.assign({}, this.wechatPay, res.data.data);
                                    this.isWeChatShow = true;
                                    this.requestWechatResult();
                                }
                            });
                    }
                } else {
                    this.$message({
                        message: '充值金额必须为数字',
                        type: 'warning',
                        showClose: true,
                        duration: 2000
                    });
                }
            },
            requestWechatResult() {
                pay.getWechatPayResult(this.wechatPay.order_no)
                    .then(res => {
                        this.turnTimes++;
                        if (res.data.data.pay_result === 1) {
                            this.$store.dispatch('userPay', res.data.data.wallet);
                            this.isWechatPaySuccess = true;
                        } else if (this.turnTimes > 300) {
                            this.turnTimes = 0;
                            this.isWeChatShow = false;
                            return 0;
                        } else {
                            setTimeout(this.requestWechatResult, 3000);
                        }
                    });
            },
            goAlipay() {
//                document.location.assign('http://www.baidu.com');
            }
        },
        components: {
            PanelTitle
        }
    };
</script>

<style lang="scss">
    @import url('../../common/scss/base.scss');
    @import url('../../common/scss/animate.css');

    .pay-panel {
        .pay-container {
            background: #fff;
            min-height: calc(100vh - 142px);
            .pay-header {
                padding: 10px 0 0 18px;
                .title {
                    display: inline-block;
                    padding: 4px 0 10px 30px;
                    font-size: 15px;
                    cursor: pointer;
                    color: #666;
                    transition: color .3s ease;
                }
                .title:hover {
                    color: #000;
                }
                .title:first-child {
                    margin-right: 32px;
                }
                .alipay-title {
                    background: url("./alipay_title.png") no-repeat -3px 0px;
                    background-size: 28px;
                }
                .wechat-title {
                    background: url("./wechat_title.png") no-repeat -3px 2px;
                    background-size: 28px;
                }
                .active {
                    color: #437dff;
                    border-bottom: 2px solid #437dff;
                }
            }
            .pay-content {
                text-align: center;
                font-size: 14px;
                line-height: 48px;
                vertical-align: bottom;
                .remain {
                    display: inline-block;
                    padding-left: 28px;
                    background: url("./balance.png") no-repeat 1px 12px;
                }
                .el-input {
                    width: 260px;
                }
                .tip {
                    font-size: 1.2rem;
                    color: #888;
                }
                .el-button {
                    display: block;
                    width: 100px;
                    margin: 20px auto 0;
                    border: none;
                }
            }
            .fade-enter-active {
                animation: fadeIn 1s;
            }

            .fade-leave-active {
                animation: fadeIn 1s reverse;
            }
        }
        .dialog {
            text-align: center;
            .content {
                font-size: 15px;
            }
        }
        .el-dialog {
            width: 400px;
        }
    }
</style>
