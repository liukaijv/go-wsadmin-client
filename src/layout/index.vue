<template>
    <div class="app-container">
        <sidebar></sidebar>
        <div :class="{'main-container':true,sidebarCollapsed:sidebarCollapsed}">
            <app-top></app-top>
            <div class="content-container">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import sidebar from './sidebar';
    import AppTop from './app_top';

    export default {
        components: {
            sidebar,
            AppTop,
        },
        computed: {
            ...mapGetters([
                'sidebarCollapsed',
            ])
        },
        data() {
        }
    }
</script>

<style lang="scss" scoped>
    .app-container {
        height: 100%;
    }

    .main-container {
        height: 100%;
        margin-left: 200px;
        transition: margin-left .3s;

        &.sidebarCollapsed {
            margin-left: 64px;
        }

    }

    .content-container {
        min-height: calc(100vh - 50px);
    }
</style>