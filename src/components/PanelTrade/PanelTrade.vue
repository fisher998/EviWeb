<template>
    <div class="trade-container">
        <div class="clearfix">
            <panelTitle :title="title" border-left-color="#1D8CE0" class="fl"></panelTitle>
            <!--<z-search class="fr"></z-search>-->
        </div>
        <div class="date-wrapper">
            <el-date-picker v-model="dateRange"
                            type="daterange"
                            size="small"
                            @change="change"
                            placeholder="选择日期范围"
                            align="left"></el-date-picker>
            <el-button type="primary" size="small" style="vertical-align: 1px;" @click.native="searchByDate">搜索
            </el-button>
            <span class="title">快速查询：</span>
            <div class="tab-wrapper">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="全部" name="first"></el-tab-pane>
                    <el-tab-pane label="七天" name="second"></el-tab-pane>
                    <el-tab-pane label="一个月" name="third"></el-tab-pane>
                    <el-tab-pane label="三个月" name="fourth"></el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <table>
            <tr class="title">
                <th>交易时间</th>
                <th>存证编号</th>
                <th>操作</th>
                <th>备注</th>
                <th>流水</th>
                <th>余额</th>
                <th></th>
            </tr>
            <template v-if="total">
                <tr v-for="(item, index) in tableData">
                    <td>{{item.time}}</td>
                    <td>{{item.cert_no || '无'}}</td>
                    <td>{{item.op_code | opCodeFilter}}</td>
                    <td>{{item.append}}</td>
                    <td :class="{fee: item.type === 1}">{{item.type === 0 ? '-' : '+'}}{{item.fee / 100}}
                    </td>
                    <td>{{item.remain / 100}}</td>
                    <td>
                        <template v-if="item.refund_status === 0">
                            <el-button size="small"
                                       v-show="item.type===0"
                                       type="primary"
                                       @click.native="open(item.log_id)">申请退款
                            </el-button>
                        </template>
                        <template v-else-if="item.refund_status === 1">
                            <el-button size="small"
                                       v-show="item.type===0"
                                       type="warning">已申请
                            </el-button>
                        </template>
                        <template v-else-if="item.refund_status === 2">
                            <el-button size="small"
                                       v-show="item.type===0"
                                       type="success">已退款
                            </el-button>
                        </template>
                        <template v-else-if="item.refund_status === 3">
                            <el-button size="small"
                                       v-show="item.type===0"
                                       type="danger">已拒绝
                            </el-button>
                        </template>
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
        <!-- 申请退款弹窗 -->
        <el-dialog class="applyDialog"
                   title="申请退款"
                   :visible.sync="applyDialogVisible"
                   @close="close"
                   size="tiny">
            <div class="title">退款理由</div>
            <el-input v-model="applyContent" type="textarea" placeholder="最多输入100个字" :maxlength="100"
                      :rows="5"></el-input>
            <div class="footer">
                <el-button type="primary" style="width: 120px;" @click="applySubmit">提交</el-button>
                <el-button style="width: 120px" @click="applyDialogVisible = false">取消</el-button>
            </div>
        </el-dialog>
        <!-- 分页 -->
        <template v-if="total">
            <div class="page-container">
                <el-pagination :current-page.sync="currentPage" :page-size="10"
                               layout="total, prev, pager, next" :total="total"
                               @current-change="handleCurrentChange()">
                </el-pagination>
            </div>
        </template>
    </div>
</template>

<script>
    import panelTitle from '../PanelTitle/PanelTitle';
    import zSearch from '../search/search';
    import {getTradeList, applyRefund} from '../../api/user';
    import {getDate} from '../../utils/index';

    export default {
        data() {
            return {
                applyContent: '', // 申请退款理由
                applyDialogVisible: false, // 申请退款弹窗的可见性
                currentPage: 1,
                pushIndexArr: [], // 操作为充值 行的编号
                activeName: 'first',
                title: '交易流水',
                dateRange: '', // 日期范围
                tableData: [],
                total: 0,
                currentItem: 0,
                maxDate: '',
                minDate: ''
            };
        },
        computed: {
            nowDate() {
                return Math.round(new Date().getTime() / 1000);
            }
        },
        filters: {
            opCodeFilter(val) {
                switch (val) {
                    case 11:
                        return '购买空间';
                    case 12:
                        return '空间续费';
                    case 13:
                        return '空间扩展';
                    case 21:
                        return '微信充值';
                    case 22:
                        return '支付宝充值';
                    case 23:
                        return '文档保全';
                    case 24:
                        return '手机拍照';
                    case 25:
                        return '手机截屏';
                    case 31:
                        return '出证';
                    case 32:
                        return '出庭';
                    case 41:
                        return '网页打印';
                    case 42:
                        return '网页截屏';
                    case 43:
                        return '文档保全失败退款';
                    case 51:
                        return '单挂';
                    case 52:
                        return '全挂';
                    case 53:
                        return '单挂退费';
                    case 54:
                        return '全挂退费';
                    case 61:
                        return '赠送余额到期';
                    case 71:
                        return '普通录音';
                    case 72:
                        return '电话录音';
                    case 73:
                        return '视频录制';
                    case 74:
                        return '机器人录像';
                    case 75:
                        return '机器人截屏';
                    case 80:
                        return '文档保全失败退款';
                }
            }
        },
        created() {
            this._getTradeList(0, this.nowDate, 0, 10);
        },
        methods: {
            handleClick(tab) {
                this.currentPage = 1;
                if (tab.name === 'first') {
                    getTradeList(0, this.nowDate, 0, 10)
                        .then(res => {
                            console.log(res);
                            res = res.data;
                            if (res.error === 0) {
                                this.total = +res.data.sum;
                                this.tableData = res.data.list || [];
                            }
                        });
                } else if (tab.name === 'second') {
                    getTradeList(getDate(-7), this.nowDate, 0, 10)
                        .then(res => {
                            res = res.data;
                            if (res.error === 0) {
                                this.total = +res.data.sum;
                                this.tableData = res.data.list || [];
                            }
                        });
                } else if (tab.name === 'third') {
                    getTradeList(getDate(-30), this.nowDate, 0, 10)
                        .then(res => {
                            res = res.data;
                            if (res.error === 0) {
                                this.total = +res.data.sum;
                                this.tableData = res.data.list || [];
                            }
                        });
                } else if (tab.name === 'fourth') {
                    getTradeList(getDate(-90), this.nowDate, 0, 10)
                        .then(res => {
                            res = res.data;
                            if (res.error === 0) {
                                this.total = +res.data.sum;
                                this.tableData = res.data.list || [];
                            }
                        });
                }
            },
            applySubmit() {
                if (this.applyContent === '') {
                    this.$message({
                        message: '内容不能为空',
                        type: 'warning',
                        showClose: true,
                        duration: 2000
                    });
                    return false;
                } else {
                    applyRefund(this.currentItem, this.applyContent)
                        .then(res => {
                            if (res.data.error === 0) {
                                this.$message({
                                    message: '申请成功，请耐心等待一会！',
                                    type: 'success',
                                    showClose: true
                                });
                                this.handleCurrentChange();
                                setTimeout(() => {
                                    this.applyDialogVisible = false;
                                }, 800);
                            } else {
                                this.$message({
                                    message: '申请失败，请稍后重试！',
                                    type: 'success',
                                    showClose: true
                                });
                                setTimeout(() => {
                                    this.applyDialogVisible = false;
                                }, 800);
//                                getTradeList(0, this.nowDate, this.currentPage - 1, 10)
//                                    .then(res => {
//                                        res = res.data;
//                                        if (res.error === 0) {
//                                            this.tableData = res.data.list;
//                                        }
//                                    });
                            }
                        });
                }
            },
            handleCurrentChange() {
                getTradeList(0, this.nowDate, this.currentPage - 1, 10)
                    .then(res => {
                        res = res.data;
                        if (res.error === 0) {
                            this.tableData = res.data.list || [];
                        }
                    });
            },
            searchByDate() {
                const start_time = this._getTime(this.minDate);
                const end_time = this._getTime(this.maxDate);

                getTradeList(start_time, end_time, 0, 10)
                    .then(res => {
                        res = res.data;
                        if (res.error === 0) {
                            this.total = +res.data.sum;
                            this.tableData = res.data.list || [];
                        }
                    });
            },
            open(log_id) {
                this.applyDialogVisible = true;
                this.currentItem = log_id;
            },
            close() {
                this.applyContent = '';
            },
            _getTradeList(time_start, time_end, page, page_size) {
                getTradeList(time_start, time_end, page, page_size)
                    .then(res => {
                        res = res.data;
                        if (res.error === 0) {
                            this.total = +res.data.sum;
                            this.tableData = res.data.list || [];
                        }
                    });
            },
            change(val) {
                this.minDate = val.split(' ')[0];
                this.maxDate = val.split('- ')[1];
            },
            // 将(2017 - 10 - 12)格式的日期转换为秒数
            _getTime(time) {
                return Math.round(new Date(time.replace(/-/g, ',')).getTime() / 1000);
            }
        },
        components: {
            panelTitle,
            zSearch
        }
    };
</script>

<style lang="scss">
    .trade-container {
        .search-container {
            float: right;
        }
        .date-wrapper {
            margin-bottom: 20px;
            .title {
                font-size: 16px;
                font-weight: bold;
                margin-left: 38px;
            }
            .tab-wrapper {
                display: inline-block;
                vertical-align: -28px;
                margin-left: 35px;
                width: 280px;
            }
        }
        .page-container {
            text-align: center;
            margin-top: 1.5rem;
            margin-bottom: 1.5rem;
        }
        table {
            position: relative;
            width: 100%;
            background: #fff;
            text-align: center;
            td {
                padding: 0 2px;
                word-break: break-all;
                &.fee {
                    color: #13CE66;
                }
                .el-button {
                    width: 68px;
                }
            }
            .title {
                font-weight: 700;
                color: #fff;
                background: #427dff;
                th {
                    padding: .8rem 0;
                }
            }
            tr + tr {
                border-bottom: 1px solid #f0f2f4;
                line-height: 4rem;
            }
            tr:last-child {
                border: none;
            }
            td.hightLight {
                color: #00b43c;
            }
            .empty-wrapper {
                width: 100%;
                min-height: calc(100vh - 248px);
                background: #fff url("../../common/img/empty.png") no-repeat center center;
            }
        }
        .applyDialog {
            .title {
                position: relative;
                font-weight: bold;
                margin-bottom: 10px;
                margin-left: 15px;
                &::after {
                    position: absolute;
                    left: -10px;
                    top: calc(50% - 2px);
                    content: '';
                    width: 6px;
                    height: 6px;
                    border-radius: 50px;
                    background: #427DFF;
                }
            }
            .footer {
                text-align: center;
                margin-top: 12px;
            }
        }
        .el-dialog {
            width: 400px;
        }
    }
</style>
