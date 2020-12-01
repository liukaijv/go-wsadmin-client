<template>
    <el-dialog
            :title="isCreate?'新建权限':'编辑权限'"
            :visible.sync="dialogVisible"
            width="40%"
            @close="onClose"
    >
        <el-form ref="form" :model="form" :rules="rules" label-width="100px" style="width: 350px;">
            <el-form-item label="权限名" prop="name">
                <el-input v-model="form.name" placeholder="权限名" maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="权限标识" prop="identity">
                <el-input v-model="form.identity" placeholder="权限标识" maxlength="20"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import http from '@/utils/http';

    const defaultForm = {
        name: '',
        identity: '',
    };

    export default {
        props: {
            isCreate: {
                type: Boolean,
                default: true,
            }
        },
        data() {
            return {
                loading: false,
                dialogVisible: false,
                form: Object.assign({}, defaultForm),
                rules: {
                    name: [
                        {required: true, message: '请输入名称', trigger: 'blur'},
                    ],
                    identity: [
                        {required: true, message: '请输入权限标识', trigger: 'blur'},
                    ],
                }
            }
        },
        methods: {
            onClose() {
                this.form = Object.assign({}, defaultForm);
            },
            submitForm() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        if (this.isCreate) {
                            this.doCreate();
                        } else {
                            this.doEdit();
                        }
                    } else {
                        return false;
                    }
                });
            },
            doCreate() {
                this.loading = true;
                http.post(`/permissions`, this.form).then(data => {
                    this.$message.success('操作成功');
                    this.dialogVisible = false;
                    this.$parent.getList();
                }).catch(e => {
                    console.log(e);
                }).finally(() => {
                    this.loading = false;
                })
            },
            doEdit() {
                this.loading = true;
                http.put(`/permissions/${this.form.id}`, this.form).then(data => {
                    this.$message.success('操作成功');
                    this.dialogVisible = false;
                    this.$parent.getList();
                }).catch(e => {
                    console.log(e);
                }).finally(() => {
                    this.loading = false;
                })
            }
        }
    }
</script>
