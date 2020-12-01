<template>
    <div class="page-container">

        <dialog-form ref="dialogForm" :is-create="isCreate"/>

        <div>
            <el-button type="primary" :loading="listLoading" :disabled="listLoading" @click="listFilter"
                       v-permission="['ROLE_LIST']">搜索
            </el-button>
            <el-button type="success" @click="handleCreate" v-permission="['ROLE_CREATE']">新建</el-button>
        </div>

        <div class="mt20">
            <el-table
                    :data="list"
                    stripe
                    style="width: 100%">
                <el-table-column
                        prop="name"
                        label="名称">
                </el-table-column>
                <el-table-column
                        prop="description"
                        label="描述">
                </el-table-column>
                <el-table-column
                        label="操作"
                        align="center"
                >
                    <template slot-scope="scope">

                        <el-button type="primary" size="mini" @click="handleAssignPermission(scope.row)"
                                   v-permission="['PERMISSION_ASSIGN']">分配权限
                        </el-button>
                        <el-button type="primary" size="mini" @click="handleEdit(scope.row)"
                                   v-permission="['ROLE_UPDATE']">编辑
                        </el-button>
                        <el-button type="danger" size="mini" @click="doDelete(scope.row)"
                                   v-permission="['ROLE_DELETE']">
                            删除
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

    import http from '@/utils/http';
    import DialogForm from './form';

    export default {
        components: {
            DialogForm
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
                isCreate: true,
            }
        },
        created() {
            this.getList();
        },
        methods: {
            getList() {
                this.listLoading = true;
                http.get('/roles', {params: this.listQuery}).then(data => {
                    this.list = data.list;
                    this.total = data.total;
                }).catch((e) => {
                    console.log(e)
                }).finally(() => {
                    this.listLoading = false;
                })
            },
            listFilter() {
                this.listQuery.page = 1;
                this.getList();
            },
            handleCreate() {
                let dialogForm = this.$refs['dialogForm'];
                if (dialogForm) {
                    this.isCreate = true;
                    dialogForm.dialogVisible = true;
                }
            },
            handleEdit(row) {
                let dialogForm = this.$refs['dialogForm'];
                if (dialogForm) {
                    this.isCreate = false;
                    dialogForm.dialogVisible = true;
                    dialogForm.form = Object.assign(dialogForm.form, row || {});
                }
            },
            doDelete(row) {
                this.$confirm('确定要执行此操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.loading = true;
                    http.delete(`/roles/${row.id}`).then(() => {
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
            handleAssignPermission(row) {
                this.$router.push(`/role/assign_permission/${row.id}`);
            }
        }
    }
</script>