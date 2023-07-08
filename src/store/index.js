import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export default new Vuex.Store({
    state:{
        websocket:null,
        idInterval:null,
        alarmNumber:0,
        alarmTableData:[],
    },
    mutations:{

    },
    getters:{

    }
})