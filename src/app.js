import {createApp} from 'vue'
import {createRouter, createWebHashHistory} from 'vue-router';
import {routes} from './routes';
import Rest from './Bits/Rest.js';
import {ElNotification, ElLoading, ElMessageBox} from 'element-plus'
import Storage from '@/Bits/Storage';
import App from './App.vue';
import eventBus from './Bits/event-bus';

require('./app.scss');

const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');
require('dayjs/plugin/utc');
require('dayjs/plugin/localizedFormat');
dayjs.extend(require('dayjs/plugin/utc'));
dayjs.extend(require('dayjs/plugin/localizedFormat'));
dayjs.extend(relativeTime)

function convertToText(obj) {
    const string = [];
    if (typeof (obj) === 'object' && (obj.join === undefined)) {
        for (const prop in obj) {
            string.push(convertToText(obj[prop]));
        }
    } else if (typeof (obj) === 'object' && !(obj.join === undefined)) {
        for (const prop in obj) {
            string.push(convertToText(obj[prop]));
        }
    } else if (typeof (obj) === 'function') {

    } else if (typeof (obj) === 'string') {
        string.push(obj)
    }

    return string.join('<br />')
}

const app = createApp(App);
app.use(ElLoading);

app.config.globalProperties.appVars = window.fluentSnippetAdmin;

app.mixin({
    data() {
        return {
            Storage,
            is_rtl: false
        }
    },
    methods: {
        $get: Rest.get,
        $post: Rest.post,
        $put: Rest.put,
        $del: Rest.delete,
        changeTitle(title) {
            jQuery('head title').text(title + ' - FluentSnippets');
        },
        $handleError(response) {
            let errorMessage = '';
            if (typeof response === 'string') {
                errorMessage = response;
            } else if (response && response.message) {
                errorMessage = response.message;
            } else {
                errorMessage = convertToText(response);
            }
            if (!errorMessage) {
                errorMessage = 'Something is wrong!';
            }
            this.$notify({
                type: 'error',
                title: 'Error',
                message: errorMessage,
                dangerouslyUseHTMLString: true
            });
        },
        convertToText,
        $t(string) {
            return window.fluentSnippetAdmin.i18n[string] || string;
        },
        relativeTimeFromUtc(utcDateTime) {
            if(!utcDateTime) {
                return '';
            }
            const localDateTime = dayjs.utc(utcDateTime).local();
            return localDateTime.fromNow();
        },
        getLangLabelName(lang) {
            switch (lang) {
                case 'php_content':
                    return 'PHP + HTML';
                default:
                    return lang.toUpperCase();
            }
        },
        $storeLocalData(key, value) {
            this.Storage.set(key, value);
        },
        $getLocalData(key, defaultValue = '') {
            return this.Storage.get(key, defaultValue);
        },
        ucFirst(string) {
            if (!string) {
                return '';
            }
            return string.charAt(0).toUpperCase() + string.slice(1);
        },
        exportSnippets(snippets) {
            let selected = snippets.map(snippet => {
                // replace .php from the end
                return snippet.replace(/\.php$/, '');
            });

            if (selected.length === 0) {
                this.$message.error('Please select at least one snippet to export.');
                return;
            }

            location.href = window.ajaxurl + '?' + jQuery.param({
                action: 'fluent_snippets_export_snippets',
                snippets: selected,
                _nonce: window.fluentSnippetAdmin.nonce
            });
        }
    },
    watch: {
        $route(to, from) {
            const active = to.meta.active;
            if (!active) {
                return;
            }
            jQuery('.fsnip_menu_primary').removeClass('router-link-active');
            jQuery('.fsnip_menu_primary.fsnip_menu_' + active).addClass('router-link-active');
        }
    }
});

app.config.globalProperties.$notify = ElNotification;
app.config.globalProperties.$confirm = ElMessageBox.confirm;
app.config.globalProperties.$prompt = ElMessageBox.prompt;

app.use(eventBus);

const router = createRouter({
    routes,
    history: createWebHashHistory()
});

window.fluentFrameworkApp = app.use(router).mount(
    '#fluent_snippets_app'
);
