import {formatDate} from '../utils';

const getters = {
    // user.js
    avatar: state => state.user.avatar,
    token: state => state.user.auth_token,
    area_code: state => state.user.area_code,
    user_id: state => state.user.user_id,
    status: state => state.user.status,
    cell_phone: state => state.user.cell_phone,
    cash_available: state => (state.user.cash_available / 100).toFixed(2),
    gift_available: state => (state.user.gift_available / 100).toFixed(2),
    available: state => (state.user.cash_available / 100 + state.user.gift_available / 100).toFixed(2),
    gift_expire_at: state => state.user.gift_expire_at,
    // total_size: state => +(state.user.total_size / 1024 / 1024).toFixed(),
    total_size: state => {
        const total_size = +state.user.total_size;
        if (total_size < 1024) {
            return 0;
        } else if (total_size / 1024 < 1024) {
            return (total_size / 1024).toFixed(0) + 'M';
        } else if ((total_size / 1024 / 1024) < 1024) {
            return (total_size / 1024 / 1024).toFixed(0) + 'G';
        }
    },
    used_size: state => {
        const used_size = +state.user.used_size;
        if (used_size < 1024) {
            return used_size.toFixed() + 'K';
        } else if (used_size / 1024 < 1024) {
            return (used_size / 1024).toFixed(1) + 'M';
        } else if ((used_size / 1024 / 1024) < 1024) {
            return (used_size / 1024 / 1024).toFixed(2) + 'G';
        }
    },
    size_percent: state => {
        return state.user.total_size === 0 ? 0 : +(state.user.used_size / state.user.total_size).toFixed(4) * 100;
    },
    notice_count: state => state.user.notice_count,
    // size_percent: state => 0.000136544969346788,
    expire_at: state => formatDate(state.user.expire_at),
    is_identify: state => state.user.is_identify,
    op_key: state => state.user.op_key,
    // cert.js
    fileManageData: state => state.cert.fileManageData,
    beginCurrentPage: state => state.cert.currentPage
};
export default getters;
