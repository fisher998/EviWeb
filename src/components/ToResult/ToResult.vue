<template>
    <div class="toResult-container">
        <panelTitle title="出证" border-left-color="#437dff"
                    class="fl"></panelTitle>
        <!--<router-link to="/file">-->
        <el-button type="primary" @click="goPrev" size="small" class="back">
            返回上一页
        </el-button>
        <!--</router-link>-->
        <div class="result-wrapper">
            <h2 class="username">用户名：<span>(+{{area_code}}){{phone}}</span></h2>
            <div class="mainInfo-wrapper">
                <div class="saveId-wrapper">
                    <div class="title">存证编号：</div>
                    <div class="content">{{certNo}}</div>
                </div>
                <template v-if="certRecord.length !== 0">
                    <div class="num-wrapper">
                        <div class="title">已出证次数：</div>
                        <div class="content">{{cert_num}} 次</div>
                    </div>
                    <div class="record-wrapper">
                        <div class="title">出证纪录：</div>
                        <div class="content">
                            <el-select placeholder="请选择"
                                       clearable
                                       size="mini"
                                       v-model="recordValue">
                                <el-option v-for="item in certRecord"
                                           @click.native="handleSelect(item.time)"
                                           :key="item.time"
                                           :label="item.time"
                                           :value="item.time">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                </template>
            </div>
            <div class="line"></div>
            <div class="result-content">
                <el-tabs>
                    <el-tab-pane label="出具取证或存证证明（100元）">
                        <div class="content">
                            <el-form inline
                                     :model="resultForm"
                                     :rules="resultRules"
                                     ref="resultForm"
                                     label-position="left"
                                     class="form-content">
                                <el-form-item label="申请人：" prop="applicant" class="form-item">
                                    <el-input v-model="resultForm.applicant" size="small"></el-input>
                                </el-form-item>
                                <el-form-item label="电子邮件地址：" prop="email" class="form-item">
                                    <el-input v-model="resultForm.email" size="small"></el-input>
                                </el-form-item>
                                <br>
                                <el-form-item class="checkbox">
                                    <el-checkbox v-model="resultForm.providePaper"
                                                 label="提供纸质版（一份10元）"
                                                 @change="handleProvide">
                                    </el-checkbox>
                                </el-form-item>
                                <br>
                                <div class="is-disabled">
                                    <el-form-item label="收件地址："
                                                  class="form-item"
                                                  :show-message="isShowError"
                                                  prop="address">
                                        <el-input v-model="resultForm.address" size="small"
                                                  :disabled="receiverActive"></el-input>
                                    </el-form-item>
                                    <el-form-item label="收件人手机号："
                                                  class="form-item"
                                                  :show-message='isShowError'
                                                  prop="tel">
                                        <el-input v-model="resultForm.tel" size="small"
                                                  :disabled="receiverActive"></el-input>
                                    </el-form-item>
                                </div>
                                <div class="ps">注：快递费用由收件人支付（货到付款）</div>
                                <el-form-item class="footer">
                                    <el-button type="success" class="btn" @click.native="isCertVisible=true">查看证书样式
                                    </el-button>
                                    <el-button type="primary" class="btn" @click="submitForm('resultForm')">确定
                                    </el-button>
                                    <el-button class="btn" @click="goPrev">
                                        取消
                                    </el-button>
                                </el-form-item>
                            </el-form>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="出庭作证（最低1000元加差旅费）">
                        <div class="infoForm-wrapper">
                            <el-form inline :model="infoForm" :rules="infoRules" ref="infoForm" class="infoForm"
                                     label-position="left"
                                     label-width="100px">
                                <el-form-item label="姓名:" class="item b" prop="name">
                                    <el-input size="small" v-model="infoForm.name" :maxlength="20"></el-input>
                                </el-form-item>
                                <br>
                                <el-form-item label="手机号码:" class="item b" prop="tel">
                                    <el-input size="small" v-model="infoForm.tel" :maxlength="11"></el-input>
                                </el-form-item>
                                <br>
                                <el-form-item>
                                    <el-button type="primary" class="el-button" @click="postCourt('infoForm')"
                                               style="width: 120px;">确定
                                    </el-button>
                                    <el-button class="btn" style="width: 120px;">
                                        <router-link to="/">取消</router-link>
                                    </el-button>
                                </el-form-item>
                            </el-form>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <!-- 支付弹窗 -->
        <el-dialog title="提示"
                   :visible.sync="payDialogVisible"
                   class="dialog"
                   @close="isDisabled = false"
                   :close-on-press-escape="false"
                   :close-on-click-modal="false"
                   size="tiny">
            <div class="tip">提示：您正在使用证宝宝余额，支付<span>{{cost}}</span>元购买出证服务</div>
            <el-form inline
                     :model="passForm"
                     :rules="passRules"
                     ref="passForm">
                <el-form-item
                    label="输入登录密码"
                    :error="formErrors.passError"
                    prop="password">
                    <el-input type="password" size="small" v-model="passForm.password"></el-input>
                </el-form-item>
            </el-form>
            <div class="footer">
                <el-button type="primary"
                           class="el-button"
                           :disabled="isDisabled"
                           :loading="isLoading"
                           @click="passFormSubmit('passForm')">确定
                </el-button>
                <el-button @click="payDialogVisible = false" class="el-button">取消</el-button>
            </div>
        </el-dialog>
        <!-- 支付完成弹窗 -->
        <el-dialog title="提示" :visible.sync="successDialogVisible1" class="dialog" size="tiny">
            <div class="tip">出证申请已提交，稍后我们会将电子版证书发到您的邮箱，纸质版证会通过快递的形式快递给您。</div>
            <div class="footer">
                <el-button type="primary" @click="confirmCert">确定</el-button>
            </div>
        </el-dialog>
        <!-- 出证申请完成弹窗 -->
        <el-dialog title="提示" :visible.sync="successDialogVisible2" class="dialog" size="tiny">
            <div class="tip">出庭作证申请已提交，请保持手机畅通，我们的工作人员稍后会与您联系出庭事宜。</div>
            <div class="footer">
                <el-button type="primary" @click="successDialogVisible2 = false">确定</el-button>
            </div>
        </el-dialog>
        <!-- 出证记录弹窗 -->
        <el-dialog title="出证记录" :visible.sync="recordDialogVisible">
            <div class="record-dialog-wrapper">
                <div class="title title1"><span class="b">出证时间：</span><span>{{_formatDate(certDetail.pub_time)}}</span>
                </div>
                <div class="sign-wrapper">
                    <div class="thumbnail-wrapper">
                        <div class="thumbnail">
                            <div style="display:inline-block; width: 90px; height: 120px; background: #aaa;"></div>
                        </div>
                        <div class="tip">电子签名值：{{certDetail.sign}}</div>
                    </div>
                    <div class="handle-wrapper">
                        <el-button type="primary" class="w120"><a :href="certDetail.pdf_url" target="_blank">查看</a>
                        </el-button>
                        <el-button class="w120"><a :href="certDetail.pdf_url" download>下载</a></el-button>
                    </div>
                </div>
                <div class="title title2"><span class="b">物流公司：</span><span class="bk">{{certDetail.exp_name}}</span>
                </div>
                <div class="title title3"><span class="b">快递单号：</span><span class="bk">{{certDetail.exp_order}}</span>
                </div>
                <dl class="delivery-wrapper" v-for="item in certDetail.exp_records">
                    <dt class="time">{{item.time}}</dt>
                    <dd class="content">{{item.context}}</dd>
                </dl>
            </div>
        </el-dialog>
        <cert-style :visible.sync="isCertVisible"></cert-style>
        <!-- 帐户余额不足弹窗 -->
        <remain-lack :show.sync="show"></remain-lack>
    </div>
</template>

<script>
    import panelTitle from '../PanelTitle/PanelTitle';
    import {isValidEmail, isValidMobile} from '../../utils/validate';
    import {formatDate} from '../../utils';
    import {mapState, mapActions, mapGetters} from 'vuex';
    import {postCourt, getCertRecord, postCertN, postCertY, detailCert, getCertNo} from '../../api/cert';
    import {confirmPwd} from '../../api/user';
    import CertStyle from './cert-style';
    import RemainLack from '../remain-lack/remain-lack';

    export default {
        data() {
            const validateEmail = (rule, value, callback) => {
                if (!isValidEmail(value)) {
                    callback(new Error('邮箱格式不正确'));
                } else {
                    callback();
                }
            };
            // 验证手机号格式是否正确
            const validateMobile = (rule, value, callback) => {
                if (!isValidMobile(value)) {
                    callback(new Error('手机号格式错误'));
                } else {
                    callback();
                }
            };
            return {
                receiverActive: true,  // 收件人信息是否激活
                payDialogVisible: false, // 支付购买出证服务弹窗是否可见
                cost: 100, // 需支付购买出证服务费用
                successDialogVisible1: false, // 出证申请提交成功弹窗提示
                successDialogVisible2: false, // 出证作证申请提交成功弹窗提示
                recordDialogVisible: false, // 出证记录弹窗
                resultForm: { // 出证信息表单
                    applicant: '', // 申请人
                    email: '', // 电子邮件
                    address: '', // 收件地址
                    tel: '', // 收件人手机号
                    providePaper: false // 是否需要提供纸质版
                },
                resultRules: {
                    applicant: [
                        {required: true, message: '申请人不能为空', trigger: 'change'}
                    ],
                    email: [
                        {required: true, message: '电子邮箱不能为空', trigger: 'change'},
                        {validator: validateEmail, trigger: 'change'}
                    ],
                    address: [
                        {required: true, message: '收件地址不能为空', trigger: 'change'}
                    ],
                    tel: [
                        {required: true, message: '收件人手机号不能为空', trigger: 'change'},
                        {validator: validateMobile, trigger: 'change'}
                    ]
                },
                passForm: {
                    password: ''
                },
                passRules: {
                    password: [{required: true, message: '密码不能为空'}]
                },
                infoForm: {
                    name: '', // 姓名
                    tel: '' // 手机号码
                },
                infoRules: {
                    name: [
                        {required: true, message: '姓名不能为空'}
                    ],
                    tel: [
                        {required: true, message: '手机号码不能为空'},
                        {validator: validateMobile}
                    ]
                },
                certRecord: [],
                recordValue: '', // 出证记录选中
                certDetail: [], // 出证详情
                certNo: 0, // 存证编号
                formErrors: {
                    passError: ''
                },
                isShowError: false,
                isCertVisible: false,
                isDisabled: false,
                show: false,
                isLoading: false // 输入密码确定按钮
            };
        },
        computed: {
            ...mapState({
                phone: state => state.user.cell_phone,
                area_code: state => state.user.area_code,
                index: state => state.cert.index,
                fileManageData: state => state.cert.fileManageData,
                cert_id() {
                    return this.$route.params.id;
                }
            }),
            cert_num() {
                return this.certRecord.length;
            },
            ...mapGetters([
                'routerFlag'
            ])
        },
        watch: {
            'resultForm.providePaper'() {
                this.isShowError = this.resultForm.providePaper;
            }
        },
        created() {
            getCertRecord(this.cert_id)
                .then(res => {
                    if (res.data.error === 0) {
                        this.certRecord = res.data.data || [];
                    }
                });
            getCertNo(this.cert_id)
                .then(res => {
                    this.certNo = res.data.data;
                });
        },
        methods: {
            // 当提供纸质版被选中，收件地址，收件人手机号激活 否则则提交整个表单
            handleProvide() {
//                this.$refs.resultForm.resetFields();
                this.receiverActive = !this.receiverActive;
                this.resultForm.address = '';
                this.resultForm.tel = '';
                if (this.receiverActive) {
                    this.cost = 100;
                } else {
                    this.cost = 110;
                }
            },
            submitForm(resultForm) {
                // 如果提供纸质版没有被勾选，则只对 申请人和电子邮箱 进行校验
                if (this.resultForm.providePaper === false) {
                    this.$refs[resultForm].validateField('applicant', (error) => {
                        if (!error) {
                            this.$refs[resultForm].validateField('email', (error) => {
                                if (!error) {
                                    this.payDialogVisible = true;
                                } else {
                                    return false;
                                }
                            });
                        } else {
                            return false;
                        }
                    });
                } else {
                    this.$refs[resultForm].validate((valid) => {
                        if (valid) {
                            this.payDialogVisible = true;
                        } else {
                            return false;
                        }
                    });
                }
            },
            passFormSubmit(passForm) {
                this.$refs[passForm].validate((valid) => {
                    this.formErrors.passError = '';
                    if (valid) {
                        this.isLoading = true;
                        confirmPwd(this.passForm.password)
                            .then(res => {
                                if (res.data.error === 0) {
                                    if (this.resultForm.providePaper) {
                                        postCertY(this.resultForm.applicant, this.resultForm.email, this.cert_id, 1, this.resultForm.address, this.resultForm.tel)
                                            .then(res => {
                                                this.isDisabled = true;
                                                if (res.data.error === 0) {
                                                    this.successDialogVisible1 = true;
                                                    this.isLoading = false;
                                                    setTimeout(() => {
                                                        this.payDialogVisible = false;
                                                    }, 500);
                                                } else if (res.data.error === 30012) {
                                                    this.show = true;
                                                    this.isLoading = false;
                                                    setTimeout(() => {
                                                        this.payDialogVisible = false;
                                                    }, 600);
                                                } else if (res.data.error === 30015) {
                                                    this.$message({
                                                        message: '文件尚未处理完成',
                                                        type: 'warning',
                                                        showClose: true
                                                    });
                                                    this.isLoading = false;
                                                    setTimeout(() => {
                                                        this.payDialogVisible = false;
                                                    }, 600);
                                                } else if (res.data.error === 30006) {
                                                    this.isLoading = false;
                                                    this.payDialogVisible = false;
                                                    this.$message({
                                                        message: '用户信息输入不合法',
                                                        type: 'error',
                                                        showClose: true
                                                    });
                                                } else {
                                                    this.isLoading = false;
                                                    this.payDialogVisible = false;
                                                    this.$message({
                                                        message: '发生未知错误，请稍后重试',
                                                        type: 'error',
                                                        showClose: true
                                                    });
                                                }
                                            });
                                    } else {
                                        postCertN(this.resultForm.applicant, this.resultForm.email, this.cert_id)
                                            .then(res => {
                                                if (res.data.error === 0) {
                                                    this.successDialogVisible1 = true;
                                                    this.isLoading = false;
                                                    setTimeout(() => {
                                                        this.payDialogVisible = false;
                                                    }, 500);
                                                } else if (res.data.error === 30012) {
                                                    this.show = true;
                                                    this.isLoading = false;
                                                    setTimeout(() => {
                                                        this.payDialogVisible = false;
                                                    }, 600);
                                                } else if (res.data.error === 30015) {
                                                    this.$message({
                                                        message: '文件尚未处理完成',
                                                        type: 'warning',
                                                        showClose: true
                                                    });
                                                    this.isLoading = false;
                                                    setTimeout(() => {
                                                        this.payDialogVisible = false;
                                                    }, 600);
                                                } else if (res.data.error === 30006) {
                                                    this.isLoading = false;
                                                    this.payDialogVisible = false;
                                                    this.$message({
                                                        message: '用户信息输入不合法',
                                                        type: 'error',
                                                        showClose: true
                                                    });
                                                } else {
                                                    this.isLoading = false;
                                                    this.payDialogVisible = false;
                                                    this.$message({
                                                        message: '发生未知错误，请稍后重试',
                                                        type: 'error',
                                                        showClose: true
                                                    });
                                                }
                                            });
                                    }
                                } else if (res.data.error === 30010) {
                                    this.isLoading = false;
                                    this.formErrors.passError = '密码错误';
                                }
                            });
                    } else {
                        return false;
                    }
                });
            },
            postCourt(infoForm) {
                this.$refs[infoForm].validate((valid) => {
                    if (valid) {
                        postCourt(this.cert_id, this.infoForm.name, this.infoForm.tel)
                            .then(res => {
                                if (res.data.error === 0) {
                                    this.successDialogVisible2 = true;
                                } else if (res.data.error === 30012) {
                                    this.show = true;
                                } else if (res.data.error === 30015) {
                                    this.$message({
                                        message: '文件尚未处理完成',
                                        type: 'warning',
                                        showClose: true
                                    });
                                }
                            });
                    } else {
                        return false;
                    }
                });
            },
            handleSelect(val) {
                const v = this.certRecord.filter(v => {
                    if (v.time === val) {
                        return v;
                    }
                });
                detailCert(v[0].apply_id) // this.certRecord.
                    .then(res => {
                        if (res.data.error === 0) {
                            this.certDetail = res.data.data;
                            this.recordDialogVisible = true;
                        }
                    });
            },
            confirmCert() {
                this.successDialogVisible1 = false;
                getCertRecord(this.cert_id)
                    .then(res => {
                        if (res.data.error === 0) {
                            this.certRecord = res.data.data || [];
                        }
                    });
            },
            // 返回上一页
            goPrev() {
                this.$router.go(-1);
            },
            _formatDate(time) {
                return formatDate(time);
            },
            ...mapActions([
                'setRouterFlag'
            ])
        },
        components: {
            panelTitle,
            CertStyle,
            RemainLack
        }
    };
</script>

<style lang="scss">
    @import '../../common/scss/mixin.scss';

    .toResult-container {
        .back {
            margin: 14px 0 0 20px;
            a {
                color: #fff;
            }
        }
        .result-wrapper {
            box-sizing: border-box;
            width: 100%;
            padding: 10px 0 10px 20px;
            margin-top: 10px;
            text-align: left;
            background: #fff;
            .username {
                font-size: 16px;
                font-weight: bold;
                padding-top: 12px;
            }
            .mainInfo-wrapper {
                font-size: 14px;
                padding: 15px 0 10px;
                & > div + div {
                    padding-left: 35px;
                }
                div {
                    display: inline-block;
                }
                .title {
                    font-weight: 700;
                }
                .content {
                    color: #333;
                    padding-left: 3px;
                }
            }
            .line {
                border-bottom: 1px solid #ddd;
                margin: 10px 0;
            }
            .result-content {
                line-height: 33px;
                .form-content {
                    padding: 30px 0 25px 0;
                    font-weight: bold;
                    .form-item {
                        position: relative;
                        width: 345px;
                        padding-left: 15px;
                        &::after {
                            //@include dotted(#aaa);
                        }
                    }
                    .checkbox {
                        padding: 12px 0 12px 15px;
                    }
                    .ps {
                        font-size: 13px;
                        padding-bottom: 20px;
                        padding-left: 18px;
                    }
                    .footer {
                        display: block;
                        text-align: center;
                        .btn {
                            width: 120px;
                            & + .btn {
                                margin-left: 100px;
                            }
                        }
                    }
                }
            }
            .infoForm-wrapper {
                padding: 50px 0;
                .infoForm {
                    text-align: center;
                }
            }
        }
        .dialog {
            text-align: center;
            .tip {
                padding-top: 15px;
                padding-bottom: 20px;
                line-height: 23px;
            }
            .el-button {
                width: 120px;
                margin-top: 8px;
            }
        }
        .record-dialog-wrapper {
            padding: 10px 16px;
            .title {
                position: relative;
                padding-left: 10px;
                line-height: 32px;
            }
            .title1::after {
                @include dotted(#427DFF);
            }
            .title2::after {
                @include dotted(#13ce66);
            }
            .title3::after {
                @include dotted(#f7ba2a);
            }
            .sign-wrapper {
                display: flex;
                justify-content: space-between;
                padding: 10px 0;
                div:first-child {
                    flex: 0 0 60%;
                    .thumbnail {
                        text-align: center;
                    }
                    .tip {
                        text-align: left;
                        font-size: 12px;
                        color: #aaa;
                        padding-left: 8px;
                        word-break: break-all;
                    }
                }
                .el-button:first-of-type {
                    a {
                        color: #fff;
                    }
                }
                .el-button:last-of-type {
                    a {
                        color: #1D8CE0;
                    }
                }
                div:last-child {
                    text-align: center;
                    flex: 0 0 40%;
                    .el-button {
                        margin: 5px 0;
                    }
                }
            }
            .delivery-wrapper {
                display: flex;
                padding-left: 10px;
                padding-top: 20px;
                word-break: break-all;
                .time {
                    flex: 0 0 150px;
                }
            }
        }
    }

    .el-dialog {
        width: 460px;
    }
</style>
