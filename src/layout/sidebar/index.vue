<template>
    <div :class="{'sidebar-container':true,collapsed:sidebarCollapsed}">
        <el-menu
                :default-active="$route.path"
                :collapse="sidebarCollapsed"
                :router="true"
        >

            <sidebar-menu v-for="route in routes" :index="route.path" :route="route" :base-path="route.path"
                          :key="route.path">
            </sidebar-menu>

        </el-menu>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';

    export default {
        computed: {
            ...mapGetters([
                'sidebarCollapsed',
                'routes'
            ])
        },
        created() {
        },
        methods: {}
    }
</script>

<style lang="scss" scoped>
    .sidebar-container {
        position: fixed;
        width: 200px;
        height: 100vh;
        border-right: 1px solid #e6e6e6;
        transition: width .3s;

        ::v-deep .el-menu {
            border-right: none;
        }

        &.collapsed {
            width: 64px;
        }
    }
</style>