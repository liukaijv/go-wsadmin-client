<template>
    <el-menu-item :index="resolvePath(route.path)">
        <i :class="route.meta.icon" v-if="route.meta && route.meta.icon"></i>
        <span v-if="route.meta">{{route.meta.title}}</span>
        <span v-else>{{route.name}}</span>
    </el-menu-item>
</template>

<script>
    import path from 'path'

    export default {
        name: 'sidebar-item',
        props: {
            route: {
                type: Object,
                required: true
            },
            basePath: {
                type: String,
                default: ''
            }
        },
        methods: {
            resolvePath(routePath) {
                return path.resolve(this.basePath, routePath)
            }
        }
    }
</script>