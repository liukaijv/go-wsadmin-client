const TOKEN_KEY = 'auth_token';

export function hasToken() {
    return !!window.localStorage.getItem(TOKEN_KEY);
}

export function getToken() {
    return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(value) {
    window.localStorage.setItem(TOKEN_KEY, value);
}

export function destroyToken() {
    window.localStorage.setItem(TOKEN_KEY, '');
}