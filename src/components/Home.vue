<template>
    <div>
        <select v-model="timeType" @change="onTimeTypeChange">
            <option v-for="(type, index) of timeTypeList" :key="index">
                {{ type }}
            </option>
        </select> <br/>
        {{ timeType }}
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
                .then(series => this.chartSeries = series)
        },

        initSocket() {
            this.socket = new SocketService(SOCKET_URL)

            this.socket.on(SOCKET_EVENT.TIME_TYPE_CHANGE, timeType => {
                this.timeType = timeType
                this.getStockBy()
            })
        }
    }
}
</script>