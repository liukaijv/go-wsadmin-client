<template>
    <div class="app-top">
        <div>
            <div class="toggle-sidebar" @click="toggleSidebar">
                <i :class="iconClass"></i>
            </div>
        </div>
        <div>
            <div class="right-item user-info">
                <el-dropdown trigger="click" @command="handleCommand">
                    <div class="user-name">
                        {{userInfo.username}}
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </div>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="logout">退出</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex';
    import {destroyToken} from '@/utils/auth_token';

    export default {
        computed: {
            ...mapGetters([
                'sidebarCollapsed',
                'userInfo',
            ]),
            iconClass() {
                return this.sidebarCollapsed ? 'el-icon-s-fold' : 'el-icon-s-unfold';
            }
        },
        methods: {
            ...mapActions([
                'toggleSidebar',
                'logout'
            ]),
            handleCommand(command) {
                switch (command) {
                    case 'logout':
                        this.$confirm('确定要操行此操作吗?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.logout().then(() => {
                                this.$router.push('/login');
                                window.location.reload();
                            });
                        });
                        break;
                }
            },
            resetData() {
                this.$confirm('重置数据后需要重新登录', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    destroyToken();
                    this.$router.push('/login');
                    window.location.reload();
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .app-top {
        height: 50px;
        box-shadow: 0 1px 4px rgba(99, 99, 99, .1);
        display: flex;
        justify-content: space-between;
    }

    .toggle-sidebar {
        line-height: 50px;
        width: 50px;
        text-align: center;
        font-size: 20px;
        color: #909399;
    }

    .right-item {
        display: inline-block;
        margin-left: 15px;
    }

    .user-info {
        margin-right: 20px;
        cursor: pointer;
        .user-name {
            line-height: 50px;
            font-size: 16px;
        }
    }
</style>