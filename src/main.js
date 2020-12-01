import Vue from 'vue';
import ElementUI from 'element-ui';
import App from './App.vue';
import store from './store';
import router from './router';

import 'element-ui/lib/theme-chalk/index.css';
import './styles/style.scss';

import permission from './directives/permission.js'
import SidebarMenu from './components/sidebar_menu/index';

Vue.use(ElementUI);

Vue.directive('permission', permission);

Vue.use(SidebarMenu);

Vue.config.productionTip = false;

new Vue({
    store,
    router,
    render: h => h(App),
}).$mount('#app');
