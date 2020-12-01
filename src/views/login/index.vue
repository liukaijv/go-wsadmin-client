<template>
    <div class="login-container">
        <div class="login-form">
            <div class="title">用户登录</div>
            <el-form ref="form" :model="form" :rules="rules">

                <el-form-item prop="username">
                    <el-input v-model="form.username" prefix-icon="el-icon-user-solid" placeholder="用户名"></el-input>
                </el-form-item>

                <el-form-item prop="password">
                    <el-input type="password" v-model="form.password" prefix-icon="el-icon-s-goods"
                              placeholder="密码"></el-input>
                </el-form-item>

                <el-button type="primary" style="width: 100%;" :loading="loading" :disabled="loading" @click="doLogin">
                    登录
                </el-button>

            </el-form>
        </div>
    </div>
</template>

<script>

    export default {
        data() {
            return {
                loading: false,
                form: {
                    username: '',
                    password: '',
                },
                rules: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                    ]
                }
            }
        },
        methods: {
            doLogin() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        this.$store.dispatch('login', this.form).then(() => {
                            this.$router.push('/');
                        }).finally(() => {
                            this.loading = false;
                        })
                    } else {
                        return false;
                    }
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .login-container {
        height: 100%;
        background: #0067a3;
        display: flex;
        align-items: center;
        justify-content: center;

        .title {
            text-align: center;
            font-size: 18px;
            margin-bottom: 20px;
        }

        .login-form {
            background: #fff;
            border-radius: 6px;
            padding: 30px;
            width: 340px;
        }

    }
</style>