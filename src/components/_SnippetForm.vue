<template>
    <el-form label-position="top" :model="snippet.meta">
        <el-row :gutter="20">
            <el-col :xs="24" :sm="15" :md="16" :lg="18">
                <slot name="code_editor_before"></slot>
                <slot name="code_editor">
                    <el-form-item :class="'fsnip_code_lang_'+snippet.meta.type" class="code_editor_wrap">
                        <template #label>
                            <span>{{$t('Code')}}</span>
                            <span class="fsn_label" :class="'fsn_'+snippet.meta.type">{{ getLangLabelName(snippet.meta.type) }}</span>
                        </template>
                        <code-editor
                            :langType="snippet.meta.type"
                            v-model="snippet.code"
                            :conditions="snippet.meta.condition"
                        />
                        <div v-if="errors.has('code')" class="code_error_block">
                            <p>{{ errors.get('code') }}</p>
                            <pre class="el-form-item__error_explained">{{ errors.get('code_explanation') }}</pre>
                        </div>
                    </el-form-item>
                </slot>

                <where-run :snippet="snippet" :is_new="is_new" />

                <advanced-conditions :snippet="snippet" />

            </el-col>
            <el-col :xs="24" :sm="9" :md="8" :lg="6">
                <el-form-item :label="$t('Snippet Name')">
                    <el-input :placeholder="$t('Your Snippet Name')" size="large" type="text" v-model="snippet.meta.name" />
                    <div class="el-form-item__error">{{ errors.get('name') }}</div>
                </el-form-item>
                <el-form-item :label="$t('Description')">
                    <el-input :placeholder="$t('Internal Description for this snippet')" :rows="3" type="textarea" v-model="snippet.meta.description" />
                </el-form-item>
                <el-form-item :label="$t('Snippet Group')">
                    <template #label>
                        <span>
                            {{$t('Snippet Group')}} <el-tooltip
                            class="box-item"
                            effect="dark"
                            :content="$t('You may group your snippets for better organization and easy to find.')"
                            placement="top-start"
                        >
                            <el-button text size="small" :icon="InfoField" style="font-style: italic"></el-button>
                          </el-tooltip>
                        </span>
                    </template>
                    <select-plus :pop_placeholder="$t('Create new group')" :placeholder="$t('Select Snippet Group')" :options="appVars.groups" v-model="snippet.meta.group" />
                </el-form-item>
                <el-form-item :label="$t('Priority')">
                    <template #label>
                        <span>
                            {{$t('Priority')}} <el-tooltip
                            class="box-item"
                            effect="dark"
                            :content="$t('The lower the number, the earlier to execute the snippet.')"
                            placement="top-start"
                        >
                            <el-button text size="small" :icon="InfoField" style="font-style: italic"></el-button>
                          </el-tooltip>
                        </span>
                    </template>
                    <el-input-number v-model="snippet.meta.priority" :min="1" />
                </el-form-item>
                <el-form-item class="snippet_tags_item">
                    <template #label>
                        <span>
                            {{$t('Tags')}} <el-tooltip
                            class="box-item"
                            effect="dark"
                            :content="$t('For easily filter your snippets.')"
                            placement="top-start"
                        >
                            <el-button text size="small" :icon="InfoField" style="font-style: italic"></el-button>
                          </el-tooltip>
                        </span>
                    </template>
                    <tag-creator v-model="snippet.meta.tags" />
                </el-form-item>

                <el-form-item v-if="snippet.meta.type == 'css' || snippet.meta.type == 'js'"  class="snippet_loading_method">
                    <template #label>
                        <span>
                            {{$t('Load as Stylesheet File')}} <el-tooltip
                            class="box-item"
                            effect="dark"
                            :content="$t('if you enable this then the snippet will be loaded as a stylesheet file.')"
                            placement="top-start"
                        >
                            <el-button text size="small" :icon="InfoField" style="font-style: italic"></el-button>
                          </el-tooltip>
                        </span>
                    </template>

                    <el-checkbox true-value="yes" false-value="no" v-model="snippet.meta.load_as_file">
                        {{$t('Enable Load as Stylesheet File')}}
                    </el-checkbox>

                </el-form-item>

            </el-col>
        </el-row>
    </el-form>
</template>

<script type="text/babel">
import TagCreator from './_TagCreator.vue'
import CodeEditor from './_CodeEditor.vue'
import {InfoFilled} from '@element-plus/icons-vue';
import {markRaw} from "vue";
import SelectPlus from './_SelectPlus';
import AdvancedConditions from './AdvancedConditions';
import WhereRun from './_WhereRun';

export default {
    name: 'SnippetForm',
    components: {
        TagCreator,
        CodeEditor,
        SelectPlus,
        AdvancedConditions,
        WhereRun
    },
    data() {
        return {
            InfoField: markRaw(InfoFilled)
        }
    },
    props: ['snippet', 'is_new', 'errors']
}
</script>
