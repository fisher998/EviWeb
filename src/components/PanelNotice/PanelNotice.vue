<template>
    <div class="notice-container">
        <panelTitle title="通知中心" :border-color="borderColor"></panelTitle>
        <table>
            <tr class="title">
                <th>通知时间</th>
                <th>通知内容</th>
                <th>通知状态</th>
            </tr>
            <template v-if="total">
                <tr v-for="(item, index) in noticeData" @click="showContent(index)">
                    <td>{{item.time}}</td>
                    <td>{{item.content}}</td>
                    <td :class="{'color-success': !item.is_read}">{{item.is_read | isRead}}</td>
                </tr>
            </template>
            <template v-else>
                <tr>
                    <td colspan="3">
                        <div class="empty-wrapper"></div>
                    </td>
                </tr>
            </template>
        </table>
        <!-- 分页 -->
        <template v-if="total">
            <div class="page-container">
                <el-pagination :current-page.sync="currentPage" :page-size="10"
                               layout="total, prev, pager, next" :total="total"
                               @current-change="handleCurrentChange()">
                </el-pagination>
            </div>
        </template>
        <el-dialog v-if="total" title="通知详情" :visible.sync="isVisible" @close="readed(noticeData[row])">
            <div class="dialog-wrapper">
                <div class="time">{{noticeData[row].time}}</div>
                <div class="content">{{noticeData[row].content}}</div>
                <div class="btn-wrapper tc">
                    <el-button type="primary" class="button"
                               @click.native="deleteNotice(noticeData[row],noticeData[row].notify_id)">
                        删除
                    </el-button>
                    <el-button type="primary" class="button" @click="isVisible = false">关闭</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import PanelTitle from '../PanelTitle/PanelTitle';
    import {getNoticeList, getRead, deleteNotice} from '../../api/notice';
    import {mapActions} from 'vuex';

    export default {
        data () {
            return {
                isVisible: false,
                borderColor: '#ff8e43',
                noticeData: [{time: '', content: '', is_read: 0, notify_id: ''}],
                row: 0,
                total: 0,
                currentPage: 1
            };
        },
        created () {
            this.fetchNoticeList();
        },
        filters: {
            isRead (val) {
                if (val === 1) {
                    return '已读';
                }
                if (val === 0) {
                    return '未读';
                }
            }
        },
        methods: {
            handleCurrentChange () {
                getNoticeList(this.currentPage - 1, 10)
                    .then(res => {
                        if (res.data.error === 0) {
                            this.noticeData = res.data.data.list;
                        }
                    });
            },
            fetchNoticeList () {
                getNoticeList(0, 10)
                    .then(res => {
                        if (res.data.error === 0) {
                            this.total = +res.data.data.total;
                            this.noticeData = res.data.data.list;
                        }
                    });
            },
            showContent (index) {
                this.row = index;
                this.isVisible = true;
            },
            // 标记为已读
            readed (n) {
                if (!n.is_read) {
                    getRead(1, n.notify_id)
                        .then(res => {
                            if (res.data.error === 0) {
                                n.is_read = 1;
                                this.GetNoticeCount();
                            }
                        });
                }
            },
            deleteNotice (n, notify_id) {
                if (!n.is_read) {
                    getRead(1, n.notify_id)
                        .then(res => {
                            if (res.data.error === 0) {
                                n.is_read = 1;
                                this.GetNoticeCount();
                                deleteNotice(notify_id)
                                    .then(res => {
                                        if (res.data.error === 0) {
                                            this.isVisible = false;
                                            this.fetchNoticeList();
                                            this.GetNoticeCount();
                                        }
                                    });
                            }
                        });
                } else {
                    deleteNotice(notify_id)
                        .then(res => {
                            if (res.data.error === 0) {
                                this.isVisible = false;
                                this.fetchNoticeList();
                                this.GetNoticeCount();
                            }
                        });
                }
            },
            ...mapActions([
                'GetNoticeCount'
            ])
        },
        components: {
            PanelTitle
        }
    };
</script>

<style lang="scss">
    @import '../../common/scss/mixin';

    .notice-container {
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
                cursor: pointer;
                th {
                    padding: .8rem 0;
                }
            }
            tr {
                cursor: pointer;
                td {
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }
                th:first-child {
                    width: 250px;
                }
                th:last-child {
                    width: 150px;
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
            margin-top: 1.5rem;
            margin-bottom: 1.5rem;
        }

        .dialog-wrapper {
            display: flex;
            flex-direction: column;
            .time {
                position: relative;
                margin: 6px 0 6px 12px;
                font-size: 13px;
                font-weight: bold;
                &::after {
                    @include dotted();
                    margin-left: -10px;
                }
            }
            .content {
                border: 1px solid #eee;
                padding: 10px 10px;
                margin: 10px 0;
                font-size: 12px;
                min-height: 155px;
                cursor: pointer;
            }
            .button {
                align-self: center;
                width: 120px;
                margin-top: 10px;
            }
        }

        .el-dialog {
            width: 480px;
        }
    }

</style>
