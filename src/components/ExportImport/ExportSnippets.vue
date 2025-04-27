<template>
    <div class="ecm-export-import">
        <h3>Please select which snippets you would like to export:</h3>
        <el-checkbox
            v-model="checkAll"
            :indeterminate="isIndeterminate"
            @change="handleCheckAllChange"
        >
            Check all
        </el-checkbox>
        <el-checkbox-group
            class="ecm_listed_checkboxes"
            v-model="selectedSnippets"
            @change="handleCheckedChange"
        >
            <el-checkbox v-for="snippet in snippets" :key="snippet.file_name" :label="snippet.name"
                         :value="snippet.file_name">
                {{ snippet.name }}
                <span v-if="snippet.type" class="fsn_label" :class="'fsn_'+snippet.type.toLowerCase()">
                    {{ getLangLabelName(snippet.type) }}
                </span>
                <el-tag v-if="!snippet.error" style="margin-left: 10px;" size="small"
                        :type="(snippet.status == 'published') ? 'success' : 'warning'">
                    {{ snippet.status }}
                </el-tag>
            </el-checkbox>
        </el-checkbox-group>
        <el-button @click="exportSelectedSnippet()" style="margin-top: 20px;" v-loading="exporting"
                   :disabled="!selectedSnippets.length" type="primary">Export Select Snippets
        </el-button>
    </div>
</template>

<script type="text/javascript">
export default {
    name: 'ExportSnippets',
    props: ['snippets'],
    computed: {
        isIndeterminate() {
            return this.selectedSnippets.length && this.selectedSnippets.length > 0 && this.selectedSnippets.length < this.snippets.length;
        }
    },
    data() {
        return {
            selectedSnippets: [],
            export_type: '',
            checkAll: false,
            exporting: false
        }
    },
    methods: {
        handleCheckAllChange(value) {
            if (value) {
                this.selectedSnippets = this.snippets.map(snippet => snippet.file_name);
            } else {
                this.selectedSnippets = [];
            }
        },
        handleCheckedChange() {
            this.checkAll = this.selectedSnippets.length === this.snippets.length;
        },
        exportSelectedSnippet() {
            this.exportSnippets(this.selectedSnippets);
        }
    }
}
</script>
