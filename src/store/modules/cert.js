import {getFileList, getSearchFile} from '../../api/cert';

const ERR_OK = 0;

const cert = {
    state: {
        fileManageData: [{
            'cert_id': 0,
            'time': '',
            'file_type': 0,
            'file_name': '',
            'cert_no': '',
            'full_mount_status': 0,
            'single_mount_status': 0,
            'file_status': 0,
            'file_irl': ''
        }],
        isFileEmpty: false, // 文件列表是否为空的标志
        // fileManageData: [],
        cert_id: 0,
        total: 10,
        index: 0,
        currentPage: 0
    },
    mutations: {
        SET_FILEMANAGEDATA: (state, fileManageData) => {
            state.fileManageData = fileManageData;
        },
        SET_TOTAL: (state, total) => {
            state.total = total;
        },
        SET_CERT_ID: (state, cert_id) => {
            state.cert_id = cert_id;
        },
        SET_INDEX: (state, index) => {
            state.index = index;
        },
        SET_ISFILEEMYTY: (state, isFileEmyty) => {
            state.isFileEmpty = isFileEmyty;
        },
        SET_CURRENTPAGE: (state, currentPage) => {
            state.currentPage = currentPage;
        }
    },
    actions: {
        GetFileList: ({commit}, fileInfo) => {
            return new Promise(resolve => {
                getFileList(fileInfo.type, fileInfo.page, fileInfo.page_size)
                    .then(res => {
                        if (res.data.error === ERR_OK) {
                            if (!res.data.data.list.length) {
                                commit('SET_ISFILEEMYTY', false);
                            } else {
                                commit('SET_ISFILEEMYTY', true);
                            }
                            commit('SET_FILEMANAGEDATA', res.data.data.list);
                            commit('SET_TOTAL', res.data.data.sum);
                            resolve();
                        }
                    });
            });
        },
        SetCertId: ({commit}, {cert_id}) => {
            commit('SET_CERT_ID', cert_id);
        },
        SetIndex: ({commit}, {index}) => {
            commit('SET_INDEX', index);
        },
        // 搜索文件
        GetSearchFile: ({commit}, {searchText}) => {
            return new Promise((resolve, reject) => {
                getSearchFile(searchText)
                    .then(res => {
                        if (res.data.data) {
                            commit('SET_FILEMANAGEDATA', res.data.data);
                        }
                        resolve();
                    });
            });
        },
        setCurrentPage: ({commit}, {currentPage}) => {
            commit('SET_CURRENTPAGE', currentPage);
        }
    }
};

export default cert;
