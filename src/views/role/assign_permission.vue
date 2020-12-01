<template>
    <div class="page-container">

        <div>
            <el-button type="success" @click="$router.go(-1)">返回</el-button>
        </div>

        <div class="permission-wrapper">
            <div class="permission-item">
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选
                </el-checkbox>
            </div>

            <div class="permission-item">
                <el-checkbox-group v-model="checkedPermissions" @change="handleCheckedChange">
                    <el-checkbox v-for="item in allPermissions" :label="item.id" :key="item.id">{{item.name}}
                    </el-checkbox>
                </el-checkbox-group>
            </div>

        </div>

        <el-button type="primary" @click="doAssignPermission">修改</el-button>

    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import http from '@/utils/http';

    export default {
        data() {
            return {
                id: 0,
                loading: false,
                listLoading: false,
                allPermissions: [],
                checkedPermissions: [],
                isIndeterminate: true,
                checkAll: false,
            }
        },
        computed: {
            ...mapGetters([
                'userInfo',
            ])
        },
        created() {
            this.id = this.$route.params.id || 0;
            this.listLoading = true;
            Promise.all([this.getData(), this.getPermissions()]).finally(() => {
                this.listLoading = false;
            })
        },
        methods: {
            getData() {
                return http.get(`/roles/${this.id}`, this.listQuery).then(data => {
                    let permissions = data.permissions || [];
                    this.checkedPermissions = permissions.map(p => p.id);
                }).catch((e) => {
                    console.log(e)
                });
            },
            getPermissions() {
                this.listLoading = true;
                return http.get(`/permissions/all`, this.listQuery).then(data => {
                    this.allPermissions = data || [];
                }).catch((e) => {
                    console.log(e)
                });
            },
            handleCheckAllChange(val) {
                this.checkedPermissions = val ? this.allPermissions.map(p => p.id) : [];
                this.isIndeterminate = false;
            },
            handleCheckedChange(value) {
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.allPermissions.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.allPermissions.length;
            },
            doAssignPermission() {
                this.loading = true;
                http.post(`/roles/${this.id}/permissions?permissionIds=${this.checkedPermissions}`).then(data => {
                    this.$message.success('操作成功');
                    if (this.userInfo.roleId && (this.id == this.userInfo.roleId)) {
                        this.$store.dispatch('clearAuth').then(() => {
                            this.$alert("权限变动，需要重新登录").then(() => {
                                this.$router.replace('/login');
                                location.reload();
                            });
                        })
                    }
                }).catch((e) => {
                    console.log(e)
                }).finally(() => {
                    this.loading = false;
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .permission-wrapper {
        margin: 10px 0 20px;
        min-height: 300px;
        .permission-item {
            width: 50%;
        }
        .el-checkbox {
            margin-top: 20px;
        }
    }
</style>