import Mock from 'mockjs';

// 登录用户修改密码
export const modifyPwd = {
    'error': 0
};

// 初次购买存储空间
export const buyStorage = {
    'error': 0
};

// 用户消费明细列表(交易流水)
export const getTrade = {
    error: 0,
    'data|10': [
        {
            'log_id': 20, // 存证编号
            'time': Mock.Random.date('yyyy-MM-dd') + ' ' + Mock.Random.time('HH:mm:ss'), // 交易时间
            'op_code': 41, // 用户操作码
            'fee': 400, // 操作费用
            'remain': 129200, // 操作账户余额 分
            'append': '网页打印', // 操作备注
            'type': 0
        }
    ]
};

