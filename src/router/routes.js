import Layout from '../layout';

export const constantRoutes = [
    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [
            {
                path: 'dashboard',
                component: () => import('@/views/dashboard/index'),
                meta: {
                    title: '主页',
                    icon: 'el-icon-aim',
                }
            },
        ]
    },
    {
        path: '/login',
        component: () => import('@/views/login/index'),
        hidden: true,
    },
];

export const asyncRoutes = [
    {
        path: '/admin',
        component: Layout,
        redirect: '/admin/index',
        name: 'admin',
        mata: {
            permissions: ['ADMIN_LIST'],
        },
        children: [
            {
                path: 'index',
                component: () => import('@/views/admin/index'),
                meta: {
                    title: "用户管理",
                    icon: 'el-icon-user',
                    permissions: ['ADMIN_LIST'],
                },
            },
        ]
    },
    {
        path: '/role',
        component: Layout,
        redirect: '/role/index',
        name: 'role',
        meta: {
            permissions: ['ROLE_LIST'],
        },
        children: [
            {
                path: 'index',
                component: () => import('@/views/role/index'),
                meta: {
                    title: "角色管理",
                    icon: 'el-icon-help',
                    permissions: ['ROLE_LIST'],
                },
            },
            {
                path: 'assign_permission/:id',
                component: () => import('@/views/role/assign_permission'),
                meta: {
                    title: "权限分配",
                    permissions: ['PERMISSION_ASSIGN'],
                },
                hidden: true,
            },
        ]
    },
    {
        path: '/permission',
        component: Layout,
        redirect: '/permission/index',
        name: 'permission',
        meta: {
            permissions: ['PERMISSION_LIST'],
        },
        children: [
            {
                path: 'index',
                component: () => import('@/views/permission/index'),
                meta: {
                    title: "权限管理",
                    icon: 'el-icon-news',
                    permissions: ['PERMISSION_LIST'],
                },
            },
        ]
    },
];