<template>
    <div class="findpwdTwo-container">
        <h2 class="title">密码找回</h2>
        <i class="el-icon-close" @click="close"></i>
        <el-form :model="findpwdForm" :rules="findpwdRules" ref="findpwdForm">
            <el-form-item prop="phone_code">
                <el-input type="text"
                          name="phone_code"
                          v-model="findpwdForm.phone_code"
                          :maxlength="4"
                          placeholder="输入短信验证码"></el-input>
                <el-button type="primary" size="small" @click="sendCode"
                           :disabled="time > 0">{{text}}
                </el-button>
            </el-form-item>
            <el-form-item prop="newPwd">
                <el-input name="newPwd"
                          type="password"
                          autoComplete="off"
                          :maxlength="20"
                          v-model="findpwdForm.newPwd"
                          placeholder="输入新密码"></el-input>
            </el-form-item>
            <el-form-item prop="verifyPwd">
                <el-input name="verifyPwd"
                          type="password"
                          autoComplete="off"
                          :maxlength="20"
                          v-model="findpwdForm.verifyPwd"
                          placeholder="重复输入新密码"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click.native="resetPwd">确定</el-button>
            </el-form-item>
        </el-form>
        <el-dialog title="提示"
                   :visible.sync="isSuccess"
                   @close="closeDialog"
                   :close-on-press-escape="false"
                   :close-on-click-modal="false"
                   :show-close="false">
            <div class="success-wrapper">
                <div class="tip">密码重置成功了，您现在可以使用新密码登录了</div>
                <el-button type="primary" @click="isSuccess = false">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {isValidPass} from '../../utils/validate';
    import {sendPhoneCode, submitNewPwd} from '../../api/modify';
    import {mapGetters, mapActions} from 'vuex';

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
                    if (this.findpwdForm.verifyPwd !== '') {
                        this.$refs.findpwdForm.validateField('verifyPwd');
                    }
                    callback();
                }
            };
            // 验证再次输入密码是否与前一次输入相同
            const validateCheckPass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.findpwdForm.newPwd) {
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
            return {
                findpwdForm: {
                    phone_code: '',
                    newPwd: '',
                    verifyPwd: ''
                },
                findpwdRules: {
                    phone_code: [
                        {required: true, message: '请输入验证码', trigger: 'change'},
                        {validator: codeValidate, trigger: 'change'}
                    ],
                    newPwd: [
                        {validator: validatePass, trigger: 'change'}
                    ],
                    verifyPwd: [
                        {validator: validateCheckPass, trigger: 'change'}
                    ]
                },
                time: 0,
                startTime: 60,
                isSuccess: false
            };
        },
        computed: {
            text () {
                return this.time > 0 ? `重新发送(${this.time})` : '获取验证码';
            },
            ...mapGetters([
                'op_key'
            ])
        },
        destroyed () {
            this.setOpKey({op_key: ''});
        },
        methods: {
            sendCode () {
                sendPhoneCode(this.op_key)
                    .then(res => {
                        const errno = res.data.error;
                        if (errno === 0) {
                            this.start(); // 开始60秒倒计时
                        } else if (errno === 30001) {
                            this.$message({
                                message: '短信验证码发送失败',
                                type: 'warning',
                                showClose: true
                            });
                        } else if (errno === 30004) {
                            this.$message({
                                message: '24小时内发送短信数目超过限制',
                                type: 'warning',
                                showClose: true
                            });
                        }
                    });
            },
            resetPwd () {
                this.$refs.findpwdForm.validate(valid => {
                    if (valid) {
                        submitNewPwd(this.op_key, this.findpwdForm.phone_code, this.findpwdForm.newPwd)
                            .then(res => {
                                if (res.data.error === 0) {
                                    this.isSuccess = true;
                                } else if (res.data.error === 30007) {
                                    this.$message({
                                        message: '手机验证码验证失败',
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
            close () {
                this.$router.push({
                    path: '/login'
                });
            },
            closeDialog () {
                this.$router.push({
                    path: '/login'
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
            ...mapActions([
                'setOpKey'
            ])
        }
    };
</script>

<style lang="scss">
    .el-dialog {
        width: 400px;
    }

    .findpwdTwo-container {
        position: relative;
        box-sizing: border-box;
        padding: 42px 78px 0;
        .el-input__inner {
            border-top: none;
            border-left: none;
            border-right: none;
            border-radius: 0;
        }
        & > .el-icon-close {
            position: absolute;
            top: 48px;
            right: 80px;
            color: #ccc;
            cursor: pointer;
            font-size: 12px;
            transition: all .3s ease;
            &:hover {
                color: #aaa;
            }
        }
        & > .title {
            font-size: 15px;
            padding-bottom: 35px;
            padding-left: 2px;
        }
        .el-button {
            width: 100%;
        }
        .el-form-item:first-child {
            .el-form-item__content {
                .el-input {
                    float: left;
                    width: 55%;
                    margin-right: 5px;
                }
                .el-button {
                    position: relative;
                    bottom: -7px;
                    float: right;
                    width: 42%;
                }
            }
        }
        .el-form-item:last-child {
            margin-top: 32px;
        }
        .success-wrapper {
            text-align: center;
            .tip {
                margin-top: 20px;
            }
            .el-button {
                margin-top: 20px;
                width: 120px;
                cursor: pointer;
            }
        }
    }
</style>
