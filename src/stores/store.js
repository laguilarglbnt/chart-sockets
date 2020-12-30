import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        count: 0
    },
    mutations: {
        increment(state) {
            state.count++
        }
    },
    actions: {
        incr() {

        }
    },
    getters: {

    },

});

// // accessing to state properties
// store.state.count

// // triggering mutations
// store.commit('increment')

// // dispaching an action
// store.dispatch('someAction', { some: 'payload'}, /* some options */)

// // accessing to the getters
// store.getters

// store.watch()

export default store;