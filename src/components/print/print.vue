<template>
    <div class="print-container">
        <panelTitle title="网页取证" border-left-color="#1D8CE0"></panelTitle>
        <div class="content">
            <div class="print-wrapper" @keyup.enter="handleEnter">
                <div class="label">请输入要取证的网址：</div>
                <el-input v-model="url" placeholder="例如：http://www.zhengbaobao.com"></el-input>
                <el-button type="primary" @click.native="print" :disabled="isDisabled">开始取证</el-button>
            </div>
            <div class="tip">输入网址太麻烦？无法取证登录状态的网页？试试“证宝宝”一键取证浏览器插件吧。<a href="http://www.zhengbaobao.com/download.html#plugin"
                                                                      target="_blank"
                                                                      class="color-primary">&gt;&gt;去下载</a>
                <!--<br><span class="fl">若无法取证成功，还可以试一试"<a href="http://47.91.196.66:6901" target="_blank"-->
                <!--class="color-primary">证宝宝智能公证机器人</a>"</span>-->
            </div>
            <div class="state-wrapper" v-loading="loading" element-loading-text="网页取证中,请稍候...">
                <template v-if="imgFlag === 1">
                    <img src="./cert_begin.png" alt="开始取证">
                    <div class="explain">
                        输入需要取证的网址，点击“<span class="color-primary">开始取证</span>”<br>
                        我们会帮您将该网址对应的网页内容取证保存下来
                    </div>
                </template>
                <template v-else-if="imgFlag === 2">
                    <img src="./cert_loading.png" alt="取证中">
                    <div class="explain">
                        <span class="color-primary">取证中...</span><br>
                    </div>
                </template>
                <template v-else-if="imgFlag === 0">
                    <img src="./cert_fail.png" alt="取证失败">
                    <div class="explain">
                        <span class="color-danger">取证失败</span><br>
                        <!--<div>可能该网页使用的技术不支持远程取证,使用"<span class="color-primary">证宝宝智能取证机器人</span>"即可成功取证该类型的网页. <span-->
                        <!--class="color-primary">去试试&gt;&gt;</span></div>-->
                    </div>
                </template>
                <template v-else-if="imgFlag === 3">
                    <div class="pdf">
                        <a :href="src"
                           id="pdf"></a>
                    </div>
                </template>
            </div>
        </div>
        <remain-lack :show.sync="isLackShow"></remain-lack>
        <space-lack :show.sync="isSpaceLack"></space-lack>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            size="tiny">
            <div style="padding-top: 20px">网址格式不正确，请输入完整的网址，包括http://或https://</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import PanelTitle from '../PanelTitle/PanelTitle';
    import {postWebEvidence, getPrintResult} from '../../api/cert';
    import {mapActions, mapGetters} from 'Vuex';
    import RemainLack from '../remain-lack/remain-lack';
    import SpaceLack from '../space-lack/space-lack';
    import '../../../static/jquery.media';

    export default {
        data() {
            return {
                url: '',
                loading: false,
                isDisabled: false,
                imgFlag: 1,
                currentFileStatus: 0,
                cert_key: 0, // 用于查询网页打印结果的key
                src: '',
                isLackShow: false, // 余额不足弹窗是否显示
                isSpaceLack: false, // 空间不足弹窗
                dialogVisible: false
            };
        },
        computed: {
            ...mapGetters([
                'fileManageData'
            ])
        },
        updated() {
            if (this.imgFlag === 3) {
                this._addPdfView('.pdf', this.src);
            }
        },
        methods: {
            print() {
                if (this.url) {
                    const clientWidth = window.innerWidth;
                    let url = decodeURIComponent(this.url);
                    postWebEvidence(1, url, '', clientWidth, 100).then(res => {
                        if (res.data.error === 0) {
                            this.isDisabled = true;
                            this.loading = true;
                            this.cert_key = res.data.data.cert_key;
                            this.imgFlag = 2;
                            this._setTimeoutGetPrintResult();
                        } else if (res.data.error === 30006) {
                            this.dialogVisible = true;
                        } else if (res.data.error === 30014) {
                            this.isSpaceLack = true;
                        } else if (res.data.error === 30012) {
                            this.isLackShow = true;
                        }
                    });
                } else {
                    this.$message({
                        type: 'error',
                        message: '取证网址不能为空',
                        showClose: true
                    });
                }
            },
            // 隔时去获取打印结果
            _setTimeoutGetPrintResult() {
                getPrintResult(this.cert_key).then(res => {
                    if (res.data.error === 0) {
                        // status 任务状态 1完成 -1失败 0处理中
                        let file_url = res.data.data.file_url;
                        let file_status = res.data.data.status;
                        if (file_url) { // 取证成功
                            this.loading = false;
                            this.isDisabled = false;
                            this.src = res.data.data.file_url;
                            this.imgFlag = 3; // 3
                            this.$message({
                                message: '取证成功',
                                type: 'success',
                                showClose: true
                            });
                        } else if (file_status === -1) { // 取证失败
                            this.loading = false;
                            this.isDisabled = false;
                            this.imgFlag = 0;
                        } else if (file_status === 0) { // 处理中
                            setTimeout(this._setTimeoutGetPrintResult, 3000);
                        }
                    }
                });
//                this.GetFileList({type: 0, page: 0, page_size: 10}).then(() => {
//                    this.currentFileStatus = this.fileManageData[0].file_status;
//                    if (this.currentFileStatus === 2) { // 取证成功
//                        this.loading = false;
//                        this.isDisabled = false;
//                        this.imgFlag = 3;
//                        this.src = this.fileManageData[0].file_url;
//                    } else if (this.currentFileStatus === -1 || this.currentFileStatus === -2) { // 取证失败
//                        this.loading = false;
//                        this.isDisabled = false;
//                        this.imgFlag = 0;
//                    } else {
//                        setTimeout(this._setTimeoutGetFileList, 3000);
//                    }
//                });
            },
            handleEnter() {
                this.print();
            },
            _addPdfView(selector, src) {
                let a = $('<a>').attr({
                    href: src,
                    id: 'pdf'
                });
                $(selector).append(a);
                $('#pdf').media({width: 800, height: 600});
            },
            ...mapActions([
                'GetFileList'
            ])
        },
        components: {
            PanelTitle,
            RemainLack,
            SpaceLack
        }
    };
</script>

<style lang="scss">
    .print-container {
        .content {
            position: relative;
            width: 100%;
            min-height: calc(100vh - 142px);
            background: #fff;
            margin-bottom: 30px;
            .print-wrapper {
                display: flex;
                justify-content: center;
                padding: 60px 60px 0;
                .label {
                    flex: 155px 0 0;
                    align-self: center;
                    font-weight: bold;
                    font-size: 14px;
                }
                .el-button {
                    margin-left: 16px;
                }
            }
            .tip {
                position: absolute;
                left: 206px;
                text-align: center;
                font-size: 12px;
                color: #aaa;
                padding-top: 10px;
                line-height: 22px;
            }
            .state-wrapper {
                margin-top: 68px;
                text-align: center;
                .explain {
                    font-size: 13px;
                    margin-top: 18px;
                    line-height: 23px;
                }
                .pdf {
                    text-align: center;
                    #pdf {
                        display: inline-block;
                        margin-bottom: 28px;
                    }
                }
            }
        }
    }
</style>
