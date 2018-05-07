<template>
    <div class="findpwd-container">
        <h2 class="title">密码找回</h2>
        <i class="el-icon-close" @click="close"></i>
        <el-form :model="findpwdForm" :rules="findpwdRules" ref="findpwdForm">
            <el-form-item prop="phone">
                <el-input name="phone"
                          type="text"
                          autoComplete="off"
                          :maxlength="11"
                          v-model="findpwdForm.phone"
                          placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item prop="graph_code">
                <el-input type="text" name="graph_code"
                          v-model="findpwdForm.graph_code"
                          :maxlength="4"
                          placeholder="验证码"></el-input>
                <div class="graphCode-wrapper">
                    <img ref="graphCode"
                         @click="refresh"
                         :src="'https://api.51zbb.net/web/graphics/code/get?ignore=1&key='+key"
                         alt="验证码">
                </div>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click.native="next">下一步</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {isValidMobile} from '../../utils/validate';
    import {getRandomNum} from '../../utils/index';
    import {resetPwdFirst} from '../../api/modify';
    import {mapMutations} from 'vuex';

    export default {
        data() {
            // 验证手机号格式是否正确
            const validateLoginMobile = (rule, value, callback) => {
                if (!isValidMobile(value)) {
                    callback(new Error('手机号码有误，请重新输入'));
                } else {
                    callback();
                }
            };
            // 验证图形验证码输入是否正确
            const validateGraph = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入图形验证码'));
                } else if (value.length !== 4) {
                    callback(new Error('验证码为四位数字'));
                } else {
                    callback();
                }
            };
            return {
                findpwdForm: {
                    phone: '',
                    graph_code: ''
                },
                findpwdRules: {
                    phone: [
                        {required: true, trigger: 'change', message: '请输入手机号'},
                        {whitespace: true, trigger: 'change', message: '请输入手机号'},
                        {validator: validateLoginMobile, trigger: 'change', message: '手机号格式错误'}
                    ],
                    graph_code: [
                        {validator: validateGraph, trigger: 'change'}
                    ]
                },
                key: ''
            };
        },
        created() {
            this.key = getRandomNum();
        },
        methods: {
            // 刷新验证码
            refresh() {
                this.key = getRandomNum();
                this.$refs.graphCode.src = '/graphics/code/get?ignore=1&key=' + this.key;
            },
            // 下一步
            next() {
                this.$refs.findpwdForm.validate(valid => {
                    if (valid) {
                        resetPwdFirst(this.findpwdForm.phone, this.key, this.findpwdForm.graph_code)
                            .then(res => {
                                if (res.data.error === 0) {
                                    this.setOpKey(res.data.data.op_key);
                                    this.$router.push({
                                        path: '/login/findpwdTwo'
                                    });
                                } else if (res.data.error === 30009) {
                                    this.$message({
                                        message: '用户名不存在，请重新输入',
                                        type: 'error',
                                        showClose: true
                                    });
                                } else if (res.data.error === 30016) {
                                    this.$message({
                                        message: '验证码有误，请重新输入',
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
            close() {
                this.$router.push({
                    path: '/login'
                });
            },
            ...mapMutations({
                setOpKey: 'SET_OP_KEY'
            })
        }
    };
</script>

<style lang="scss">
    .findpwd-container {
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
        .el-form-item:nth-child(2) {
            padding: 5px 0 16px;
            .el-form-item__content {
                display: flex;
                justify-content: space-between;
                .graphCode-wrapper {
                    width: 42%;
                    margin-left: 10px;
                    img {
                        width: 100%;
                        vertical-align: bottom;
                        cursor: pointer;
                    }
                }
            }
        }
    }
</style>
