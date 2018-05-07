import Mock from 'mockjs';

// 用户手机号登录
export const loginByMobile = {
    'error': 0,
    'data': {
        'auth-token': 'weSkDXyouI74KwAv', // 用户在服务器上线的唯一表示
        'user_id': 1,
        'status|1': [
            0,
            -1,
            -2,
            -3
        ], // 0正常,-1欠费，-2冻结，-3三次登录失败
        'area_code': 86, // 默认中国区号 +86
        'cell_phone': '123456', // 手机号
        'avatar': 'https://muimage.mumov.com/zbb.jpeg', // 头像
        'login_expire': 1456709287,
        'cash_available': 977, // 用户余额部分
        'gift_available': 1,  // 赠送
        'gift_expire_at': '2018-07-26 14:47:14',
        'total_size': 100,   // 总容量
        'used_size': 22,  // 已用容量
        'expire_at': Mock.Random.date('yyyy-MM-dd') + ' ' + Mock.Random.time('HH:mm'),  // 到期时间
        'is_identify': 0 // 0为实名 1 已实名
    }
};

export const getInfo = {
    'error': 0,
    'data': {
        'area_code': 86,
        'cell_phone': '123456', // 手机号
        'avatar': 'https://muimage.mumov.com/zbb.jpeg', // 头像
        'status': 0, // 用户状态
        'cash_available|1-1000': 100, // 用户余额部分
        'gift_available': 1,  // 赠送
        'gift_expire_at': '2018-07-26 14:47:14', // 有赠送余额时返回UNIX时间戳
        'total_size': 100,   // 总容量
        'used_size|1-100': 100,  // 已用容量
        'expire_at': Mock.Random.date('yyyy-MM-dd') + ' ' + Mock.Random.time('HH:mm'),  // 有空间时，过期时间返回UNIX时间戳
        'is_identify': 0 // 0为实名 1 已实名
    }
};

export const logout = {};
