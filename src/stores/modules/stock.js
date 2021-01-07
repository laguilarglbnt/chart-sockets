export const STOCK_ACTIONS = Object.freeze({
    SET_SERIES: 'setSeries',
    SET_TIME_TYPE: 'setTimeType'
})

export const stock = {
    state: () => ({
        timeType: '',
        series: [{
            data: []
        }]
    }),
    mutations: {
        setSeries(state, series) {
            state.series = [{
                data: series
            }]
        },
        setTimeType(state, timeType) {
            state.timeType = timeType
        }
    },
    actions: {
        setSeries({ commit }, series) {
            commit(STOCK_ACTIONS.SET_SERIES, series)
        },
        setTimeType({ commit }, timeType) {
            commit(STOCK_ACTIONS.SET_TIME_TYPE, timeType)
        }
    },
    getters: {
        getSeries(state) {
            return state.series
        },
        getTimeType(state) {
            return state.timeType
        }
    }
}
