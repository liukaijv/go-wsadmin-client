import {getToken} from './auth_token';

export function buildParams(params = {}) {
    return Object.keys(params).reduce((prev, current, index) => {
        prev = prev + (index === 0 ? '' : '&') + current + '=' + encodeURIComponent(params[current]);
        return prev;
    }, '')
}

export function downLoadFromUrl(path, params = {}, fileName = '') {
    return new Promise((resolve) => {
        let baseURL = window.API_BASE_URL || process.env.VUE_APP_API_BASE_URL;
        let token = getToken();
        params = Object.assign(params, {Authorization: token});
        let aEle = document.createElement('a');
        aEle.download = fileName;
        // aEle.target = "_blank";
        aEle.href = `${baseURL}${path}?${buildParams(params)}`;
        aEle.click();
        setTimeout(() => {
            aEle = null;
            resolve();
        }, 200)
    })
}