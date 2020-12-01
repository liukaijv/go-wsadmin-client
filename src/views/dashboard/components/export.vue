<template>
    <el-card shadow="never">
        <div slot="header">
            文件下载
            <div class="fr">
                <el-button type="primary" size="mini" @click="exportCsv">导出csv</el-button>
            </div>
        </div>
        <div>
            <el-table
                    :data="list"
                    style="width: 100%">
                <el-table-column
                        prop="id"
                        label="ID"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="名称"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="identity"
                        label="标识">
                </el-table-column>
            </el-table>
        </div>
    </el-card>
</template>

<script>
    import {downLoadFromUrl} from '@/utils';
    import http from '@/utils/http';

    export default {
        data() {
            return {
                listLoading: false,
                downloadLoading: false,
                list: [],
            };
        },
        created() {
            this.getList();
        },
        methods: {
            getList() {
                this.listLoading = true;
                http.get('/permissions').then(data => {
                    this.list = data.list;
                }).catch((e) => {
                    console.log(e)
                }).finally(() => {
                    this.listLoading = false;
                })
            },
            exportCsv() {
                this.downloadLoading = true;
                downLoadFromUrl(`/permissions/export`).then(() => {
                    this.downloadLoading = false;
                });
            }
        }
    }
</script>