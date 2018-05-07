import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user';
import cert from './modules/cert';
import getters from './getters';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const store = new Vuex.Store({
    getters,
    modules: {
        user,
        cert
    },
    strict: debug
});

export default store;
