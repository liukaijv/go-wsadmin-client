import http from '../utils/http';

export function login(data) {
    return http.post('/login', data);
}

export function getInfo() {
    return http.get('/getAuthInfo');
}

export function logout() {
    return http.post('/logout');
}