<template>
    <div class="file-container" @click.capture="currentCertId = -1">
        <panelTitle title="存证文件管理" border-left-color="#437dff"
                    class="fl"></panelTitle>
        <search class="fr"></search>
        <table>
            <tr class="title">
                <th>
                    <template v-if="isFileEmpty">
                        <el-button v-if="userFlag" v-waves.button size="small" @click="openAllDialog" type="warning">全挂
                        </el-button>
                    </template>
                    名称
                </th>
                <th>存证编号</th>
                <th class="sort-title"
                    style="width: 90px;"
                    @mouseenter="toggleSortListVisible"
                    @mouseleave="toggleSortListVisible">
                    默认排序
                    <ul class="sort" v-show="isSortListVisible">
                        <li><a href="javascript:void(0);" @click="searchByType(0)">默认排序</a></li>
                        <li><a href="javascript:void(0);" @click="searchByType(1)">网页打印</a></li>
                        <li><a href="javascript:void(0);" @click="searchByType(2)">网页截屏</a></li>
                        <li><a href="javascript:void(0);" @click="searchByType(3)">文档保全</a></li>
                        <li><a href="javascript:void(0);" @click="searchByType(4)">录像</a></li>
                        <li><a href="javascript:void(0);" @click="searchByType(5)">录音</a></li>
                        <li><a href="javascript:void(0);" @click="searchByType(6)">拍照</a></li>
                        <li><a href="javascript:void(0);" @click="searchByType(7)">截屏</a></li>
                        <li><a href="javascript:void(0);" @click="searchByType(8)">机器人截屏</a></li>
                        <li><a href="javascript:void(0);" @click="searchByType(9)">机器人录像</a></li>
                    </ul>
                </th>
                <th style="width: 80px;">全挂状态</th>
                <th style="width: 80px;">单挂状态</th>
                <th colspan="4" style="width: 318px;">操作</th>
            </tr>
            <template v-if="isFileEmpty">
                <tr v-for="(file, index) in fileManageData">
                    <td class="tl"
                        :ref="file.file_name"
                        :class="['fileName-logo','fileName-logo-'+file.file_type]">
                        <span :class="[fileStatus(file.file_status), 'fileName']">
                            <el-tooltip :content="file.file_name"
                                        effect="light"
                                        :disabled="isToolTip"
                                        placement="top-start">
                                <a :href="file.view_url"
                                   :class="[{nameColor: canCheck(file.view_url) || file.file_type ===2 || file.file_type ===3 }]"
                                   @mouseenter="mouseTip(file.file_name)"
                                   @mouseleave="isToolTip = true"
                                   @click="openFile(file.view_url, file.file_name, file.file_type, $event)"
                                   target="_blank">
                                    <span
                                        :class="[fileStatus(file.file_status)]">
                                        {{file.file_name}}
                                    </span>
                                </a>
                            </el-tooltip>
                        </span>
                    </td>
                    <template v-if="file.file_status === 2">
                        <td :class="[fileStatus(file.file_status)]">{{file.cert_no}}</td>
                    </template>
                    <template v-else-if="file.file_status === 0 || file.file_status === 1">
                        <td :class="[fileStatus(file.file_status)]">取证中...</td>
                    </template>
                    <template v-else-if="file.file_status === -1 || file.file_status === -2">
                        <td :class="[fileStatus(file.file_status)]">取证失败</td>
                    </template>
                    <td :class="[fileStatus(file.file_status)]">{{file.file_type | typeSwitch}}</td>
                    <template v-if="file.file_status === 2">
                        <td
                            :class="['mount-' +file.full_mount_status, {highLight: file.full_mount_status===3&&!file.is_full_mount_node}]">
                            {{file.full_mount_status | allSingleSwitch}}
                        </td>
                    </template>
                    <template v-else>
                        <td></td>
                    </template>
                    <template v-if="file.file_status === 2">
                        <td :class="'mount-' +file.single_mount_status">
                            {{file.single_mount_status | allSingleSwitch}}
                        </td>
                    </template>
                    <template v-else>
                        <td></td>
                    </template>
                    <td>
                        <el-button v-waves.button type="primary"
                                   :disabled="(file.file_status !== 2) || (file.single_mount_status === 1 ||file.single_mount_status === 2 ||file.single_mount_status === 3)"
                                   size="small"
                                   v-if="userFlag"
                                   @click.native="openSingleDialog(index)">
                            单挂
                        </el-button>
                    </td>
                    <td>
                        <el-button v-waves.button size="small"
                                   :disabled="file.file_status !== 2"
                                   @click.native="confirmFile(index)">验证
                        </el-button>
                    </td>
                    <td>
                        <template v-if="file.file_status === 2">
                            <el-button v-waves.button size="small"
                                       @click.native="toResult(index, file.cert_id)">
                                <a href="javascript:" class="color: color-default">出庭/出证</a>
                            </el-button>
                        </template>
                        <template v-else>
                            <el-button size="small" :disabled="true">出庭/出证</el-button>
                        </template>
                    </td>
                    <td>
                        <ul class="more-wrapper">
                            <li>
                                <!--<template v-if="file.file_status === 2">-->
                                <span class="more" @click="moreItemShow(file.cert_id)">更多</span>
                                <!--</template>-->
                                <!--<template v-else>-->
                                <!--<span class="more" style="color:#8492A6; cursor: text;">更多</span>-->
                                <!--</template>-->
                                <ul class="more-item" v-if="file.cert_id === currentCertId">
                                    <template v-if="file.file_status === 2">
                                        <li>
                                            <el-button v-waves.button type="text" size="small">
                                                <a :href="file.file_url"
                                                   @click="download(file.file_url, $event)"
                                                   download>
                                                    下载文件
                                                </a></el-button>
                                        </li>
                                    </template>
                                    <template v-else>
                                        <li>
                                            <el-button v-waves.button :disabled="true" type="text" size="small">
                                                下载文件
                                            </el-button>
                                        </li>
                                    </template>
                                    <li>
                                        <el-button v-waves.button
                                                   size="small"
                                                   type="text"
                                                   @click.native="getDetailFile(file.cert_id)">
                                            <router-link to="/info" class="color: color-default;">详细信息
                                            </router-link>
                                        </el-button>
                                    </li>
                                    <template v-if="file.file_status === 2">
                                        <li>
                                            <el-button v-waves.button size="small"
                                                       type="text"
                                                       class="modify-name"
                                                       @click.native="changeName(file.file_name, file.cert_id)">
                                                修改名称
                                            </el-button>
                                        </li>
                                    </template>
                                    <template v-else>
                                        <li>
                                            <el-button v-waves.button :disabled="true" size="small" type="text">
                                                修改名称
                                            </el-button>
                                        </li>
                                    </template>
                                </ul>
                            </li>
                        </ul>
                    </td>
                </tr>
            </template>
            <template v-else>
                <tr>
                    <td colspan="9">
                        <div class="empty-wrapper"></div>
                    </td>
                </tr>
            </template>
        </table>
        <!-- 修改名称弹窗 -->
        <el-dialog title="修改名称"
                   class="changeName-wrapper"
                   :visible.sync="isChangeName">
            <el-input type="text" v-model="renameData.name" :maxlength="50"></el-input>
            <div class="btn-wrapper">
                <el-button type="primary" size="small" @click.native="rename">确定</el-button>
                <el-button @click.native="isChangeName = false" size="small">取消</el-button>
            </div>
        </el-dialog>
        <!-- 全挂弹窗 -->
        <el-dialog title="全挂" :visible.sync="isAllVisible" size="small">
            <div class="dialog-wrapper">
                <div class="b"><span class="title">存证编号: </span><span>{{fullMountCertNo}}</span></div>
                <div class="all-tip">'全挂'将上述存证编号文件（含）以及其之前的数据指纹整体封装后固化到（写入）到区块链上一旦固化成功，该数据指纹在任何情况下均无法被篡改。</div>
                <div class="b"><span
                    class="title title2">挂链费用: </span><span>{{(mountPrice.cny + mountPrice.full_mount_service_fee).toFixed(2)}}</span>元
                </div>
                <el-row class="content-wrapper" :gutter="10">
                    <el-col :span="12">
                        <div class="grid-content">
                            <span
                                class="cost"><strong>{{mountPrice.cny}}</strong>元</span><span>（+{{mountPrice.full_mount_service_fee}}元服务费）</span>
                        </div>
                    </el-col>
                    <div class="vertical-line"></div>
                    <el-col :span="12">
                        <div class="grid-content-second">
                            <span class="vb">{{mountPrice.cny}}元</span>=<span>{{mountPrice.btc}}</span>BTC（比特币）
                        </div>
                    </el-col>
                </el-row>
                <div class="ps">注：挂链费用根据前一天全网挂链费用计算得出，若挂链失败（需14天才能确认失败）会退还给您（服务费不退）</div>
                <div class="footer">
                    <el-button type="warning" class="w120" @click.native="fullPay" :disabled="fullDisabled">支付
                    </el-button>
                    <el-button class="w120" @click="isAllVisible = false">取消</el-button>
                </div>
            </div>
        </el-dialog>
        <!-- 单挂弹窗 -->
        <el-dialog title="单挂"
                   :visible.sync="isSingleVisible"
                   @close="show = false"
                   size="small">
            <div class="dialog-wrapper">
                <div class="b"><span class="title">存证编号: </span>
                    <template v-if="isFileEmpty">
                        <span>{{fileManageData[singleIndex].cert_no}}</span>
                    </template>
                </div>
                <div class="all-tip">“单挂”将上述存证编号文件的数据指纹整体封装后固化（写入）到区块链上，一旦固化成功，该数据指纹在任何情况下均无法被篡改。</div>
                <div class="b">
                    <span class="title title2">挂链费用: </span>
                    <span>{{(mountPrice.cny + mountPrice.single_mount_service_fee).toFixed(2)}}</span>元
                </div>
                <el-row class="content-wrapper" :gutter="10">
                    <el-col :span="12">
                        <div class="grid-content">
                            <span
                                class="cost"><strong>{{mountPrice.cny}}</strong>元</span><span>（+{{mountPrice.single_mount_service_fee}}元服务费）</span>
                        </div>
                    </el-col>
                    <div class="vertical-line"></div>
                    <el-col :span="12">
                        <div class="grid-content-second">
                            <span class="vb">{{mountPrice.cny}}元</span>=<span>{{mountPrice.btc}}</span>BTC（比特币）
                        </div>
                    </el-col>
                </el-row>
                <div class="ps">注：挂链费用根据前一天全网挂链费用计算得出，若挂链失败（需14天才能确认失败）会退还给您（服务费不退）</div>
                <div class="footer">
                    <el-button type="warning" class="w120"
                               @click.native="singlePay"
                               :disabled="singleDisabled">支付
                    </el-button>
                    <el-button class="w120" @click="isSingleVisible = false">取消</el-button>
                </div>
            </div>
        </el-dialog>
        <!-- 源文档不上传，验证弹窗 -->
        <el-dialog class="doc-dialog"
                   title="文档验证"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   @close="closeDoc"
                   :visible.sync="isDocValidVisible">
            <!--<div class="title"></div>-->
            <div class="upload-wrapper">
                <el-upload class="upload"
                           ref="upload"
                           drag
                           action=""
                           :auto-upload="false"
                           :on-change="uploadChange">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <!--<div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>-->
                </el-upload>
            </div>
            <template v-if="show">
                <transition name="fade" mode="out-in">
                    <div class="upload-progress">
                        <div>文件名：{{this.fileName}}</div>
                        <div>数据指纹：{{this.fileSha256}}</div>
                    </div>
                </transition>
            </template>
            <div class="footer-btn">
                <el-button type="primary" @click.native="docConfirm">验证</el-button>
                <el-button @click="isDocValidVisible = false">取消</el-button>
            </div>
            <template v-if="isPass">
                <div class="valid-result tc" :class="'verifyResult-'+verifyNoFile.result">
                    {{verifyNoFile.result === 1 ? '验证通过' : '验证不通过'}}
                </div>
                <div class="content">
                    <div class="bk"><span class="b">存证数据指纹：</span>{{verifyNoFile.hashed}}</div>
                    <div class="bk"><span class="b">待验证数据指纹：</span>{{verifyNoFile.wait_for_hash}}</div>
                    <div class="bk"><span class="b">有效时间：</span>{{verifyNoFile.time}}</div>
                </div>
            </template>
        </el-dialog>

        <!-- 源文档上传 -->
        <el-dialog title="文档验证" :visible.sync="isDocVisible">
            <div class="doc-upload-wrapper">
                <div class="title" :class="'verifyResult-'+verifyWidthFile.result">
                    {{verifyWidthFile.result === 1 ? '验证通过' : '验证不通过'}}
                </div>
                <div><span>存证数据指纹：</span>{{verifyWidthFile.hashed}}</div>
                <div><span>待验证数据指纹：</span>{{verifyWidthFile.wait_for_hash}}</div>
                <div><span>存证时间：</span>{{verifyWidthFile.time}}</div>
                <div>
                    <el-button class="w120" type="primary" @click.native="isDocVisible = false">确定</el-button>
                </div>
            </div>
        </el-dialog>
        <!-- 分页 -->
        <template v-if="isFileEmpty">
            <div class="page-container">
                <el-pagination :current-page.sync="currentPage" :page-size="10"
                               layout="total, prev, pager, next" :total="total"
                               @current-change="handleCurrentChange()">
                </el-pagination>
            </div>
        </template>
        <!--  -->
        <img-dialog :visible.sync="isImgDialog" :src="src"></img-dialog>
        <!-- 帐户余额不足弹窗 -->
        <remain-lack :show.sync="isLack"></remain-lack>
        <!-- video -->
        <el-dialog class="video-dialog"
                   :title="videoTitle"
                   :visible.sync="isVideo"
                   :close-on-press-escape="false"
                   :close-on-click-modal="false"
                   @close="closeVideo">
            <!--<video-player class="vjs-custom-skin"-->
            <!--ref="videoPlayer"-->
            <!--:options="playerOptions"-->
            <!--:playsinline="true"-->
            <!--@ready="playerReadied">-->
            <!--</video-player>-->
            <video id="videoElement" class="centeredVideo" controls autoplay>
                Your browser is too old
                which doesn't support HTML5 video.
            </video>
        </el-dialog>
        <!-- audio-dialog -->
        <audio-dialog :show.sync="audioOptions.show" :src="audioOptions.src"></audio-dialog>
    </div>
</template>

<script>
    import PanelTitle from '../PanelTitle/PanelTitle';
    import Search from '../search/search';
    import CryptoJS from 'crypto-js';
    import * as Cert from '../../api/cert';
    import {mapActions, mapGetters} from 'vuex';
    import ImgDialog from './img-dialog';
    import {isValidImg, isValidVideo, isValidAudio} from '../../utils';
    import RemainLack from '../remain-lack/remain-lack';
    import AudioDialog from '../audio-dialog/audio-dialog';

    const ERR_OK = 0;

    export default {
        name: 'file',
        data() {
            return {
                show: false,
                singleDisabled: false, // 单挂支付按钮禁用
                fullDisabled: false, // 全挂支付按钮禁用
                rejectDialogShow: true, // 拒绝验证弹窗
                fileName: '', // 验证文件名
                verifyIndex: 0, // 验证索引
                fileSha256: '',
                currentPage: 1,
                isAllVisible: false, // 全挂弹窗的可见性
                isSingleVisible: false, // 单挂弹窗的可见性
                isSortListVisible: false, // 排序下拉列表的可见性
                isDocValidVisible: false, // 源文件不上传 文档验证dialog
                isChangeName: false, // 修改名称弹窗可见性
                singleIndex: 0,
                mountPrice: {}, // 当前挂链价格
                fullMountCertNo: '', // 全挂编号
                index: 0,
                isDocVisible: false, // 源文档上传弹窗可见性
                verifyWidthFile: {}, // 验证（源文档上传）
                verifyNoFile: {}, // 验证 (存证验证)
                currentCertId: -1,
                renameData: {
                    name: '',
                    cert_id: ''
                },
                isPass: false,
                isImgDialog: false,
                src: '',
                isToolTip: true,
                isLack: false,
                isVideo: false,
                videoTitle: '',
//                playerOptions: {
//                    muted: false,
//                    language: 'en',
//                    playbackRates: [0.7, 1.0, 1.5, 2.0],
//                    sources: [{
//                        type: 'video/mp4',
//                        src: '11'
//                    }]
//                    poster: '/static/images/author.jpg'
//                },
                audioOptions: {
                    show: false,
                    src: ''
                },
                flvPlayer: null, // flv播放控制
                videoType: '',
                timer: 0 // 轮询超时
            };
        },
        filters: {
            allSingleSwitch(i) {
                // 总共有七种状态， 映射为五种状态 0未申请 1已申请 2已挂链 3已确认 -1申请失败 -2挂链失败 -3 确认失败
                // -1申请失败 -2挂链失败 -3 确认失败 都归为 挂链失败
                // 未挂链 为 未挂链 单挂按钮可以点击
                // 已申请 为 已申请
                // 已挂链 为 挂链中
                // 已确认 为 已成功
                switch (i) {
                    case -1:
                        return '挂链失败'; // 挂链失败 单挂不可点击 申请失败
                    case -2:
                        return '挂链失败'; // 挂链失败 单挂不可点击 挂链失败
                    case -3:
                        return '挂链失败'; // 挂链失败 单挂不可点击 确认失败
                    case 0:
                        return '未挂链';  // 未挂链
                    case 1:
                        return '已申请'; // 已申请
                    case 2:
                        return '挂链中…'; // 挂链中 - 已挂链
                    case 3:
                        return '已成功'; // 已确认
                }
            },
            typeSwitch(i) {
                switch (i) {
                    case 2:
                        return '网页打印';
                    case 3:
                        return '网页截屏';
                    case 4:
                        return '自动截屏';
                    case 5:
                        return '拍照';
                    case 6:
                        return '手机截屏';
                    case 7:
                        return '录音';
                    case 8:
                        return '录像';
                    case 9:
                        return '电子合同';
                    case 10:
                        return '文档保全';
                    case 13:
                        return '电话录音';
                    case 15:
                        return '机器人录像';
                    case 16:
                        return '机器人截屏';
                }
            }
        },
        computed: {
            fileManageData() {
                return this.$store.state.cert.fileManageData;
            },
            total() {
                return +this.$store.state.cert.total;
            },
            isFileEmpty() {
                return this.$store.state.cert.isFileEmpty;
            },
            userFlag() {
                return localStorage.getItem('userFlag') === '1';
            },
            ...mapGetters([
                'beginCurrentPage'
            ])
        },
        created() {
            this.GetFileList({type: 0, page: this.beginCurrentPage, page_size: 10});
            this.currentPage = this.beginCurrentPage + 1;
//            this._fetchFileList();
            this._fetchMountPrice();
            this._fetchFullMountCertNo();
            if (this.beginCurrentPage === 0) {
                this._setTimeoutGetFileList();
            }
            this.setCurrentPage({currentPage: 0});
        },
        methods: {
            fileStatus(fileStatus) {
                switch (fileStatus) {
                    case 0:
                        return 'file-loading';
                    case 1:
                        return 'file-loading';
                    case 2:
                        return '';
                    case -1:
                        return 'file-fail';
                    case -2:
                        return 'file-fail';
                }
            },
            canCheck(val) {
                return isValidImg(val) || /\.pdf$/.test(val) || isValidVideo(val) || isValidAudio(val);
            },
            docConfirm() {
                if (this.fileName) {
                    Cert.verifyNoFile(this.fileManageData[this.verifyIndex].cert_id, this.fileSha256)
                        .then(res => {
                            if (res.data.error === ERR_OK) {
                                this.verifyNoFile = res.data.data;
                                this.isPass = true;
                            } else if (res.data.error === 30015) {
                                this.$message({
                                    message: '文件尚未处理完成',
                                    type: 'warning',
                                    showClose: true
                                });
                                this.fileName = '';
                            }
                        });
                } else {
                    this.$message({
                        message: '请先选择文档',
                        type: 'warning',
                        showClose: true
                    });
                }
            },
            // 有文件上传时，获取sha256
            uploadChange(file) {
                let reader = new FileReader();
                reader.readAsArrayBuffer(file.raw);
                const _this = this;
                reader.onload = function () {
                    let wordArray = CryptoJS.lib.WordArray.create(reader.result);
                    _this.fileSha256 = CryptoJS.SHA256(wordArray).toString();
                    _this.fileName = file.name;
                    _this.show = true;
                };
            },
            // 验证按钮
            confirmFile(index) {
                this.verifyIndex = index;
                if (this.fileManageData[index].file_url) {
                    Cert.verifyWidthFile(this.fileManageData[index].cert_id)
                        .then(res => {
                            if (res.data.error === ERR_OK) {
                                this.verifyWidthFile = res.data.data;
                                this.isDocVisible = true;
                            } else if (res.data.error === 30015) {
                                this.$message({
                                    message: '文件尚未处理完成',
                                    type: 'warning',
                                    showClose: true
                                });
                            }
                        });
                } else {
                    if (this.fileManageData[index].file_status === 2) {
                        this.isDocValidVisible = true;
                    } else {
//                        console.log(this.fileManageData[index].file_status);
                        this.$message({
                            message: '验证中',
                            type: 'warning',
                            showClose: true
                        });
                    }
                }
            },
            // 全挂支付
            fullPay() {
                Cert.postFullMount(2)
                    .then(res => {
                        if (res.data.error === ERR_OK) {
                            this.fullDisabled = true;
                            this.$message({
                                message: '支付成功',
                                type: 'success',
                                showClose: true
                            });
                            this._fetchFileList();
                            setTimeout(() => {
                                this.isAllVisible = false;
                            }, 400);
                        } else if (res.data.error === 30012) {
                            this.isLack = true;
                            setTimeout(() => {
                                this.isAllVisible = false;
                            }, 200);
                        }
                    });
            },
            // 单挂支付
            singlePay() {
                Cert.postSingleMount(1, this.fileManageData[this.singleIndex].cert_id)
                    .then(res => {
                        if (res.data.error === ERR_OK) {
                            this.singleDisabled = true;
                            this.$message({
                                message: '挂链申请成功',
                                type: 'success',
                                showClose: true
                            });
                            this._fetchFileList();
                            setTimeout(() => {
                                this.isSingleVisible = false;
                            }, 400);
                        } else if (res.data.error === 30012) {
                            this.isLack = true;
                            setTimeout(() => {
                                this.isSingleVisible = false;
                            }, 200);
                        }
                    });
            },
            toggleSortListVisible: function () {
                this.isSortListVisible = !this.isSortListVisible;
            },
            // 打开全挂弹窗
            openAllDialog() {
                Cert.getFileList(0, 0, 1)
                    .then(res => {
                        if (res.data.data.list[0].full_mount_status) {
                            this.$message({
                                message: '您已挂链，无需重复挂链',
                                type: 'warning',
                                showClose: true
                            });
                        } else {
                            this.isAllVisible = true;
                        }
                    });
            },
            // 打开单挂弹窗
            openSingleDialog(index) {
                this.singleIndex = index;
                this.isSingleVisible = true;
            },
            handleCurrentChange() {
                this.GetFileList({type: this.index, page: this.currentPage - 1, page_size: 10});
            },
            getDetailFile(cert_id) {
                this.SetCertId({cert_id});
                this.setCurrentPage({currentPage: this.currentPage - 1});
            },
            toResult(index, cert_id) {
                this.SetIndex({index});
                this.setCurrentPage({currentPage: this.currentPage - 1});
                this.$router.push({path: `/file/${cert_id}`});
            },
            mouseTip(fileName) {
                if (this.$refs[fileName][0].offsetWidth < this.$refs[fileName][0].scrollWidth) {
                    this.isToolTip = false;
                }
            },
            rename() {
                Cert.renameFile(this.renameData.cert_id, this.renameData.name)
                    .then(res => {
                        if (res.data.error === 0) {
                            this.$message({
                                message: '重命名成功！',
                                type: 'success',
                                showClose: true
                            });
                            this.GetFileList({type: this.index, page: this.currentPage - 1, page_size: 10});
                            setTimeout(() => {
                                this.isChangeName = false;
                            }, 500);
                        }
                    });
            },
            searchByType(index) {
                this.index = index;
                this.GetFileList({type: this.index, page: 0, page_size: 10});
            },
            download(file_url, event) {
                if (!file_url) {
                    event.preventDefault();
                    this.$message({
                        type: 'warning',
                        message: '无文件',
                        showClose: true
                    });
                }
            },
            changeName(name, cert_id) {
                this.renameData = {name, cert_id};
                this.isChangeName = true;
            },
            close() {
                this.singleDisabled = false;
                this.fullDisabled = false;
            },
            closeDoc() {
                this.$refs.upload.clearFiles();
                this.show = false;
                this.fileName = '';
                this.isPass = '';
            },
            moreItemShow(cert_id) {
                this.currentCertId = cert_id;
            },
            // 点击预览文件
            openFile(fileUrl, fileName, fileType, event) {
                if (!fileUrl) {
                    event.preventDefault();
                } else if (isValidImg(fileUrl)) {
                    event.preventDefault();
//                    this.isImgDialog = true;
//                    this.src = fileUrl;
                    let img = $('<img>').attr('src', fileUrl);
                    img.viewer({
                        navbar: false
                    });
                    img.trigger('click');
                } else if (/\.pdf$/.test(fileUrl) || fileType === 2 || fileType === 3) {
                } else if (isValidVideo(fileUrl)) {
                    event.preventDefault();
                    this.videoType = fileUrl.slice(-3); // 取得视频文件的后缀（mp4|flv）
                    this.isVideo = true;
                    this.$nextTick(function () {
                        if (flvjs.isSupported()) {
                            let videoElement = document.getElementById('videoElement');
                            this.flvPlayer = flvjs.createPlayer({
                                type: this.videoType,
                                url: fileUrl
                            });
                            this.flvPlayer.attachMediaElement(videoElement);
                            this.flvPlayer.load();
                            this.flvPlayer.play();
                        }
                    });
                    this.videoTitle = fileName;
                } else if (isValidAudio(fileUrl)) {
                    event.preventDefault();
                    this.audioOptions.show = true;
                    this.audioOptions.src = fileUrl;
                } else {
                    event.preventDefault();
                }
            },
            // 关闭video弹窗
            closeVideo() {
                this._flvDestory(this.flvPlayer);
            },
            _flvDestory(player) {
                player.pause();
                player.unload();
                player.detachMediaElement();
                player.destroy();
                player = null;
            },
            // 当前在第一页开始轮询请求，请求时间不超过12*3一分钟
            _setTimeoutGetFileList() {
                if (this.currentPage === 1 && this.timer < 12) {
                    this.GetFileList({type: 0, page: 0, page_size: 10}).then(() => {
                        let f = this.fileManageData.some((v) => {
                            return v.file_status !== 2 && v.file_status !== -1 && v.file_status !== -2;
                        });
//                        console.log(f);
                        if (f) {
                            setTimeout(this._setTimeoutGetFileList, 3000);
                            this.timer++;
                        }
                    });
                }
            },
            // fetch data
            _fetchFileList() {
                this.GetFileList({type: 0, page: 0, page_size: 10});
            },
            _fetchMountPrice() {
                Cert.getMountPrice()
                    .then(res => {
                        if (res.data.error === ERR_OK) {
                            this.mountPrice = res.data.data;
                        }
                    });
            },
            _fetchFullMountCertNo() {
                Cert.getFullMountCertNo()
                    .then(res => {
                        if (res.data.error === 0) {
                            this.fullMountCertNo = res.data.data.cert_no;
                        }
                    });
            },
            ...mapActions([
                'GetFileList',
                'SetCertId',
                'SetIndex',
                'setCurrentPage'
            ])
        },
        components: {
            PanelTitle,
            Search,
            ImgDialog,
            RemainLack,
            AudioDialog
        }
    };
</script>

<style lang="scss">
    @import '../../common/scss/mixin';

    .file-container {
        width: 100%;
        .el-dialog {
            width: 560px;
        }
        table {
            table-layout: fixed;
            position: relative;
            width: 100%;
            background: #fff;
            text-align: center;
            .highLight {
                opacity: .5;
            }
            .mount--1, .mount--2, .mount--3 {
                color: #ff4949;
            }
            .mount-0 {
                color: #C0CCDA;
            }
            .mount-1 {
                color: #f7ba2a;
            }
            .mount-2 {
                color: #1D8CE0;
            }
            .mount-3 {
                color: #13ce66;
            }
            .fileName-logo-2 {
                background: url("./fileName_logo_4.png") no-repeat;
            }
            .fileName-logo-3 {
                background: url("./fileName_logo_4.png") no-repeat;
            }
            .fileName-logo-4 {
                background: url("./fileName_logo_4.png") no-repeat;
            }
            .fileName-logo-5 {
                background: url("./fileName_logo_3.png") no-repeat;
            }
            .fileName-logo-6 {
                background: url("./fileName_logo_3.png") no-repeat;
            }
            .fileName-logo-7 {
                background: url("./fileName_logo_2.png") no-repeat;
            }
            .fileName-logo-8 {
                background: url("./fileName_logo_1.png") no-repeat;
            }
            .fileName-logo-9 {
                background: url("./fileName_logo_5.png") no-repeat;
            }
            .fileName-logo-10 {
                background: url("./fileName_logo_5.png") no-repeat;
            }
            .fileName-logo-13 {
                background: url("./fileName_logo_2.png") no-repeat;
            }
            .fileName-logo-14 {
                background: url("./fileName_logo_4.png") no-repeat;
            }
            .fileName-logo-15 {
                background: url("./fileName_logo_1.png") no-repeat;
            }
            .fileName-logo-16 {
                background: url("./fileName_logo_3.png") no-repeat;
            }
            .fileName-logo {
                background-position: 10px 50%;
            }
            .fileName {
                margin-left: 34px;
                padding-bottom: 5px;
                transition: all .5s ease;
                .nameColor {
                    color: #1D8CE0;
                }
                &:hover {
                    /*border-bottom: 1px solid #07636b;*/
                    a {
                        color: #07636b;;
                    }
                }
            }
            .file-loading {
                opacity: .6;
                cursor: text;
                &:hover {
                    border: none;
                }
            }
            .file-fail {
                color: #FF4949;
                cursor: text;
                &:hover {
                    border: none;
                }
            }
            td {
                padding: 0 2px;
                word-break: break-all;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                &:last-child {
                    overflow: visible;
                }
                .more-wrapper {
                    padding-right: 16px;
                    position: relative;
                    .more {
                        color: #427DFF;
                        cursor: pointer;
                        font-size: 12px;
                    }
                    .more-item {
                        position: absolute;
                        z-index: 999;
                        top: 38px;
                        right: -4px;
                        background: #fff;
                        line-height: 35px;
                        border-radius: 2px;
                        border: 1px solid #d1dbe5;
                        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
                        transition: all 1s ease;
                        .el-button, a {
                            color: #000;
                        }
                        .el-button--small {
                            padding: 0;
                        }
                        .modify-name {
                            padding: 10px 16px;
                        }
                        li {
                            a {
                                display: inline-block;
                                padding: 10px 17px;
                            }
                            &:hover {
                                background: #eee;
                                a, .el-button {
                                    color: #427DFF;
                                }
                            }
                        }
                        &::after {
                            content: '';
                            position: absolute;
                            top: 0;
                            left: 50%;
                            width: 0;
                            height: 0;
                            transform: translate(-50%, -100%);
                            border: 6px solid;
                            border-color: transparent transparent #d1dbe5 transparent;
                        }
                    }
                }
            }
            .title {
                font-weight: 700;
                color: #fff;
                background: #427dff;
                th {
                    padding: .8rem 0;
                    line-height: 27px;
                }
                .el-button {
                    float: left;
                    margin-left: 26px;
                }
                .sort-title {
                    position: relative;
                    cursor: pointer;
                    min-width: 75px;
                    &::after {
                        position: absolute;
                        top: 50%;
                        content: '';
                        width: 0;
                        height: 0;
                        border-width: 4px;
                        border-style: solid;
                        border-color: #fff transparent transparent transparent;
                        margin-left: 2px;
                    }
                    .sort {
                        position: absolute;
                        left: 0;
                        z-index: 2;
                        background: #fff;
                        box-shadow: 0 0 4px #bbb;
                        margin-left: -5px;
                        li {
                            width:100px;
                            padding: 0 14px;
                            line-height: 2.8rem;
                            &:hover {
                                background: #eee;
                            }
                        }
                        li + li {
                            border-top: 1px solid #e7eef0;
                        }
                    }
                }
            }
            tr + tr {
                border-bottom: 1px solid #f0f2f4;
                line-height: 4rem;
            }
            tr:last-child {
                border: none;
            }
            .empty-wrapper {
                width: 100%;
                min-height: calc(100vh - 182px);
                background: #fff url("../../common/img/empty.png") no-repeat center center;
            }
        }
        .page-container {
            text-align: center;
            margin: 1.5rem 0;
        }
        .doc-dialog {
            .fade-enter-active {
                animation: fadeIn .2s;
            }
            .fade-leave-active {
                animation: fadeIn .2s reverse;
            }
            .el-icon-close {
                display: none;
            }
            .title {
                color: #427DFF;
                font-size: 16px;
                text-align: center;
                margin-bottom: 12px;
            }
            .upload-wrapper {
                text-align: center;
            }
            .footer-btn {
                text-align: center;
                button {
                    margin-top: 20px;
                    width: 120px;
                }
            }
            .valid-result {
                margin-top: 35px;
                margin-bottom: 10px;
                color: #13ce66;
            }
            .verifyResult-1 {
                color: #13CE66;
            }
            .verifyResult-0 {
                color: #FF4949;
            }
            .content {
                padding-top: 10px;
                line-height: 30px;
            }
            .upload-progress {
                position: absolute;
                top: 40px;
                left: 50%;
                transform: translate(-50%, 0);
                background: #fff;
                border: 1px dashed #d9d9d9;
                border-radius: 5px;
                width: 58%;
                height: 148px;
                margin: 20px auto;
                padding: 16px 35px;
                line-height: 28px;
                font-size: 14px;
                word-break: break-all;
            }
        }
        .dialog-wrapper {
            padding: 18px 10px;
            .title {
                position: relative;
                &::after {
                    @include dotted;
                    margin-left: -10px;
                }
            }
            .title2::after {
                @include dotted(#13ce66);
                margin-left: -10px;
            }
            .all-tip {
                padding-top: 10px;
                padding-bottom: 25px;
                font-size: 12px;
                line-height: 22px;
                color: #666;
            }
            .ps {
                padding-top: 20px;
                padding-bottom: 20px;
                color: #999;
                font-size: 12px;
            }
            .content-wrapper {
                position: relative;
                padding-top: 20px;
                .cost {
                    font-size: 35px;
                    color: #13ce66;
                }
                .grid-content-second {
                    padding-top: 20px;
                    font-weight: bold;
                }
                .vertical-line {
                    position: absolute;
                    left: 49%;
                    top: 30px;
                    height: 40px;
                    border-right: 1px solid #999;
                }
            }
            .footer {
                text-align: center;
                button {
                    margin-top: 20px;
                }
            }
        }
        .doc-upload-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            word-break: break-all;
            & > div {
                padding: 5px 0;
                line-height: 20px;
                & > span {
                    font-weight: bold;
                }
            }
            .title {
                font-weight: bold;
            }
            .verifyResult-1 {
                color: #13CE66;
            }
            .verifyResult-0 {
                color: #FF4949;
            }
        }
        .changeName-wrapper {
            .el-input__inner {
                border-top: none;
                border-left: none;
                border-right: none;
                border-radius: 0;
            }
            .el-dialog {
                width: 320px;
            }
            .btn-wrapper {
                padding-top: 20px;
                text-align: center;
                .el-button {
                    width: 100px;
                }
            }
        }
        .video-dialog {
            .el-dialog {
                width: 720px;
                .el-dialog__header {
                    background: #20A0FF;
                }
            }
            .centeredVideo {
                width: 100%;
                height: 356px;
            }
        }
    }
</style>
