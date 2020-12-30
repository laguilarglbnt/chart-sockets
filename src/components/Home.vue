<template>
    <div>
        <button v-for="(serie, index) of series" :key="index" @click="addSerie(index)">
            No: {{ index }} {{ serie.Open }}
        </button>
        <br><br>
        <select v-model="timeType" @change="onTimeTypeChange">
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

export default {
    name: 'Home',
    components: {
        Chart
    },
    data() {
        return {
            timeType: TimeType.DAILY,
            timeTypeList: Object.values(TimeType),
            series: [],

            // Services
            stockService: null,

            // socket
            socket: null,

            // Chart
            chartOptions: {
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
            },
            chartSeries: []
        };
    },
    created() {
        this.initSocket()
    },
    mounted() {
        this.stockService = new AppleStockService()
        this.getStockBy()
    },
    methods: {
        onTimeTypeChange() {
            this.getStockBy().then(() => {
                this.socket.emit(SOCKET_EVENT.TIME_TYPE_CHANGE, this.timeType)
            })
        },

        getStockBy() {
            return this.stockService.getStockBy(this.timeType)
                .then(series => {
                    this.series = series[0].data.splice(0, 20) // bad code, just for testing
                    this.chartSeries = [{ data: [] }]
                })
        },

        initSocket() {
            this.socket = new SocketService(SOCKET_URL)

            this.socket.on(SOCKET_EVENT.TIME_TYPE_CHANGE, timeType => {
                this.timeType = timeType
                this.getStockBy()
            })

            this.socket.on(SOCKET_EVENT.ADD_SERIE, index => {
                this.addSerieToChart(this.series[index])
                this.removeButtonSerie(index);
            })
        },

        addSerieToChart(serie) {
            const series = this.chartSeries[0].data; //bad code
            this.chartSeries = [{ 
                data: [...series, serie]
            }]
        },

        addSerie(index) {
            const [serie] = this.removeButtonSerie(index)
            this.addSerieToChart(serie)
            this.socket.emit(SOCKET_EVENT.ADD_SERIE, index) // this could be something different (may be some ID)

        },

        removeButtonSerie(index) {
            return this.series.splice(index, 1)
        }
    }
}
</script>