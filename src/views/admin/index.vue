<template>
    <div class="page-container">

        <dialog-form ref="dialogForm" :all-roles="allRoles"/>

        <div>
            <el-button type="primary" :loading="listLoading" :disabled="listLoading" @click="listFilter"
                       v-permission="['ADMIN_LIST']">搜索
            </el-button>
            <el-button type="success" @click="handleCreate" v-permission="['ADMIN_CREATE']">新建</el-button>
        </div>

        <div class="mt20">
            <el-table
                    :data="list"
                    stripe
                    border
                    style="width: 100%">
                <el-table-column
                        prop="username"
                        label="用户名">
                </el-table-column>
                <el-table-column
                        label="角色">
                    <template slot-scope="scope">
                        <template v-if="scope.row.role">
                            {{scope.row.role.name}}
                        </template>
                        <template v-else>无</template>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="lastLoginAt"
                        label="最后登录时间">
                </el-table-column>
                <el-table-column
                        label="操作"
                        align="center"
                >
                    <template slot-scope="scope">
                        <el-popover
                                placement="left"
                                trigger="click"
                                @show="form.roleId=scope.row.roleId || ''"
                        >
                            <el-button slot="reference" type="primary" style="margin-right: 5px;" size="mini"
                                       v-permission="['ROLE_ASSIGN']">修改角色
                            </el-button>

                            修改角色
                            <div class="mt10">
                                <el-select v-model="form.roleId" placeholder="请选择">
                                    <el-option
                                            v-for="item in allRoles"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </div>
                            <div class="mt10 text-right">
                                <el-button type="primary" :loading="loading" :disabled="loading"
                                           @click="doEditRole(scope.row)">确定
                                </el-button>
                            </div>

                        </el-popover>
                        <el-button type="danger" size="mini" @click="doDelete(scope.row)"
                                   v-permission="['ADMIN_DELETE']">删除
                        </el-button>

                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div class="mt20">
            <el-pagination
                    :total="total"
                    :current-page.sync="listQuery.page"
                    @current-change="getList"
            >
            </el-pagination>
        </div>
    </div>
</template>

<script>

    import {mapGetters} from 'vuex';
    import http from '@/utils/http';
    import DialogForm from './form';

    export default {
        components: {
            DialogForm,
        },
        data() {
            return {
                total: 0,
                loading: false,
                listLoading: false,
                listQuery: {
                    page: 1,
                    pageSize: 10,
                },
                list: [],
                allRoles: [],
                form: {
                    roleId: '',
                }
            }
        },
        computed: {
            ...mapGetters([
                'userInfo',
            ])
        },
        created() {
            this.getList();
            this.getRoles();
        },
        methods: {
            getList() {
                this.listLoading = true;
                http.get('/admins', {params: this.listQuery}).then(data => {
                    this.list = data.list;
                    this.total = data.total;
                }).catch(e => {
                    console.log(e);
                }).finally(() => {
                    this.listLoading = false;
                })
            },
            listFilter() {
                this.listQuery.page = 1;
                this.getList();
            },
            doDelete(row) {
                this.$confirm('确定要执行此操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.loading = true;
                    http.delete(`/admins/${row.id}`).then(() => {
                        this.$message.success('操作成功');
                        this.getList();
                    }).catch(e => {
                        console.log(e);
                    }).finally(() => {
                        this.loading = false;
                    });
                }).catch(() => {
                });
            },
            getRoles() {
                http.get('/roles/all', this.listQuery).then(data => {
                    this.allRoles = data;
                }).catch(e => {
                    console.log(e);
                })
            },
            doEditRole(row) {
                if (!this.form.roleId) {
                    this.$message.error('请选择角色');
                    return;
                }
                this.loading = true;
                http.put(`/admins/${row.id}/role?roleId=${this.form.roleId}`).then(data => {
                    this.$message.success('操作成功');
                    if (this.userInfo.userId == row.id && (this.form.roleId !== this.userInfo.roleId)) {
                        this.$store.dispatch('clearAuth').then(() => {
                            this.$alert("权限变动，需要重新登录").then(() => {
                                this.$router.replace('/login');
                                location.reload();
                            });
                        })
                    } else {
                        this.getList();
                    }
                }).catch(e => {
                    console.log(e);
                }).finally(() => {
                    this.loading = false;
                })
            },
            handleCreate() {
                let dialogForm = this.$refs['dialogForm'];
                if (dialogForm) {
                    dialogForm.dialogVisible = true;
                }
            }
        }
    }
</script>