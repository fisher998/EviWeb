<template>
    <div class="suggest-container">
        <panelTitle title="投诉建议" border-left-color="#1D8CE0"></panelTitle>
        <div class="content">
            <div class="title tc">输入投诉或建议内容</div>
            <el-input type="textarea"
                      :maxlength="500"
                      v-model="advice_content"
                      :rows="8"
                      placeholder="最多500字"></el-input>
            <div class="handlerBtn">
                <el-upload class="upload-wrapper"
                           ref="upload"
                           action=""
                           accept=".jpg,.png"
                           :disabled="isDisabled"
                           :on-change="uploadChange"
                           :auto-upload="false">
                    <el-button type="success">插入图片</el-button>
                </el-upload>
                <div class="rightBtn">
                    <el-button type="primary" @click="submitAdvice" :loading="isLoading">提交</el-button>
                    <el-button>
                        <router-link to="/">取消</router-link>
                    </el-button>
                </div>
            </div>
            <div class="line"></div>
            <table>
                <tr class="title">
                    <th colspan="4">投诉建议记录</th>
                </tr>
                <template v-if="isAdviceShow">
                    <tr v-for="(item, index) in adviceList">
                        <td>{{item.request_time}}</td>
                        <td>{{item.content}}</td>
                        <td>{{item.is_reply ? '已回复' : '未回复'}}</td>
                        <td>
                            <el-button size="small" @click="showDetail(index)">查看详情</el-button>
                        </td>
                    </tr>
                </template>
                <template v-else>
                    <tr>
                        <td colspan="4">木有建议</td>
                    </tr>
                </template>
            </table>
        </div>
        <el-dialog class="dialog" title="查看详情" size="tiny" :visible.sync="isSuggestDialogVisible">
            <div class="img-wrapper">
                <img v-for="item in adviceList[index].imgs" :src="item" alt="投诉建议图片" width="150" height="150">
            </div>
            <h2 class="title">投诉建议的内容</h2>
            <div class="content">{{adviceList[index].content}}</div>
            <h2 class="title">客服回复</h2>
            <div class="content">{{adviceList[index].reply_content || '暂无回复'}}</div>
            <div class="close-wrapper tc">
                <el-button class="w120" @click="isSuggestDialogVisible = false">关闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import panelTitle from '../PanelTitle/PanelTitle';
    import {getAliyunOSS} from '../../api/upload';
    import {getAdviceList, postAdvice, postAdviceWidthImg} from '../../api/user';
    import {getFileExtension} from '../../utils';

    export default {
        data () {
            return {
                adviceList: [{content: '', reply_content: ''}],
                isSuggestDialogVisible: false,
                index: 0,
                advice_content: '',
                isAdviceShow: true,
                aliyunData: {
                    'AccessKeyId': '',
                    'AccessKeySecret': '',
                    'Expiration': '',
                    'SecurityToken': '',
                    'Bucket': '',
                    'Host': ''
                },
                fileList: [],
                isLoading: false,
                isDisabled: false,
                uploadImgs: []
            };
        },
        created () {
            this.fetchAdviceList();
        },
        methods: {
            // fetch data
            fetchAdviceList () {
                getAdviceList()
                    .then(res => {
                        if (res.data.error === 0) {
                            this.adviceList = Object.assign({}, this.adviceList, res.data.data);
                            if (res.data.data === undefined) {
                                this.isAdviceShow = false;
                            }
                        }
                    });
            },
            submitAdvice () {
                if (this.advice_content === '') {
                    this.$message({
                        message: '内容不能为空',
                        type: 'warning',
                        showClose: true
                    });
                } else if (this.advice_content.length < 10) {
                    this.$message({
                        message: '不能少于十个字符',
                        type: 'warning',
                        showClose: true
                    });
                } else {
                    this.isLoading = true;
                    if (this.fileList.length) {
                        this._getAliyunOSS()
                            .then(() => {
                                let _this = this;
                                // 提交图片
                                new Promise(resolve => {
                                    let flag = 0;
                                    for (let i = 0; i < this.fileList.length; i++) {
                                        let file = this.fileList[i].raw;
                                        let suffix = getFileExtension(file.name); // 获取文件的扩展名,没有.
                                        let name = new Date().valueOf();  // 随机生成文件名
                                        let storeAs = name + '.' + suffix; // 命名空间
                                        let client = new OSS.Wrapper({
                                            accessKeyId: this.aliyunData.AccessKeyId,
                                            accessKeySecret: this.aliyunData.AccessKeySecret,
                                            region: 'oss-cn-beijing',
                                            stsToken: this.aliyunData.SecurityToken,
                                            bucket: this.aliyunData.Bucket
                                        });
                                        client.multipartUpload(storeAs, file)
                                            .then(function (result) {
                                                _this.uploadImgs.push(result.res.requestUrls[0].replace(/\?.*$/g, ''));
                                                flag++;
                                                if (flag === _this.fileList.length) {
                                                    resolve();
                                                }
                                            });
                                    }
                                }).then(() => {
                                    let imgs = JSON.parse(JSON.stringify(this.uploadImgs));
                                    postAdviceWidthImg(this.advice_content, imgs)
                                        .then(res => {
                                            if (res.data.error === 0) {
                                                this.$message({
                                                    message: '提交成功，我们的工作人员会尽快回复。',
                                                    type: 'success',
                                                    showClose: true
                                                });
                                                this.uploadImgs.length = 0;
                                                this.isLoading = false;
                                                this.advice_content = '';
                                                this.$refs.upload.clearFiles();
                                                this.fileList = '';
                                                this.isDisabled = false;
                                                setTimeout(() => {
                                                    this.fetchAdviceList();
                                                }, 600);
                                            }
                                        });
                                });
                            });
                    } else {
                        postAdvice(this.advice_content).then(res => {
                            if (res.data.error === 0) {
                                this.$message({
                                    message: '提交成功，我们的工作人员会尽快回复。',
                                    type: 'success',
                                    showClose: true
                                });
                                this.isLoading = false;
                                this.advice_content = '';
                                setTimeout(() => {
                                    this.fetchAdviceList();
                                }, 600);
                            }
                        });
                    }
                }
            },
            uploadChange (file, fileList) {
                this.fileList = fileList;
                fileList.length === 3 ? this.isDisabled = true : this.isDisabled = false;
            },
            showDetail (index) {
                this.index = index;
                this.isSuggestDialogVisible = true;
            },
            _getAliyunOSS () {
                return new Promise(resolve => {
                    getAliyunOSS()
                        .then(res => {
                            this.aliyunData = Object.assign({}, this.aliyunData, res.data.data);
                            resolve();
                        });
                });
            }
        },
        components: {
            panelTitle
        }
    };
</script>

<style lang="scss">
    @import '../../common/scss/mixin';

    .suggest-container {
        .content {
            margin-top: 10px;
            .title {
                font-size: 15px;
                margin-bottom: 20px;
            }
            .handlerBtn {
                margin: 20px 0;
                text-align-last: justify;
                .upload-wrapper {
                    width: 300px;
                    display: inline-block;
                }
                .rightBtn {
                    float: right;
                }
            }
            .line {
                border: 1px solid #ddd;
                margin: 26px 0 20px 0;
            }
        }
        table {
            table-layout: fixed;
            position: relative;
            width: 100%;
            background: #fff;
            text-align: center;
            margin-bottom: 30px;
            .title {
                font-weight: 700;
                color: #fff;
                background: #427dff;
                th {
                    padding: .8rem 0;
                }
            }
            td {
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
            tr + tr {
                border-bottom: 1px solid #f0f2f4;
                line-height: 4rem;
            }
            tr:last-child {
                border: none;
            }
        }
        .dialog {
            .img-wrapper {
                display: flex;
                margin-bottom: 20px;
                img {
                    cursor: pointer;
                    border-radius: 5px;
                    margin-left: 10px;
                    border: 3px solid #ddd;
                    &:first-child {
                        margin-left: 0;
                    }
                }
            }
            .title {
                font-weight: 700;
                position: relative;
                padding-left: 10px;
                &::after {
                    @include dotted(#58B7FF);
                }
            }
            .title:nth-of-type(2) {
                &::after {
                    @include dotted(#13CE66);
                }
            }
            .content {
                font-size: 12px;
                color: #888;
                line-height: 20px;
                padding-left: 10px;
                word-break: break-all;
            }
            .content:nth-of-type(2) {
                padding-bottom: 10px;
            }
            .content:nth-of-type(3) {
                border: 1px solid #ddd;
                padding: 5px 5px 5px 12px;
                margin-bottom: 20px;
            }
        }
        .el-dialog {
            width: 535px;
        }
    }
</style>
