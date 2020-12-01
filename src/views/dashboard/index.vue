<template>
    <div class="page-container">
        <el-row :gutter="20">
            <el-col :span="12">
                <Upload v-permission="['ALLOW_UPLOAD']"/>
            </el-col>
            <el-col :span="12">
                <Export v-permission="['PERMISSION_EXPORT']"/>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import Upload from './components/upload';
    import Export from './components/export';

    export default {
        components: {
            Upload,
            Export
        }
    }
</script>