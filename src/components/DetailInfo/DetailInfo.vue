<template>
    <div class="detailInfo-container">
        <panelTitle title="存证详细信息" border-left-color="#437dff"
                    class="fl"></panelTitle>
        <el-button @click="goPrev" type="primary" size="small" class="back">
            返回上一页
        </el-button>
        <div class="info-wrapper">
            <div class="website b f16">{{detailFile.file.name}}</div>
            <el-row class="f14" :gutter="30">
                <el-col :span="8">
                    <div class="grid-content">
                        <div><span class="b dotted">存证类型：</span><span>{{detailFile.file.type_name}}</span></div>
                        <div><span class="b dotted">取证地点：</span><span>{{detailFile.file.position}}</span>
                        </div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content">
                        <div><span class="b dotted">存证编号：</span><span>{{detailFile.file.cert_no}}</span></div>
                        <div><span class="b dotted">取证IP：</span><span>{{detailFile.file.ip}}</span>
                        </div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content">
                        <div><span
                            class="b dotted">取证时间：</span><span>{{local_time_d || detailFile.file.time}}</span>
                        </div>
                        <div v-if="isUrlShow"><span class="b dotted">网页地址：</span><span>{{detailFile.file.append}}</span>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <div class="line"></div>
            <div>
                <div class="title">存证指纹</div>
                <div><span class="tiny-title dotted">源文档指纹数据：</span><span>{{detailFile.poe.hash}}</span></div>
                <div><span class="tiny-title dotted">时间点（北京时间）：</span><span>{{detailFile.poe.time}}</span></div>
                <div><span class="tiny-title dotted">存证数据指纹：</span><span>{{detailFile.poe.poe_hash}}</span></div>
            </div>
            <div class="line"></div>
            <el-row :gutter="30">
                <div class="title" style="padding-left: 15px;">挂链信息</div>
                <el-col :span="12">
                    <div class="grid-content">
                        <div class="small-title">单挂</div>
                        <div><span
                            class="tiny-title dotted">系统单挂指纹：</span><span>{{detailFile.chain.single.file_hash}}</span>
                        </div>
                        <div><span class="tiny-title">链上数据指纹：</span><span>{{detailFile.chain.single.chain_hash}}</span>
                        </div>
                        <div><span
                            class="tiny-title dotted">系统存证编号：</span><span>{{detailFile.chain.single.system_cert_no}}</span>
                        </div>
                        <div><span
                            class="tiny-title">链上存证编号：</span><span>{{detailFile.chain.single.chain_cert_no}}</span>
                        </div>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="grid-content">
                        <div class="small-title">全挂</div>
                        <div><span
                            class="tiny-title dotted">系统数据指纹：</span><span>{{detailFile.chain.full.file_hash}}</span>
                        </div>
                        <div><span class="tiny-title">链上数据指纹：</span><span>{{detailFile.chain.full.chain_hash}}</span>
                        </div>
                        <div><span class="tiny-title dotted">系统存证编号：</span><span>{{detailFile.chain.full.system_cert_no}}</span>
                        </div>
                        <div><span class="tiny-title">链上存证编号：</span><span>{{detailFile.chain.full.chain_cert_no}}</span>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <div class="line"></div>
            <el-row :gutter="30">
                <div class="title" style="padding-left: 15px;">链上位置<span class="tip">可根据”交易代号“到 <a
                    href="https://blockchain.info/" target="_blank"
                    class="color-primary">blockchain.info</a> 查询挂链信息</span></div>
                <el-col :span="12">
                    <div class="grid-content">
                        <div class="small-title">单挂</div>
                        <div><span
                            class="tiny-title dotted">区块链代号：</span><span>{{detailFile.block.single.block_id}}</span>
                        </div>
                        <div><span
                            class="tiny-title dotted">区块序号：</span><span>{{detailFile.block.single.block_height}}</span>
                        </div>
                        <div><span
                            class="tiny-title dotted">区块时间（北京时间）：</span><span>{{detailFile.block.single.block_time}}</span>
                        </div>
                        <div><span
                            class="tiny-title dotted">交易代号：</span><span>{{detailFile.block.single.trade_no}}</span>
                        </div>
                        <div><span
                            class="tiny-title dotted">交易附言位置：</span><span>{{detailFile.block.single.position}}</span>
                        </div>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="grid-content">
                        <div class="small-title">全挂</div>
                        <div><span
                            class="tiny-title dotted">区块链代号：</span><span>{{detailFile.block.full.block_id}}</span>
                        </div>
                        <div><span
                            class="tiny-title dotted">区块序号：</span><span>{{detailFile.block.full.block_height}}</span>
                        </div>
                        <div><span
                            class="tiny-title dotted">区块时间（北京时间）：</span><span>{{detailFile.block.full.block_time}}</span>
                        </div>
                        <div><span class="tiny-title dotted">交易代号：</span><span>{{detailFile.block.full.trade_no}}</span>
                        </div>
                        <div><span
                            class="tiny-title dotted">交易附言位置：</span><span>{{detailFile.block.full.position}}</span>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    import panelTitle from '../PanelTitle/PanelTitle';
    import {getDetailFile} from '../../api/cert';
    import {formatDate} from '@/utils';

    export default {
        data() {
            return {
                detailFile: {
                    file: {
                        url: '',
                        name: '',
                        type: 0,
                        type_name: '',
                        cert_no: '',
                        time: '',
                        lat: '',
                        lng: '',
                        position: '',
                        status: '',
                        certify_times: '',
                        append: '',
                        ip: '',
                        local_time: ''
                    },
                    poe: {},
                    chain: {
                        single: {
                            file_hash: ''
                        },
                        full: {
                            file_hash: ''
                        }
                    },
                    block: {
                        single: {
                            block_id: ''
                        },
                        full: {
                            block_id: ''
                        }
                    }
                },
                isUrlShow: false
            };
        },
        computed: {
            cert_id() {
                return this.$store.state.cert.cert_id;
            },
            local_time_d () {
                return this.detailFile.file.local_time && formatDate(this.detailFile.file.local_time);
            }
        },
        created() {
            if (this.cert_id === 0) {
                this.$router.push('/');
            } else {
                getDetailFile(this.cert_id)
                    .then(res => {
                        this.detailFile = Object.assign({}, this.detailFile, res.data.data);
                        if (this.detailFile.file.type === 2 || this.detailFile.file.type === 3) {
                            this.isUrlShow = true;
                        }
                    });
            }
        },
        methods: {
            // 返回上一页
            goPrev() {
                this.$router.go(-1);
            }
        },
        components: {
            panelTitle
        }
    };
</script>

<style lang="scss" scoped>
    @import '../../common/scss/mixin';

    .detailInfo-container {
        .back {
            margin: 14px 0 0 20px;
            a {
                color: #fff;
            }
        }
        .info-wrapper {
            box-sizing: border-box;
            width: 100%;
            padding: 20px 32px;
            margin-top: 10px;
            margin-bottom: 20px;
            background: #fff;
            font-size: 12px;
            line-height: 23px;
            word-break: break-all;
            .website {
                padding: 6px 0 12px;
            }
            .title, .small-title, .tiny-title {
                font-weight: bold;
            }
            .title {
                font-size: 16px;
                padding-bottom: 10px;
                & > .tip {
                    padding-left: 19px;
                    font-size: 12px;
                    color: #aaa;
                }
            }
            .small-title {
                font-size: 14px;
            }
            .tiny-title {
                font-size: 12px;
            }
            .line {
                border-bottom: 1px solid #ddd;
                margin: 20px 0;
            }
            .dotted {
                position: relative;
                &::after {
                    @include dotted;
                    margin-left: -12px;
                }
            }
        }
    }
</style>
