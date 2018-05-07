<template>
    <div class="user">
        <panelTitle :title="title" :border-color="borderColor"></panelTitle>
        <div class="user-container">
            <div class="avatar-wrapper">
                <img class="avatar" :src="avatar" alt="默认头像">
            </div>
            <div class="username">(+{{area_code}}) {{cell_phone}}</div>
            <el-button type="primary" class="el-button" @click="handleModifyPass()">修改密码</el-button>
            <el-button type="primary" class="el-button" @click="isOldVisible = true">修改手机号</el-button>
        </div>
        <!-- 修改密码弹窗 -->
        <el-dialog size="tiny"
                   class="dialog"
                   title="修改密码"
                   :close-on-press-escape="false" :close-on-click-modal="false"
                   :visible.sync="modifyPassdialogVisible"
                   @close="closePassDialog">
            <el-form :model="passForm" :rules="passRules" ref="passForm" label-width="108px"
                     :label-position="passFormLabelPosition">
                <el-form-item label="旧密码：" prop="oldPass">
                    <el-input v-model="passForm.oldPass" type="password" size="small"></el-input>
                </el-form-item>
                <el-form-item label="短信验证码：" prop="verifyCode">
                    <el-input v-model="passForm.verifyCode" :maxlength="4" type="text" size="small"
                              style="width: calc( 100% - 100px );"></el-input>
                    <!-- 倒计时由time控制 -->
                    <el-button type="primary" size="small" class="vm" style="vertical-align: 1px;"
                               @click="sendCode"
                               :disabled="time > 0">{{text}}
                    </el-button>
                </el-form-item>
                <el-form-item label="新密码：" prop="newPwd">
                    <el-input v-model="passForm.newPwd"
                              type="password"
                              size="small"
                              :maxlength="20"
                              placeholder="密码不能少于6位"></el-input>
                </el-form-item>
                <el-form-item label="重复输入：" prop="checkPass">
                    <el-input v-model="passForm.checkPass"
                              type="password"
                              size="small"
                              :maxlength="20"
                              placeholder="密码不能少于6位"></el-input>
                </el-form-item>
                <el-form-item label-width="0" class="tc">
                    <el-button class="w120" type="primary" v-waves.button @click="submitPassForm('passForm')">提交
                    </el-button>
                    <el-button class="w120" v-waves.button @click="modifyPassdialogVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 密码修改成功弹窗 -->
        <el-dialog title="提示" :visible.sync="modifyPassSuccess" size="tiny" class="tc b f16">
            <div>密码修改成功</div>
            <el-button type="primary" size="small" style="width: 120px; margin-top: 30px;"
                       @click="modifyPassSuccess = false">确定
            </el-button>
        </el-dialog>
        <!-- 修改手机号验证旧手机号弹窗 -->
        <el-dialog class="phone-dialog"
                   size="tiny"
                   title="修改手机号"
                   :close-on-click-modal="false"
                   @close="closeOld"
                   :visible.sync="isOldVisible">
            <el-row :gutter="20">
                <el-col :span="8" class="tr"><span class="b">当前手机号：</span></el-col>
                <el-col :span="8">{{cell_phone}}</el-col>
                <el-col :span="8">
                    <!--<countDown @click.native="sendOldMobileCode"></countDown>-->
                    <el-button type="primary" size="small" class="vm" style="vertical-align: 1px;"
                               @click="sendOldMobileCode"
                               :disabled="time > 0">{{text}}
                    </el-button>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8" class="tr"><span class="b">验证码：</span></el-col>
                <el-col :span="12">
                    <el-form :model="oldMobileCodeForm" :rules="oldMobileCodeRule" ref="oldMobileCodeForm">
                        <el-form-item prop="code">
                            <el-input v-model="oldMobileCodeForm.code" size="small" :maxlength="4"
                                      class="mt-10"></el-input>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24" class="tc">
                    <el-button type="primary" size="small" class="w120" @click="handleOldMobile">下一步</el-button>
                </el-col>
            </el-row>
        </el-dialog>
        <!-- 输入新手机号弹窗 -->
        <el-dialog class="phone-dialog"
                   size="tiny"
                   :close-on-click-modal="false" title="修改手机号"
                   :visible.sync="isNewVisible"
                   @close="closeNew">
            <div class="newPhone-wrapper">
                <el-form :model="newPhoneVerifyForm" :rules="newPhoneVerifyRules" ref="newPhoneVerifyForm"
                         :inline="true" label-width="110px">
                    <el-form-item label="输入手机号：" prop="newPhone">
                        <el-input size="small" type="text" name="newPhone"
                                  v-model="newPhoneVerifyForm.newPhone" :maxlength="11"></el-input>
                        <el-button type="primary" size="small"
                                   style="position: absolute; top: 4px; right: -30px;"
                                   @click.native="sendNewCode"
                                   :disabled="time > 0">{{text}}
                        </el-button>
                    </el-form-item>
                    <el-form-item label="验证码：" prop="newVerifyCode">
                        <el-input size="small" type="text" name="newVerifyCode"
                                  v-model="newPhoneVerifyForm.newVerifyCode" :maxlength="4"></el-input>
                    </el-form-item>
                    <div class="tc">
                        <el-button type="primary" size="small" class="w120" @click="handleNewMobile">下一步</el-button>
                    </div>
                </el-form>
            </div>
        </el-dialog>
        <!-- 手机号修改成功弹窗 -->
        <el-dialog title="提示" :visible.sync="isSuccess">
            <div class="success-wrapper">
                <div class="tip">手机号修改成功了，您可以使用新的手机号登录了</div>
                <el-button type="primary" class="w120" @click="isSuccess = false">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import panelTitle from '../PanelTitle/PanelTitle';
    import {isValidPass, isValidMobile} from '../../utils/validate';
    import * as modify from '../../api/modify';
    import {mapGetters} from 'vuex';
    import countDown from '../CountDown/CountDown';

    const ERR_OK = 0;

    export default {
        data () {
            // 密码必须为数字、字母组合、不少于6位
            const validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else if (value.length < 6) {
                    callback(new Error('密码不得少于6位'));
                } else if (!isValidPass(value)) {
                    callback(new Error('密码必须为字母、数字组合'));
                } else {
                    if (this.passForm.checkPass !== '') {
                        this.$refs.passForm.validateField('checkPass');
                    }
                    callback();
                }
            };
            // 验证再次输入密码是否与前一次输入相同
            const validateCheckPass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.passForm.newPwd) {
                    callback(new Error('两次输入密码不一致'));
                } else {
                    callback();
                }
            };
            // 验证码必须为四位
            const codeValidate = (rule, value, callback) => {
                if (value.length !== 4) {
                    callback(new Error('短信验证码为4位'));
                } else {
                    callback();
                }
            };
            const validPhone = (rule, value, callback) => {
                if (!isValidMobile(value)) {
                    callback(new Error('手机号格式错误'));
                } else {
                    callback();
                }
            };
            return {
                title: '用户设置',
                borderColor: '#427DFF',
                request_code: '', // 旧手机号验证码的请求码
                modifyPassdialogVisible: false, // 修改密码弹窗可见性
                modifyPassSuccess: false, // 密码修改成功弹窗可见性
                isOldVisible: false, // 修改手机号弹窗的可见性
                isNewVisible: false, // 修改手机号输入新手机号弹窗
                isSuccess: false,
                time: 0,
                startTime: 60,
                passFormLabelPosition: 'left', // passForm label对齐方式
                passForm: {
                    oldPass: '',
                    verifyCode: '',
                    newPwd: '',
                    checkPass: ''
                },
                passRules: {
                    oldPass: [{required: true, message: '请输入旧密码', trigger: 'blur'}],
                    verifyCode: [{required: true, message: '请输入短信验证码', trigger: 'blur'}],
                    newPwd: [{required: true, validator: validatePass, trigger: 'blur'}],
                    checkPass: [{required: true, validator: validateCheckPass, trigger: 'blur'}]
                },
                oldMobileCodeForm: {
                    code: ''
                },
                oldMobileCodeRule: {
                    code: [{required: true, message: '请输入验证码'}, {validator: codeValidate}]
                },
                newPhoneVerifyForm: {
                    newPhone: '',
                    newVerifyCode: ''
                },
                newPhoneVerifyRules: {
                    newPhone: [
                        {required: true, message: '手机号不能为空'},
                        {validator: validPhone}
                    ],
                    newVerifyCode: [
                        {required: true, message: '验证码不能为空'},
                        {validator: codeValidate}
                    ]
                }
            };
        },
        computed: {
            ...mapGetters([
                'area_code',
                'cell_phone',
                'avatar'
            ]),
            text () {
                return this.time > 0 ? `重新发送(${this.time})` : '获取验证码';
            }
        },
        methods: {
            // 点击发送新手机验证码，首先验证新手机号是否输入
            sendNewCode () {
                this.$refs.newPhoneVerifyForm.validateField('newPhone', error => {
                    if (!error) {
                        modify.sendNewPhone(this.request_code, this.newPhoneVerifyForm.newPhone)
                            .then(res => {
                                if (res.data.error === ERR_OK) {
                                    this.start();
                                } else if (res.data.error === 30004) {
                                    this.$message({
                                        message: '24小时内发送短信数目超过限制',
                                        type: 'warning',
                                        showClose: true
                                    });
                                } else if (res.data.error === 30001) {
                                    this.$message({
                                        message: '短信验证码发送失败',
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
            submitPassForm (passForm) {
                this.$refs[passForm].validate((valid) => {
                    if (valid) {
                        modify.modifyPass(this.passForm.verifyCode, this.passForm.newPwd)
                            .then(res => {
                                if (res.data.error === ERR_OK) {
                                    this.modifyPassSuccess = true;
                                    setTimeout(() => {
                                        this.modifyPassdialogVisible = false;
                                    }, 200);
                                } else if (res.data.error === 30007) {
                                    this.$message({
                                        message: '验证码错误',
                                        type: 'error',
                                        showClose: true
                                    });
                                }
                            });
                    } else {
                        return false;
                    }
                });
            },

            handleModifyPass () {
                this.modifyPassdialogVisible = true;
            },

            // 下一步，验证旧手机验证码
            handleOldMobile () {
                this.$refs.oldMobileCodeForm.validate(valid => {
                    if (valid) {
                        modify.verifyOldPhone(this.request_code, this.oldMobileCodeForm.code)
                            .then(res => {
                                if (res.data.error === ERR_OK) {
                                    this.isNewVisible = true;
                                    setTimeout(() => {
                                        this.isOldVisible = false;
                                    }, 200);
                                } else if (res.data.error === 30007 || res.data.error === 30006) {
                                    this.$message({
                                        message: '验证码错误',
                                        type: 'error',
                                        showClose: true
                                    });
                                }
                            });
                    } else {
                        return false;
                    }
                });
            },

            // 输入新手机号后，下一步
            handleNewMobile () {
                this.$refs.newPhoneVerifyForm.validate(valid => {
                    if (valid) {
                        modify.verifyNewPhone(this.request_code, this.newPhoneVerifyRules.newVerifyCode)
                            .then(res => {
                                if (res.data.error === ERR_OK) {
                                    this.isSuccess = true;
                                    setTimeout(() => {
                                        this.isNewVisible = false;
                                    }, 200);
                                } else if (res.data.error === 30007) {
                                    this.$message({
                                        message: '旧密码输入有误',
                                        type: 'error',
                                        showClose: true
                                    });
                                }
                            });
                    } else {
                        return false;
                    }
                });
            },
            // 发送旧手机验证码
            sendOldMobileCode () {
                modify.sendOldMobileCode()
                    .then(res => {
                        if (res.data.error === ERR_OK) {
                            this.start();
                            this.request_code = res.data.data.request_code;
                        } else if (res.data.error === 30004) {
                            this.$message({
                                message: '24小时内发送短信数目超过限制',
                                type: 'warning',
                                showClose: true
                            });
                        } else if (res.data.error === 30001) {
                            this.$message({
                                message: '短信验证码发送失败',
                                type: 'warning',
                                showClose: true
                            });
                        }
                    });
            },
            // 修改密码发送手机验证码
            sendCode () {
                this.$refs.passForm.validateField('oldPass', error => {
                    if (!error) {
                        modify.sendModifyPassCode(this.passForm.oldPass)
                            .then(res => {
                                if (res.data.error === ERR_OK) {
                                    this.start();
                                } else if (res.data.error === 30007) {
                                    this.$message({
                                        message: '旧密码输入有误',
                                        type: 'error',
                                        showClose: true
                                    });
                                } else if (res.data.error === 30004) {
                                    this.$message({
                                        message: '24小时内发送短信数目超过限制',
                                        type: 'warning',
                                        showClose: true
                                    });
                                } else if (res.data.error === 30001) {
                                    this.$message({
                                        message: '短信验证码发送失败',
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
            start () {
                this.time = this.startTime;
                this.timer();
            },
            timer() {
                if (this.time > 0) {
                    this.time--;
                    setTimeout(this.timer, 1000);
                }
            },
            closePassDialog () {
                this.time = 0;
                this.$refs.passForm.resetFields();
            },
            closeOld () {
                this.time = 0;
                this.$refs.oldMobileCodeForm.resetFields();
            },
            closeNew () {
                this.time = 0;
                this.$refs.newPhoneVerifyForm.resetFields();
            }
        },
        components: {
            panelTitle,
            countDown
        }
    };
</script>

<style lang="scss">
    @import url('../../common/scss/base.scss');

    .user {
        .el-dialog {
            width: 400px;
        }
        .user-container {
            width: 100%;
            min-height: calc(100vh - 142px);
            background: #fff;
            text-align: center;
            line-height: 70px;
            .avatar-wrapper {
                padding-top: 60px;
                text-align: center;
                .avatar {
                    width: 120px;
                    height: 120px;
                    border: 1px solid #efefef;
                    border-radius: 50%;
                    cursor: pointer;
                }
            }
            .el-button {
                width: 150px;
            }
        }
        .phone-dialog {
            .el-row {
                padding: 10px 0;
            }
            .mt-10 {
                margin-top: -10px;
            }
            .el-dialog__body {
                padding: 30px 40px;
            }
        }
        .newPhone-wrapper {
            .el-input {
                width: 65%;
            }
        }
        .success-wrapper {
            text-align: center;
            .tip {
                margin-top: 20px;
            }
            .el-button {
                margin-top: 20px;
            }
        }
    }
</style>
