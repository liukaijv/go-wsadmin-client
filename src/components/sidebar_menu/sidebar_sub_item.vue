<template>
    <el-submenu :index="resolvePath(route.path)" popper-append-to-body>
        <template slot="title">
            <i :class="route.meta.icon" v-if="route.meta && route.meta.icon"></i>
            <span v-if="route.meta">{{route.meta.title}}</span>
            <span v-else>{{route.name}}</span>
        </template>
        <sidebar-item v-for="child in route.children" :key="child.path" :index="resolvePath(route.path)" :route="child"
                      :base-path="resolvePath(route.path)"/>
    </el-submenu>
</template>

<script>
    import path from 'path'

    export default {
        name: 'sidebar-sub-item',
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