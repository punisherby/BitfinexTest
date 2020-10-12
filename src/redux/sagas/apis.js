import * as axios from 'axios';

class apis {

    getTicker = (symbol) => {
        return axios.get(`https://api-pub.bitfinex.com/v2/tickers?symbols=${symbol}`);
    };
}

export default new apis();
