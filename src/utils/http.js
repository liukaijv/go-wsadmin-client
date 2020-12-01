import axios from 'axios';
import {Message, MessageBox} from 'element-ui';
import {hasToken, getToken, destroyToken} from "./auth_token";
import router from '../router'

export const baseURL = window.API_BASE_URL || process.env.VUE_APP_API_BASE_URL;

const http = axios.create({
    baseURL,
    timeout: 50000
});

export const HEADER_TOKEN_KEY = 'Authorization';

http.interceptors.request.use(
    config => {
        if (hasToken()) {
            config.headers[HEADER_TOKEN_KEY] = getToken();
        }
        return config;
    },
    error => {
        console.log(error);
        return Promise.reject(error)
    }
);

http.interceptors.response.use(
    response => {
        const res = response.data;
        if (res.code !== 200) {
            let msg = res.msg || 'error';
            switch (res.code) {
                case 400:
                    if (res.data) {
                        msg = JSON.stringify(res.data);
                    }
                    break;
                case 401:
                    destroyToken();
                    MessageBox.alert('请重新登录').then(() => {
                        router.go("/login");
                        window.location.reload();
                    });
                    break;
            }
            Message.error(msg);
            return Promise.reject(res);
        }
        return res.data;
    },
    error => {
        console.log(error);
        Message.error(error.message);
        return Promise.reject(error)
    }
);

export default http;