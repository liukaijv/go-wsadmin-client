<template>
    <el-card shadow="never">
        <div slot="header">
            文件上传
        </div>
        <div>
            <div>单文件</div>
            <div class="mt10">
                <div tabindex="0" class="el-upload el-upload--text">
                    <div class="el-upload-dragger flex-box flex-middle flex-center">
                        <div>
                            <img v-if="uploadUrl" :src="uploadUrl" width="60"
                                 @click="handlePictureCardPreview(uploadUrl)"/>
                            <i class="el-icon-upload" v-else></i>
                            <div class="el-upload__text" @click="uploadOne"><em>点击我上传</em></div>
                        </div>
                    </div>
                    <input type="file" name="file" class="el-upload__input" ref="fileInput"
                           @change="fileInputChange($event)">
                </div>
            </div>
            <div class="mt20">多文件</div>
            <div class="mt10">
                <div>
                    <ul class="el-upload-list el-upload-list--picture-card">
                        <li tabindex="0" class="el-upload-list__item is-ready" v-for="url in uploadUrls">
                            <div>
                                <img :src="url" alt="" class="el-upload-list__item-thumbnail"/>
                                <div class="el-upload-list__item-actions">
                                    <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(url)">
                                        <i class="el-icon-zoom-in"></i>
                                    </span>
                                    <span class="el-upload-list__item-delete">
                                        <i class="el-icon-download"></i>
                                    </span>
                                    <span class="el-upload-list__item-delete">
                                        <i class="el-icon-delete"></i>
                                    </span>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <div tabindex="0" class="el-upload el-upload--picture-card" @click="uploadMultiple">
                        <i class="el-icon-plus"></i>
                        <input type="file" name="file" multiple="multiple" class="el-upload__input" ref="filesInput"
                               @change="filesInputChange($event)"></div>
                </div>
                <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
            </div>

        </div>
    </el-card>
</template>

<script>

    import http from '@/utils/http';

    export default {
        data() {
            return {
                dialogImageUrl: '',
                dialogVisible: false,
                disabled: false,
                uploadUrl: '',
                uploadUrls: [],
            };
        },
        computed: {
            headers() {
                return {}
            }
        },
        methods: {
            uploadOne() {
                this.$refs['fileInput'].click();
            },
            fileInputChange(e) {
                let file = e.target.files[0];
                let formData = new FormData();
                formData.append('file', file);
                http.post('/upload', formData).then(res => {
                    this.uploadUrl = res.data;
                }).catch(e => {
                    console.log(e);
                })
            },
            uploadMultiple() {
                this.$refs['filesInput'].click();
            },
            filesInputChange(e) {
                let files = e.target.files;
                let formData = new FormData();
                Array.prototype.slice.call(files).forEach(file => {
                    formData.append('file', file);
                });
                http.post('/uploads', formData).then(res => {
                    this.uploadUrls = res.data;
                }).catch(e => {
                    console.log(e);
                })
            },
            handlePictureCardPreview(url) {
                this.dialogImageUrl = url;
                this.dialogVisible = true;
            }
        }
    }
</script>