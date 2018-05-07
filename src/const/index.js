import {getToken} from '../utils/auth';
const api = {
    baseURL: 'http://118.190.79.11:81/web/',
    auth_tokens: '7G0Oro2vx8wjGfks',
    auth_tokenss: function () {
        return localStorage.getItem('auth_token');
    },
    auth_token1: localStorage.getItem('auth_token'),
    auth_token: getToken(),
    url: '/api/'
};
export {
    api
};
