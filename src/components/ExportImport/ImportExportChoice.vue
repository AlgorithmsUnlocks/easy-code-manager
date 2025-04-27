<template>
    <div class="ecm_import_export">
        <div v-if="!currentView">
            <el-row :gutter="30">
                <el-col :span="12">
                    <el-card style="width: 100%; cursor:pointer; text-align: center;" shadow="always" @click="currentView = 'export'">
                        <el-icon style="font-size: 30px;"><Download /></el-icon>
                        <h3>{{$t('Export Snippets')}}</h3>
                    </el-card>
                </el-col>
                <el-col :span="12">
                    <el-card style="width: 100%; cursor:pointer; text-align: center;" shadow="always" @click="currentView = 'import'">
                        <el-icon style="font-size: 30px;"><UploadFilled /></el-icon>
                        <h3>{{$t('Import Snippets')}}</h3>
                    </el-card>
                </el-col>
            </el-row>
        </div>
        <div v-else-if="currentView == 'import'">
            <ImportSnippets />
        </div>
        <div v-else-if="currentView == 'export'">
            <ExportSnippets :snippets="snippets"/>
        </div>
    </div>
</template>

<script type="text/babel">
import ImportSnippets from "./ImportSnippets.vue";
import ExportSnippets from "./ExportSnippets.vue";
import {Download, UploadFilled} from "@element-plus/icons-vue";

export default {
    name: 'ImportExportChoice',
    props: ['snippets'],
    components: {
        ImportSnippets,
        ExportSnippets,
        Download,
        UploadFilled
    },
    data() {
        return {
            currentView: ''
        }
    }
}
</script>
