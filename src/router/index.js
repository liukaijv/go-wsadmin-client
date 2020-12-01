import Vue from 'vue';
import Router from 'vue-router';
import store from '../store';
import {constantRoutes} from "./routes";
import {hasToken, destroyToken} from '../utils/auth_token';
import {Message} from 'element-ui';

// fix "Navigating to current location (XXX) is not allowed"
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
};

Vue.use(Router);

const router = new Router({
    scrollBehavior: () => ({y: 0}),
    routes: constantRoutes,
});

const whiteList = ['/login'];

router.beforeEach(async (to, from, next) => {
    if (hasToken()) {
        if (to.path === '/login') {
            next({path: '/'});
        } else {
            const hasPermission = store.getters.permissions && store.getters.permissions.length > 0;
            if (hasPermission) {
                next();
            } else {
                try {
                    const {permissions} = await store.dispatch('getInfo');
                    const accessRoutes = await store.dispatch('generateRoutes', permissions);
                    router.addRoutes(accessRoutes);
                    next({...to, replace: true})
                } catch (e) {
                    if (typeof e === 'string' && e === '没有权限') {
                        Message.error(e);
                    }
                    destroyToken();
                    next(`/login?redirect=${to.path}`);
                }
            }
        }
    } else {
        if (whiteList.includes(to.path)) {
            next();
        } else {
            next(`/login?redirect=${to.path}`)
        }
    }
});

export default router;