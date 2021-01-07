// Readonly TimeType
export const TimeType = Object.freeze({
    DAILY: 'daily',
    MONTHLY: 'montly',
    WEEKLY: 'weekly'
});

export class AppleStockService {
    __baseApi = 'https://raw.githubusercontent.com/EstebanGold/apple-stock/main/src/data';

    getStockBy(TimeType) {
        return fetch(`${this.__baseApi}/${TimeType}.json`)
            .then(res => res.json())
            .then(this.__formatSerie);
    }

    __formatSerie(series) {
        const newSeries = series.map(serie => ({
            x: serie.Date,
            y: [serie.Open, serie.High, serie.Low, serie.Close]
        }));

        return [{
            data: newSeries
        }];
    }
}