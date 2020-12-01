import SidebarMenu from './sidebar_menu';
import SidebarItem from './sidebar_item';
import SidebarSubItem from './sidebar_sub_item';

function plugin(Vue) {
    if (plugin.installed) {
        return;
    }
    Vue.component('sidebar-menu', SidebarMenu);
    Vue.component('sidebar-item', SidebarItem);
    Vue.component('sidebar-sub-item', SidebarSubItem);

}

export default plugin;