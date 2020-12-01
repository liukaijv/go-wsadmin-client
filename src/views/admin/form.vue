<template>
    <el-dialog
            title="新建管理员"
            :visible.sync="dialogVisible"
            width="40%"
            @close="onClose"
    >
        <el-form ref="form" :model="form" :rules="rules" label-width="100px" style="width: 350px;">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="form.username" placeholder="用户名" maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="form.password" placeholder="不填写将默认为123456" maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="角色" prop="roleId">
                <el-select v-model.number="form.roleId" placeholder="请选择角色">
                    <el-option label="请选择" value=""></el-option>
                    <el-option
                            v-for="item in allRoles"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="doCreate">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import http from '@/utils/http';

    const defaultForm = {
        username: '',
        password: '',
        roleId: '',
    };

    export default {
        props: {
            allRoles: {
                type: Array,
                default() {
                    return [];
                }
            }
        },
        data() {
            return {
                dialogVisible: false,
                form: Object.assign({}, defaultForm),
                rules: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                    ],
                }
            }
        },
        methods: {
            onClose() {
                this.form = Object.assign({}, defaultForm);
            },
            doCreate() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        http.post(`/admins`, this.form).then(data => {
                            this.$message.success('操作成功');
                            this.dialogVisible = false;
                            this.$parent.getList();
                        }).catch(e => {
                            console.log(e);
                        })
                    } else {
                        return false;
                    }
                });
            }
        }
    }
</script>
