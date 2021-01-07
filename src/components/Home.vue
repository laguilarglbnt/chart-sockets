<template>
    <div>
        <button v-for="(serie, index) of series" :key="index" @click="addNewSerie(index)">
            No: {{ index }} {{ serie.Open }}
        </button>

        <br><br>
        
        <select v-model="timeType">
            <option v-for="(type, index) of timeTypeList" :key="index">
                {{ type }}
            </option>
        </select> <br/>

        <Chart :options="chartOptions" :series="chartSeries"/>
    </div>
</template>

<script>
import { TimeType, AppleStockService } from '../services/apple-stock.service.js'
import Chart from './Chart.vue'
import { SocketService, SOCKET_URL, SOCKET_EVENT } from '../services/socket.service'
import { ref, onMounted, watch } from '@vue/composition-api'
import { useChartSeries } from '../composables/useChartSeries'

export default {
    name: 'Home',
    components: {
        Chart
    },
    setup() {
        const { series: chartSeries, addSerie, cleanSeries } = useChartSeries([])
        const timeType = ref(TimeType.DAILY)
        const timeTypeList = ref(Object.values(TimeType))
        const series = ref([])
        const stockService = new AppleStockService()
        const socket = new SocketService(SOCKET_URL)
        const chartOptions = {
            chart: {
                type: 'candlestick',
                height: 350
            },
            title: {
                text: 'CandleStick Chart',
                align: 'left'
            },
            xaxis: {
                type: 'datetime'
            },
            yaxis: {
                tooltip: {
                    enabled: true
                }
            }
        }

        socket.on(SOCKET_EVENT.TIME_TYPE_CHANGE, timeTypeRespose => {
            timeType.value = timeTypeRespose
            getStockBy()
        })

        socket.on(SOCKET_EVENT.ADD_SERIE, index => {
            addSerie(series.value[index])
            removeButtonSerie(index)
        })

        function getStockBy() {
            return stockService.getStockBy(timeType.value)
                .then(seriesResponse => {
                    series.value = seriesResponse[0].data.splice(0, 20) // bad code, just for testing
                    cleanSeries()
                })
        }

        function addNewSerie(index) {
            const [serie] = removeButtonSerie(index)
            addSerie(serie)
            socket.emit(SOCKET_EVENT.ADD_SERIE, index) // this could be something different (may be some ID)

        }

        function onTimeTypeChange(timeType) {
            getStockBy().then(() => {
                socket.emit(SOCKET_EVENT.TIME_TYPE_CHANGE, timeType)
            })
        }

        function removeButtonSerie(index) {
            return series.value.splice(index, 1)
        }

        onMounted(getStockBy)

        watch(timeType, onTimeTypeChange)

        return {
            timeType,
            timeTypeList,
            series,
            addNewSerie,
            chartSeries,
            chartOptions
        }
    }
}
</script>