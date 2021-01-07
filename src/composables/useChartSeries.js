import { ref } from '@vue/composition-api'

export function useChartSeries() {
    const series = ref([])

    function addSerie(serie) {
        series.value = [{ 
            data: [
                ...(series.value[0].data || []), 
                serie
            ]
        }]
    }

    function cleanSeries() {
        series.value = [{ data: [] }]
    }

    return {
        series,
        addSerie,
        cleanSeries
    };
}