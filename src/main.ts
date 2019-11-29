'use strict';

import Vue from 'vue';
import App from '@/App.vue';

import router from '@/router';
import store  from '@/store';

/*
    =======
    FILTERS
    =======
*/
import { filters } from '@/filters';

filters.forEach(f => {
    Vue.filter(f.name, f.method);
});


/*
    =================
    GLOBAL COMPONENTS
    =================
*/
import Button       from '@/components/ui/Button.vue';
import EditButton   from '@/components/ui/EditButton.vue';
import DeleteButton from '@/components/ui/DeleteButton.vue';
import HttpSpinner  from '@/components/ui/HttpSpinner.vue';
import ModalWindow  from '@/components/ui/ModalWindow.vue';

Vue.component('Button',       Button);
Vue.component('EditButton',   EditButton);
Vue.component('DeleteButton', DeleteButton);
Vue.component('HttpSpinner',  HttpSpinner);
Vue.component('ModalWindow',  ModalWindow);

Vue.config.productionTip = false;

Vue.prototype.$showMessages = process.env.NODE_ENV !== 'production';

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');