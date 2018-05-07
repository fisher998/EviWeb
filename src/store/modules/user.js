import {loginByMobile, logout} from '../../api/login';
import {getToken, setToken, removeToken} from '../../utils/auth';
import {register} from '../../api/register';
import {getUserInfo} from '../../api/user';
import {certNoFile, certWithFile} from '../../api/cert';
import {getNoticeCount} from '../../api/notice';
import axios from 'axios';

const ERR_OK = 0;

const user = {
    state: {
        avatar: '', // 用户头像
        auth_token: getToken(),  // token
        area_code: '', // 手机区号 默认86
        user_id: '',
        status: '', // 0正常,-1欠费，-2冻结，-3三次登录失败
        cell_phone: '', // 用户电话 cell_phone
        cash_available: 0, // 用户余额
        gift_available: 0, // 赠送余额
        gift_expire_at: '',
        total_size: 0, // 总存储空间
        used_size: 0,  // 已用存储空间
        expire_at: '', // 到期时间
        is_identify: '',
        op_key: '', // 重置密码操作的授权,10位字符
        notice_count: 0 // 用户通知数量
    },

    mutations: {
        SET_AUTH_TOKEN: (state, auth_token) => {
            state.auth_token = auth_token;
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar;
        },
        SET_AREA_CODE: (state, area_code) => {
            state.area_code = area_code;
        },
        SET_USER_ID: (state, user_id) => {
            state.user_id = user_id;
        },
        SET_STATUS: (state, status) => {
            state.status = status;
        },
        SET_CELL_PHONE: (state, cell_phone) => {
            state.cell_phone = cell_phone;
        },
        SET_CASH_AVAILABLE: (state, cash_available) => {
            state.cash_available = cash_available;
        },
        SET_GIFT_AVAILABLE: (state, gift_available) => {
            state.gift_available = gift_available;
        },
        SET_GIFT_EXPIRE_AT: (state, gift_expire_at) => {
            state.gift_expire_at = gift_expire_at;
        },
        SET_TOTAL_SIZE: (state, total_size) => {
            state.total_size = total_size;
        },
        SET_USED_SIZE: (state, used_size) => {
            state.used_size = used_size;
        },
        SET_EXPIRE_AT: (state, expire_at) => {
            state.expire_at = expire_at;
        },
        SET_IS_IDENTIFY: (state, is_identify) => {
            state.is_identify = is_identify;
        },
        SET_OP_KEY: (state, op_key) => {
            state.op_key = op_key;
        },
        SET_NOTICE_COUNT: (state, notice_count) => {
            state.notice_count = notice_count;
        }
    },

    actions: {
        // 获取用户通知数量
        GetNoticeCount({commit}) {
            getNoticeCount()
                .then(res => {
                    if (res.data.error === ERR_OK) {
                        commit('SET_NOTICE_COUNT', res.data.data.unread);
                    }
                });
        },
        //
        setOpKey({commit}, {op_key}) {
            commit('SET_OP_KEY', op_key);
        },
        // 用户充值
        userPay({commit}, pay) {
            commit('SET_CASH_AVAILABLE', pay.cash_available);
            commit('SET_GIFT_AVAILABLE', pay.gift_available);
        },
        // 手机号登录
        LoginByMobile({commit}, userInfo) {
            return new Promise((resolve, reject) => {
                loginByMobile(userInfo.mobile, userInfo.password)
                    .then(res => {
                        if (res.data.error === ERR_OK) {
                            const data = res.data.data;
                            setToken(data.auth_token);
                            commit('SET_AUTH_TOKEN', data.auth_token);
                            commit('SET_AVATAR', data.avatar);
                            commit('SET_AREA_CODE', data.area_code);
                            commit('SET_USER_ID', data.user_id);
                            commit('SET_STATUS', data.status);
                            commit('SET_CELL_PHONE', data.cell_phone);
                            commit('SET_CASH_AVAILABLE', data.cash_available);
                            commit('SET_GIFT_AVAILABLE', data.gift_available);
                            commit('SET_GIFT_EXPIRE_AT', data.gift_expire_at);
                            commit('SET_TOTAL_SIZE', data.total_size);
                            commit('SET_USED_SIZE', data.used_size);
                            commit('SET_EXPIRE_AT', data.expire_at);
                            commit('SET_IS_IDENTIFY', data.is_identify);
                            // 管理员从后台进入还是用户自己登录的标志 1 用户登录（默认）2 管理员从后台进入
                            localStorage.setItem('userFlag', 1);
                            localStorage.setItem('user_id', data.user_id);
                            resolve(0);
                        } else if (res.data.error === 30009) {
                            resolve(30009);
                        } else if (res.data.error === 30010) {
                            resolve(30010);
                        } else if (res.data.error === 30011) {
                            resolve(30011);
                        } else {
                            resolve();
                        }
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },
        // 管理员进入用户界面
        adminToWeb({commit}, urlToken) {
            return new Promise((resolve) => {
                axios({
                    url: `https://api.51zbb.net/admin/v1/user/login/info/${urlToken}`,
                    method: 'get'
                }).then(res => {
                    if (res.data.error === ERR_OK) {
                        const data = res.data.data;
                        setToken(data.auth_token);
                        commit('SET_AUTH_TOKEN', data.auth_token);
                        commit('SET_AVATAR', data.avatar);
                        commit('SET_AREA_CODE', data.area_code);
                        commit('SET_USER_ID', data.user_id);
                        commit('SET_STATUS', data.status);
                        commit('SET_CELL_PHONE', data.cell_phone);
                        commit('SET_CASH_AVAILABLE', data.cash_available);
                        commit('SET_GIFT_AVAILABLE', data.gift_available);
                        commit('SET_GIFT_EXPIRE_AT', data.gift_expire_at);
                        commit('SET_TOTAL_SIZE', data.total_size);
                        commit('SET_USED_SIZE', data.used_size);
                        commit('SET_EXPIRE_AT', data.expire_at);
                        commit('SET_IS_IDENTIFY', data.is_identify);
                        localStorage.setItem('userFlag', 2);
                        localStorage.setItem('user_id', data.user_id);
                        resolve(0);
                    }
                });
            });
        },
        // 用户注册
        Register({commit}, userInfo) {
            return new Promise((resolve, reject) => {
                register(userInfo.mobile, userInfo.password, userInfo.verify_code)
                    .then(res => {
                        if (res.data.error === ERR_OK) {
                            const data = res.data.data;
                            setToken(data['auth_token']);
                            commit('SET_AUTH_TOKEN', data.auth_token);
                            commit('SET_AVATAR', data.avatar);
                            commit('SET_AREA_CODE', data.area_code);
                            commit('SET_USER_ID', data.user_id);
                            commit('SET_STATUS', data.status);
                            commit('SET_CELL_PHONE', data.cell_phone);
                            commit('SET_CASH_AVAILABLE', data.cash_available);
                            commit('SET_GIFT_AVAILABLE', data.gift_available);
                            commit('SET_GIFT_EXPIRE_AT', data.gift_expire_at);
                            commit('SET_TOTAL_SIZE', data.total_size);
                            commit('SET_USED_SIZE', data.used_size);
                            commit('SET_EXPIRE_AT', data.expire_at);
                            commit('SET_IS_IDENTIFY', data.is_identify);
                            localStorage.setItem('user_id', data.user_id);
                            resolve(0);
                        } else if (res.data.error === 30007) {
                            resolve(30007); // 手机验证码验证失败
                        } else if (res.data.error === 30005) {
                            resolve(30005); // 手机号已经被注册
                        }
                    })
                    .catch(err => {
                        reject(err);
                    });
            });
        },
        // 退出登录
        LogOut({commit}) {
            return new Promise((resolve, reject) => {
                logout()
                    .then((res) => {
                        if (res.data.error === ERR_OK) {
                            commit('SET_AUTH_TOKEN', ''); //  将token置为空
                            removeToken(); // 移除cookie中的token
                            resolve();
                        }
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },
        // 获取用户信息（再一次刷新页面时）
        GetUserInfo({commit}) {
            getUserInfo()
                .then(res => {
                    if (res.data.error === ERR_OK) {
                        const data = res.data.data;
                        commit('SET_AVATAR', data.avatar);
                        commit('SET_AREA_CODE', data.area_code);
                        commit('SET_STATUS', data.status);
                        commit('SET_CELL_PHONE', data.cell_phone);
                        commit('SET_CASH_AVAILABLE', data.cash_available);
                        commit('SET_GIFT_AVAILABLE', data.gift_available);
                        commit('SET_GIFT_EXPIRE_AT', data.gift_expire_at);
                        commit('SET_TOTAL_SIZE', data.total_size);
                        commit('SET_USED_SIZE', data.used_size);
                        commit('SET_EXPIRE_AT', data.expire_at);
                        commit('SET_IS_IDENTIFY', data.is_identify);
                    }
                });
        },

        // 无文件存证
        CertNoFile({commit}, noFile) {
            return new Promise((resolve, reject) => {
                certNoFile(noFile.hash, noFile.file_name)
                    .then(res => {
                        if (res.data.error === ERR_OK) {
                            const data = res.data.data;
                            commit('SET_CASH_AVAILABLE', data.cash_available);
                            commit('SET_GIFT_AVAILABLE', data.gift_available);
                            resolve(0);
                        } else if (res.data.error === 30018) {
                            resolve(30018);
                        }
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },
        // 有文件存证
        CertWithFile({commit}, withFile) {
            return new Promise((resolve, reject) => {
                certWithFile(withFile.file_key, withFile.file_name)
                    .then(res => {
                        if (res.data.error === ERR_OK) {
                            const data = res.data.data;
                            commit('SET_CASH_AVAILABLE', data.cash_available);
                            commit('SET_GIFT_AVAILABLE', data.gift_available);
                            resolve(0);
                        } else if (res.data.error === 30018) {
                            resolve(30018);
                        }
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        }
    }
};

export default user;
