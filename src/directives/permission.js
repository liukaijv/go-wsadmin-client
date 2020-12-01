import store from '@/store'

export default {
    inserted(el, binding, vnode) {
        const {value} = binding;
        const permissions = store.getters && store.getters.permissions;

        if (value && value instanceof Array && value.length > 0) {
            const bindPermissions = value;

            const hasPermission = permissions.some(permission => {
                return bindPermissions.includes(permission)
            });

            if (!hasPermission) {
                el.parentNode && el.parentNode.removeChild(el)
            }
        } else {
            throw new Error(` v-permission="['CREATE']"`)
        }
    }
}