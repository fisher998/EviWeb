import Mock from 'mockjs';

// 发送短信验证码-用户注册
export const sendRegisterCode = {
    'error': 0
};

// 新用户手机号注册
export const registerUser = {
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
