<template>
    <div class="buy-container">
        <el-row :gutter="20">
            <el-col :span="13">
                <div class="grid-content">
                    <panelTitle title="购买空间" border-left-color="#2fa4f5"></panelTitle>
                    <div class="content b">
                        <el-row>
                            <el-col :span="12">容量</el-col>
                            <el-col :span="12" class="tr"><span>{{used_size}}/{{total_size}}</span></el-col>
                        </el-row>
                        <el-progress class="progress"
                                     :text-inside="true"
                                     :show-text="false"
                                     :percentage="size_percent"
                                     :stroke-width="18"></el-progress>
                        <el-row>
                            <el-col :span="12">
                                已购套餐：<span>{{meal | switchMeal(meal)}}</span></el-col>
                            <el-col :span="12" v-show="total_size !== 0">
                                到期时间：<span>{{total_size ? expire_at : '无'}}</span></el-col>
                        </el-row>
                        <el-row class="type-name">
                            <el-col :span="24">套餐类型：</el-col>
                        </el-row>
                        <div class="type-content">
                            <div class="type" @click="checkType(isChecked)" :flag="isChecked"
                                 :class={checked:isChecked}>
                                <div v-if="meal === 'no'">
                                    <div class="package">
                                        <span class="size c1">50M</span>
                                        <span>包年套餐</span>
                                        <span class="tip">50M容量储存空间</span>
                                    </div>
                                    <div class="price">10元/年</div>
                                </div>
                                <div v-else-if="meal === 'fiveM'" class="upgrade-wrapper">
                                    <div>扩容</div>
                                    <div>（升级到1G，100元/年）</div>
                                </div>
                                <div v-else-if="meal === 'one'" class="upgrade-wrapper">
                                    <div>扩容</div>
                                    <div> (升级到10G，500元/年) </div>
                                </div>
                                <div v-else-if="meal === 'ten'" class="upgrade-wrapper">
                                    <div>扩容</div>
                                    <div> (增加10G) </div>
                                </div>
                            </div>
                            <div class="type fr" @click="checkType(!isChecked)" :flag="!isChecked"
                                 :class={checked:!isChecked}>
                                <div v-if="meal === 'no'">
                                    <div class="package">
                                        <span class="size c2">1G</span>
                                        <span>包年套餐</span>
                                        <span class="tip">1G大容量储存空间</span>
                                    </div>
                                    <div class="price">100元/年</div>
                                </div>
                                <div class="upgrade-wrapper" v-else>
                                    <span>续费一年</span>
                                </div>
                            </div>
                        </div>
                        <el-row type="flex" justify="space-between">
                            <el-col :span="12" class="tl">
                                <span>应付金额：{{amount}}</span>
                            </el-col>
                            <el-col :span="12" class="tr">
                                <el-button type="success" class="w120" v-waves.button @click="handleBuy">立即支付
                                </el-button>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </el-col>
            <el-col :span="11">
                <div class="grid-content">
                    <panelTitle title="常见问题" border-left-color="#2fa4f5"></panelTitle>
                    <div class="content">
                        <div class="question">
                            Q：付费容量的有效期如何计算？
                        </div>
                        <div class="answer">
                            <span class="answer-title">A：</span>
                            <div class="answer-content">
                                您成功购容量套餐之后，可立即获得一年该容量套餐的使用权，即至下一年该日的上一日到期。在有效期内可选择扩展容量或续费，扩展容量时，根据更高容量套餐与当前容量套餐的差价和已使用时长实时计算需补交的金额，有效期不变；续费则可将当前容量套餐的有效期延长一年。
                            </div>
                        </div>
                        <div class="line"></div>
                        <div class="question">
                            Q：容量到期后怎么办？
                        </div>
                        <div class="answer">
                            <span class="answer-title">A：</span>
                            <div class="answer-content">
                                您成功购买的容量到期后，可以自由选择是否续费。如果不缴费，我们将回收到期的付费容量，您的证宝宝功能暂停使用，我们有权清空您的文件。如果续费，您可以选择新的套餐，新的套餐使用期限从您上一期套餐到期日起算。
                            </div>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
        <!-- 支付确认弹窗 -->
        <el-dialog title="提示" :visible.sync="isPayVisible" @close="close">
            <div class="payConfirm-wrapper">
                <div class="info">
                    提示：您正在用证宝宝帐户余额，支付{{amount}}元。{{text}}
                </div>
                <el-form :model="pwdForm" :rules="pwdRule" ref="pwdForm" label-width="145px" label-position="left">
                    <el-form-item label="请输入登录密码：" prop="password" :error="error">
                        <el-input type="password" size="small" v-model="pwdForm.password"
                                  style="width: 165px;"></el-input>
                    </el-form-item>
                </el-form>
                <div class="tc">
                    <el-button type="primary"
                               class="w120"
                               @click.native="passConfirm"
                               :disabled="isDisabled">确定
                    </el-button>
                    <el-button class="w120" @click.native="isPayVisible = false">取消</el-button>
                </div>
            </div>
        </el-dialog>
        <!-- 帐户余额不足弹窗 -->
        <remain-lack :show.sync="show"></remain-lack>
    </div>
</template>

<script>
    import PanelTitle from '../PanelTitle/PanelTitle';
    import {mapGetters, mapActions} from 'vuex';
    import {firstBuyStorage, assessStorage, expandStorage, renweStorage} from '../../api/buy';
    import {confirmPwd} from '../../api/user';
    import RemainLack from '../remain-lack/remain-lack';

    export default {
        data() {
            return {
                isDisabled: false, // 确定按钮禁用
                isPayVisible: false,
                isChecked: true,
                type: 1, // 购买套餐类型（1 :1GB , 2:10GB）
                amount: 0, // 应付金额
                pwdForm: {
                    password: ''
                },
                pwdRule: {
                    password: [{required: true, message: '请输入密码'}]
                },
                error: '',
                show: false
            };
        },
        computed: {
            ...mapGetters([
                'total_size',
                'used_size',
                'expire_at',
                'size_percent'
            ]),
            // 套餐显示
//            isPackageVisible() {
//                return this.total_size === 0;
//            },
            // 当前订购的套餐类型 no未订购 one已订购1G ten已订购10G fiveM为订购50M
            meal() {
                // 去除单位，转换为number
//                this.total_size = parseInt(this.total_size.slice(0, -1));
                if (this.total_size === 0) {
                    return 'no';
                } else if (this.total_size === '50M') {
                    return 'fiveM';
                } else if (parseInt(this.total_size.slice(0, -1)) >= 1 && parseInt(this.total_size.slice(0, -1)) < 10) {
                    return 'one';
                } else if (parseInt(this.total_size.slice(0, -1)) >= 10) {
                    return 'ten';
                }
                // return this.total_size < 10 ? (this.total_size === 0 ? 'no' : 'one') : 'ten';
            },
            // 套餐方案
            text() {
                if (this.meal === 'no') {
                    return this.type === 1 ? '购买50M包年套餐' : '购买1G包年套餐';
                } else if (this.meal === 'fiveM') {
                    return this.type === 1 ? '续费一年' : '升级到1G';
                } else if (this.meal === 'one') {
                    return this.type === 1 ? '续费一年' : '升级到10G';
                } else if (this.meal === 'ten') {
                    return this.type === 1 ? '续费一年' : '增加10G';
                }
            }
        },
        watch: {
            total_size() {
                this._initAmount();
            }
        },
        filters: {
            switchMeal(meal) {
                switch (meal) {
                    case 'no': return '无';
                    case 'fiveM': return '50M';
                    case 'one': return '1G';
                    case 'ten': return '10G';
                }
            }
        },
        created() {
            this._initAmount();
        },
        methods: {
            // 输入密码通过后提交后台
            passConfirm() {
                this.$refs.pwdForm.validate(valid => {
                    if (valid) {
                        this.error = '';
                        confirmPwd(this.pwdForm.password)
                            .then(res => {
                                if (res.data.error === 0) {
                                    this.isDisabled = true;
                                    // 订购套餐
                                    if (this.meal === 'no') {
                                        firstBuyStorage(this.type)
                                            .then(res => {
                                                if (res.data.error === 0) {
                                                    this.$message({
                                                        message: '购买成功',
                                                        type: 'success',
                                                        showClose: true
                                                    });
//                                                    this.isPackageVisible = false;
                                                    setTimeout(() => {
                                                        this.isPayVisible = false;
                                                    }, 500);
                                                    this._initAmount();
                                                    this._getUserInfo();
                                                } else if (res.data.error === 30012) {
                                                    this.show = true;
                                                    setTimeout(() => {
                                                        this.isPayVisible = false;
                                                    }, 200);
                                                } else {
                                                }
                                            });
                                    } else {
                                        if (this.type === 2) { // 扩展
                                            expandStorage()
                                                .then(res => {
                                                    if (res.data.error === 0) {
                                                        this.$message({
                                                            message: '扩容成功',
                                                            type: 'success',
                                                            showClose: true
                                                        });
                                                        setTimeout(() => {
                                                            this.isPayVisible = false;
                                                        }, 500);
//                                                        location.reload(true);
                                                        this._initAmount();
                                                        this._getUserInfo();
                                                    } else if (res.data.error === 30012) {
                                                        this.show = true;
                                                        setTimeout(() => {
                                                            this.isPayVisible = false;
                                                        }, 200);
                                                    } else {
                                                    }
                                                });
                                        } else if (this.type === 1) { // 续费
                                            renweStorage()
                                                .then(res => {
                                                    if (res.data.error === 0) {
                                                        this.$message({
                                                            message: '续费成功',
                                                            type: 'success',
                                                            showClose: true
                                                        });
                                                        setTimeout(() => {
                                                            this.isPayVisible = false;
                                                        }, 500);
//                                                        location.reload(true);
                                                        this._initAmount();
                                                        this._getUserInfo();
                                                    } else if (res.data.error === 30012) {
                                                        this.show = true;
                                                        setTimeout(() => {
                                                            this.isPayVisible = false;
                                                        }, 200);
                                                    } else {
                                                    }
                                                });
                                        }
                                    }
                                } else {
                                    this.error = '密码输入有误';
                                }
                            });
                    } else {
                        return false;
                    }
                });
            },
            checkType(flag) {
                if (flag !== true) {
                    this.isChecked = !this.isChecked;
                    if (this.meal === 'no') {
                        this.isChecked ? this.amount = 10 : this.amount = 100;
                        this.isChecked ? this.type = 1 : this.type = 2;
                    } else {
                        this.isChecked ? this.type = 2 : this.type = 1;
                        assessStorage(this.type)
                            .then(res => {
                                if (res.data.error === 0) {
                                    this.amount = res.data.data / 100;
                                }
                            });
                    }
                }
            },
            // 点击之后确定密码弹窗出现
            handleBuy() {
                this.isPayVisible = true;
            },
            // 关闭弹窗
            close() {
                this.isDisabled = false;
                this.$refs.pwdForm.resetFields();
            },
            _initAmount() {
                if (this.meal === 'no') {
                    this.isChecked ? this.amount = 10 : this.amount = 100;
                    this.isChecked ? this.type = 1 : this.type = 2;
                } else {
                    this.isChecked ? this.type = 2 : this.type = 1;
                    assessStorage(this.type)
                        .then(res => {
                            if (res.data.error === 0) {
                                this.amount = res.data.data / 100;
                            }
                        });
                }
            },
            _getUserInfo() {
                this.GetUserInfo();
            },
            ...mapActions([
                'GetUserInfo'
            ])
        },
        components: {
            PanelTitle,
            RemainLack
        }
    };
</script>

<style lang="scss">
    @import '../../common/scss/mixin';

    .buy-container {
        .content {
            min-height: calc(100vh - 142px);
            font-family: Helvetica;
            box-sizing: border-box;
            width: 100%;
            padding: 35px 45px;
            background: #fff;
            font-size: 14px;
            color: #000;
            .progress {
                padding-top: 10px;
                padding-bottom: 40px;
                .el-progress-bar__outer {
                    border-radius: 0;
                    .el-progress-bar__inner {
                        background: #58B7FF;
                        border-radius: 0;
                    }
                }
            }
            .type-content {
                display: flex;
                justify-content: space-between;
            }
            .type-name {
                margin-top: 26px;
            }
            .checked {
                background: url("./checked.png") no-repeat 100% 100%;
            }
            .type {
                box-sizing: border-box;
                width: 205px;
                height: 110px;
                padding: 14px 0 10px 6px;
                border: 1px solid #eee;
                margin-bottom: 38px;
                margin-top: 10px;
                cursor: pointer;
                &:hover {
                    border: 1px solid #F7BA2A;
                }
                .package {
                    .c1 {
                        color: #199cf6;
                    }
                    .c2 {
                        color: #FF4949;
                    }
                    .size {
                        font-size: 35px;
                        font-family: akzidenzgrotesk-light-webfont;
                        font-weight: bold;
                    }
                    span:nth-child(2) {
                        position: absolute;
                        font-size: 15px;
                        font-weight: bold;
                    }
                }
                .tip {
                    font-size: 12px;
                    color: #888;
                    font-weight: 400;
                }
                .price {
                    font-size: 18px;
                    text-align: center;
                    margin-top: 10px;
                    font-weight: 400;
                }
                .upgrade-wrapper {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    text-align: center;
                    font-size: 18px;
                    justify-content: center;
                    font-weight: 400;
                    & > div:nth-child(2) {
                        font-size: 13px;
                    }
                }
            }
        }
        .grid-content {
            .question {
                position: relative;
                font-size: 16px;
                font-weight: bold;
                padding-bottom: 15px;
                &:first-child::after {
                    @include dotted(#4cd492);
                    width: 6px;
                    height: 6px;
                    margin-top: -7px;
                    margin-left: -18px;
                }
            }
            .question ~ .question::after {
                @include dotted(#2fa4f5);
                width: 6px;
                height: 6px;
                margin-top: -7px;
                margin-left: -18px;
            }
            .line {
                margin: 36px 0;
                border-bottom: 1px solid #eee;
            }
            .answer {
                line-height: 22px;
                .answer-title {
                    font-weight: bold;
                    float: left;
                    padding-left: 2px;
                    color: #555;
                }
                .answer-content {
                    margin-left: 2em;
                    color: #777;
                }
            }
        }
        .el-dialog {
            width: 410px;
        }
        .payConfirm-wrapper {
            padding: 10px 20px;
            .info {
                padding-bottom: 10px;
                font-weight: bold;
            }
            .el-form {
                padding: 5px 0;
            }
        }
    }
</style>
