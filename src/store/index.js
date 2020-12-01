import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
import {setToken, destroyToken} from "../utils/auth_token";
import {login, getInfo, logout} from "../api";
import {constantRoutes, asyncRoutes} from '../router/routes';

const SIDEBAR_COLLAPSE_KEY = 'SIDEBAR_COLLAPSE_KEY';

Vue.use(Vuex);

function hasPermission(permissions, route) {
    if (route.meta && route.meta.permissions) {
        return permissions.some(permission => route.meta.permissions.filter(p => p !== '').includes(permission))
    } else {
        return true
    }
}

export function filterAsyncRoutes(routes, roles) {
    const res = [];
    routes.forEach(route => {
        const tmp = {...route}
        if (hasPermission(roles, tmp)) {
            if (tmp.children) {
                tmp.children = filterAsyncRoutes(tmp.children, roles)
            }
            res.push(tmp)
        }
    })
    return res
}

const state = {
    userInfo: {},
    routes: [],
    permissions: [],
    sidebarCollapsed: window.localStorage.getItem(SIDEBAR_COLLAPSE_KEY) == "true",
};

const mutations = {
    SET_USER_INFO: (state, userInfo) => {
        state.userInfo = userInfo;
    },
    SET_ROUTES: (state, routes) => {
        state.routes = constantRoutes.concat(routes);
    },
    SET_PERMISSIONS: (state, permissions) => {
        state.permissions = permissions;
    },
    TOGGLE_SIDEBAR_COLLAPSED: (state) => {
        state.sidebarCollapsed = !state.sidebarCollapsed;
        window.localStorage.setItem(SIDEBAR_COLLAPSE_KEY, state.sidebarCollapsed);
    }
};

const actions = {
    async login({commit}, data) {
        let token = await login(data);
        setToken(token);
        return token;
    },
    async getInfo({commit}) {
        let userInfo = await getInfo();
        const permissions = userInfo.permissions || [];
        if (!permissions.length) {
            return Promise.reject('没有权限');
        }
        commit('SET_USER_INFO', userInfo);
        commit('SET_PERMISSIONS', permissions);
        return userInfo;
    },
    async generateRoutes({commit}, permissions) {
        let accessedRoutes = filterAsyncRoutes(asyncRoutes, permissions);
        commit('SET_ROUTES', accessedRoutes);
        return accessedRoutes;
    },
    toggleSidebar({commit}) {
        commit('TOGGLE_SIDEBAR_COLLAPSED');
    },
    async logout({commit}) {
        await logout();
        commit("SET_PERMISSIONS", []);
        destroyToken();
    },
    clearAuth({commit}) {
        commit("SET_PERMISSIONS", []);
        destroyToken();
    },
};

export default new Vuex.Store({
    getters,
    state,
    mutations,
    actions,
});