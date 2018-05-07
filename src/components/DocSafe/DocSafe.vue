<template>
    <div class="doc-container">
        <panelTitle title="文档保全" border-left-color="#13CE66"></panelTitle>
        <div class="doc-content">
            <el-button type="success" v-if="isUploadAgain" class="w120 again-upload" size="small"
                       @click.native="uploadAgain">
                再次上传
            </el-button>
            <div class="upload-wrapper">
                <el-upload
                    drag
                    ref="upload"
                    action="/upload/file"
                    name="document"
                    :multiple="false"
                    :on-change="uploadChange"
                    :before-upload="handleBeforeUpload"
                    :on-error="handleError"
                    :on-remove="remove"
                    :on-success="handleSuccess"
                    :auto-upload="false">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip" slot="tip">保全的文档大小不可超过48M</div>
                </el-upload>
            </div>
            <template v-if="show">
                <transition name="fade" mode="out-in">
                    <div class="upload-progress">
                        <div>文件名：{{fileName}}</div>
                        <div v-show="isSha">数据指纹：{{fileSha256}}</div>
                        <el-progress v-show="isPercent" :percentage="100" status="success"></el-progress>
                    </div>
                </transition>
            </template>
            <div class="uploadBtn-wrapper">
                <el-button type="primary" class="el-btn" :loading="isLoading" :disabled="isDisabled"
                           @click.native="uploadNoFile">源文档不上传
                </el-button>
                <el-button type="primary" class="el-btn" :loading="isLoading" :disabled="isDisabled"
                           @click.native="uploadWithFile">源文档上传
                </el-button>
                <el-button class="el-btn" @click.native="close">返回</el-button>
            </div>
            <div class="declare-wrapper">
                <span class="declare">说明：<span class="b">“源文档不上传”</span>适用于机密文档或隐私文档，本系统不会上传源文档，仅上传该源文档的数据指纹。<span
                    style="color: #FF4949">请自行妥善保管源文档</span>以备验证。</span>
            </div>
        </div>
        <space-lack :show.sync="isSpaceLack"></space-lack>
        <remain-lack :show.sync="isRemainLack"></remain-lack>
    </div>
</template>

<script>
    import panelTitle from '../PanelTitle/PanelTitle.vue';
    import SpaceLack from '../space-lack/space-lack';
    import RemainLack from '../remain-lack/remain-lack';
    import CryptoJS from 'crypto-js';
    import {mapGetters} from 'vuex';

    export default {
        data() {
            return {
                fileSha256: '',
                fileName: '',
                show: false,
                file: '',
                file_key: '',
                isSha: true,
                isDisabled: false,
                isPercent: false,
                isUploadAgain: false,
                isLoading: false, // 文件sha256计算中时，按钮显示加载中
                isSpaceLack: false, // 空间不足弹窗
                isRemainLack: false // 余额不足弹窗
            };
        },
        computed: {
            ...mapGetters([
                'available',
                'total_size',
                'used_size'
            ])
        },
        destory() {
            this.show = false;
            this.fileName = '';
            this.file = '';
            this.fileSha256 = '';
            this.isDisabled = false;
            this.isPercent = false;
        },
        methods: {
            uploadAgain() {
                this.show = false;
                this.fileName = '';
                this.file = '';
                this.fileSha256 = '';
                this.isDisabled = false;
                this.isPercent = false;
                this.isUploadAgain = false;
                this.$refs.upload.clearFiles();
            },
            uploadNoFile() {
                if (parseInt(this.total_size) > 0) {
                    // 总空间，如果后缀是M则取出数值，如果不是则乘1024,最后得出的是单位是M的数值
                    let totalSize = this.total_size.slice(-1) === 'M' ? parseInt(this.total_size) : parseInt(this.total_size) * 1024;
                    // 已用空间
                    let usedSize;
                    let usedSizeExt = this.used_size.slice(-1);
                    if (usedSizeExt === 'K') {
                        usedSize = parseInt(this.used_size) / 1024;
                    } else if (usedSizeExt === 'M') {
                        usedSize = parseInt(this.used_size);
                    } else if (usedSizeExt === 'G') {
                        usedSize = parseInt(this.used_size) * 1024;
                    }
                    if (this.fileName) {
                        if (this.available < 2) {
                            this.isRemainLack = true;
                        } else if (this.total_size === 0) {
                            this.isSpaceLack = true;
                        } else if (usedSize >= totalSize) {
                            this.isSpaceLack = true;
                        } else {
                            this.isDisabled = true;
                            this.$store.dispatch('CertNoFile', {hash: this.fileSha256, file_name: this.fileName})
                                .then(res => {
                                    if (res === 0) {
                                        this.$message({
                                            message: '文档保全成功',
                                            type: 'success',
                                            showClose: true
                                        });
                                        this.isPercent = true;
                                        this.isUploadAgain = true;
                                    } else if (res === 30018) {
                                        this.$message({
                                            message: '无权操作',
                                            type: 'warning',
                                            showClose: true
                                        });
                                        this.isDisabled = false;
                                    }
                                });
                        }
                    } else {
                        this.$message({
                            message: '请先选择上传文档',
                            type: 'warning',
                            showClose: true
                        });
                    }
                } else {
                    this.isSpaceLack = true;
                }
            },
            // 有文件被选择时
            uploadChange(file) {
                let reader = new FileReader();
                reader.readAsArrayBuffer(file.raw);
                this.fileName = file.name;
                this.file = file;
                this.isPercent = false;
                this.show = true;
                this.fileSha256 = '计算中...';
                this.isLoading = true;
                this._calcFileSha256(file);
            },
            // 计算文件的sha256值
            _calcFileSha256(file) {
                let reader = new FileReader();
                let _this = this;
                reader.readAsArrayBuffer(file.raw);
                reader.onload = function () {
                    let wordArray = CryptoJS.lib.WordArray.create(reader.result);
                    _this.fileSha256 = CryptoJS.SHA256(wordArray).toString();
                    _this.isLoading = false;
                };
            },
            // 源文档上传
            uploadWithFile() {
                if (this.fileName) { // 通过有无文件名来判断是否已经选择文件
                    if (this.available < 2) {
                        this.isRemainLack = true;
                    } else {
                        this.isDisabled = true;
                        this.$refs.upload.submit();
                    }
                } else {
                    this.$message({
                        message: '请先选择上传文档',
                        type: 'warning',
                        showClose: true
                    });
                }
            },
            // 上传文件前验证文件大小，不可起过48M
            handleBeforeUpload(file) {
                // 新注册用户空间为0, this.total_size.slice(-1)会报错
                if (parseInt(this.total_size) > 0) {
                    let fileSize = file.size / 1024 / 1024;
                    let isLt48M = file.size / 1024 / 1024 < 45;
                    // 总空间，如果后缀是M则取出数值，如果不是则乘1024,最后得出的是单位是M的数值
                    let totalSize = this.total_size.slice(-1) === 'M' ? parseInt(this.total_size) : parseInt(this.total_size) * 1024;
                    // 已用空间
                    let usedSize;
                    let usedSizeExt = this.used_size.slice(-1);
                    if (usedSizeExt === 'K') {
                        usedSize = parseInt(this.used_size) / 1024;
                    } else if (usedSizeExt === 'M') {
                        usedSize = parseInt(this.used_size);
                    } else if (usedSizeExt === 'G') {
                        usedSize = parseInt(this.used_size) * 1024;
                    }
                    // 剩余空间
                    let remainSize = totalSize - usedSize;
                    if (!isLt48M) {
                        this.$message({
                            message: '上传文件大小超过限制',
                            type: 'error',
                            showClose: true
                        });
                        this.fileName = '';
                        return false;
                    } else if (fileSize > remainSize) {
                        this.isSpaceLack = true;
                        this.fileName = '';
                        return false;
                    }
                } else {
                    this.isSpaceLack = true;
                    this.fileName = '';
                    return false;
                }
            },
            // 上传失败
            handleError() {
                this.isDisabled = false;
                this.fileName = '';
                this.show = false;
                this.$message({
                    message: '文件上传失败',
                    type: 'error',
                    showClose: true
                });
            },
            // 上传成功
            handleSuccess(res) {
                this.file_key = res.data;
                this.$store.dispatch('CertWithFile', {file_key: this.file_key, file_name: this.fileName})
                    .then(res => {
                        if (res === 0) {
                            this.isPercent = true;
                            this.isDisabled = true;
                            this.$message({
                                message: '文档保全成功',
                                type: 'success',
                                showClose: true
                            });
                            this.isUploadAgain = true;
                        } else if (res === 30018) {
                            this.$message({
                                message: '无权操作',
                                type: 'warning',
                                showClose: true
                            });
                            this.isDisabled = false;
                        }
                    });
            },
            remove() {
                this.show = false;
                this.isDisabled = false;
                this.isPercent = false;
            },
            close() {
                this.$refs.upload.abort();
                this.$router.push({path: '/'});
            }
        },
        components: {
            panelTitle,
            SpaceLack,
            RemainLack
        }
    };
</script>

<style lang="scss">
    @import '../../common/scss/mixin';

    .doc-content {
        position: relative;
        min-height: calc(100vh - 142px);
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        width: 100%;
        background: #fff;
        padding: 10px 30px;
        margin-bottom: 30px;
        .again-upload {
            position: absolute;
            left: 50%;
            margin-left: -60px;
            top: 110px;
        }
        .upload-wrapper {
            margin-top: 144px;
            text-align: center;
            padding: 20px 0;
            .el-upload-dragger {
                width: 553px;
            }
            .el-icon-close {
                display: none;
            }
        }
        .uploadBtn-wrapper {
            margin-top: 10px;
            margin-bottom: 30px;
            text-align: center;
            .el-btn {
                width: 150px;
                margin: 0 25px;
            }
        }
        .declare-wrapper {
            text-align: center;
            padding-bottom: 32px;
            .declare {
                position: relative;
                &::after {
                    @include dotted(#FF4949);
                    margin-left: -10px;
                    margin-top: -1px;
                }
            }
        }
        .upload-progress {
            position: absolute;
            top: 152px;
            left: 50%;
            transform: translate(-50%, 0);
            background: #fff;
            border: 1px dashed #d9d9d9;
            border-radius: 5px;
            width: 512px;
            height: 148px;
            margin: 20px auto;
            padding: 16px 35px;
            line-height: 28px;
            font-size: 14px;
            word-break: break-all;
        }
        .fade-enter-active {
            animation: fadeIn .2s;
        }
        .fade-leave-active {
            animation: fadeIn .2s reverse;
        }
        .el-upload-list__item {
            background: #efefef;
            line-height: 2.8;
        }
    }
</style>
