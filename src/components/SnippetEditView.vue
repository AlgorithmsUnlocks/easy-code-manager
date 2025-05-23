<template>
    <div class="box_wrapper">
        <div class="box dashboard_box">
            <div class="box_header" style="padding: 15px;font-size: 16px;">
                <div style="padding-top: 5px;" class="box_head">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item :to="{ name: 'dashboard' }">{{$t('Code Snippets')}}</el-breadcrumb-item>
                        <el-breadcrumb-item>
                            <span v-if="snippet">
                                {{ snippet.meta.name }}
                                <el-tag v-if="snippet.error" size="small" type="danger">
                                    {{$t('PAUSED')}}
                                </el-tag>
                                <el-tag v-else :type="(snippet.meta.status == 'published') ? 'success' : 'warning'" size="small">{{snippet.meta.status}}</el-tag>
                            </span>
                            <span v-else>{{$t('Snippet details')}}</span>
                        </el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
                <div  v-loading="saving" v-if="snippet" style="display: flex;" class="box_actions">
                    <el-button :title="$t('Command / CTR + S to save')" @click="saveCode()" :disabled="loading || saving" type="success">
                        {{$t('Update Snippet')}}
                    </el-button>
                    <el-button v-if="!snippet.error" @click="toggleStatus()">
                        <span v-if="snippet.meta.status == 'published'">{{$t('Deactivate')}}</span>
                        <span v-else>{{$t('Activate')}}</span>
                    </el-button>
                </div>
            </div>
            <div v-if="loading" class="box_body">
                <el-skeleton :loading="loading" :rows="10"></el-skeleton>
            </div>
            <div v-else-if="!snippet" class="box_body">
                <h2>{{$t('Sorry Snippet could not be loaded')}}</h2>
            </div>
            <div v-else class="box_body">
                <div class="snippet_error_wrap" v-if="snippet.error">
                    <p>{{$t('__SNIPPET_FATAL_ERROR__')}}</p>
                    <p><strong>{{$t('Error Message:')}}</strong> {{snippet.error}}</p>
                    <el-button @click="saveCode(true)" :disabled="loading || saving" type="primary">
                        {{$t('Try Reactivate')}}
                    </el-button>
                </div>
                <snippet-form :errors="errors" :snippet="snippet"></snippet-form>
            </div>
        </div>
    </div>
</template>

<script type="text/babel">
import SnippetForm from './_SnippetForm.vue'
import Errors from '../Bits/Errors.js'

export default {
    name: 'SnippetEditView',
    props: ['snippet_name'],
    components: {
        SnippetForm
    },
    data() {
        return {
            loading: false,
            snippet: null,
            saving: false,
            errors: new Errors()
        }
    },
    methods: {
        fetchSnippet() {
            this.loading = true;
            this.$get('snippets/find', {
                snippet_name: this.snippet_name
            })
                .then(response => {
                    this.snippet = response.snippet
                })
                .catch((errors) => {
                    if (typeof errors == 'string') {
                        this.$notify.error(this.$t('Something went wrong. Please check the errors.'));
                        this.$eventBus.emit("server_error", errors);
                        return;
                    }

                    this.$handleError(errors);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        saveCode(reactivate = false) {
            // validate the code
            if (!this.snippet.code) {
                this.$notify.error(this.$t('Please enter some code to save'));
                return;
            }
            // check if snippet starts with <?php
            if (this.snippet.meta.type == 'PHP' && this.snippet.code.trim().startsWith('<?php')) {
                this.$notify.error(this.$t('The code should not start with <?php'));
                return;
            }

            this.$eventBus.emit("server_error", null);

            this.saving = true;
            this.$post('snippets/update', {
                fluent_saving_snippet_name: this.snippet_name,
                meta: JSON.stringify({...this.snippet.meta, code: this.snippet.code}),
                reactivate: reactivate
            })
                .then(response => {
                    this.$notify.success(this.$t('Snippet has been updated successfully'));
                    if(reactivate) {
                        this.fetchSnippet();
                    }
                })
                .catch((errors) => {

                    if (typeof errors == 'string') {
                        this.$notify.error(this.$t('Something went wrong. Please check the errors.'));
                        this.$eventBus.emit("server_error", errors);
                        return;
                    }

                    if (errors && errors.data) {
                        this.errors.record(errors.data);
                    }

                    this.$handleError(errors);
                })
                .finally(() => {
                    this.saving = false;
                });
        },
        toggleStatus() {
            this.snippet.meta.status = (this.snippet.meta.status == 'published') ? 'draft' : 'published';
            this.saveCode();
        },
        maybeKeyboardSave(e) {
            if ((window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) && e.keyCode == 83) {
                e.preventDefault();
                this.saveCode();
            }
        }
    },
    mounted() {
        this.fetchSnippet();
        // save the code on ctrl+s or command+s
        document.addEventListener('keydown', this.maybeKeyboardSave);
    },
    beforeUnmount() {
        document.removeEventListener('keydown', this.maybeKeyboardSave);
    }
}
</script>
