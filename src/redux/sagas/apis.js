const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
};
import * as axios from 'axios';

class apis {

    getTicker = (symbol) => {
        return axios.get(`https://api-pub.bitfinex.com/v2/tickers?symbols=${symbol}`);
    };

    updateProgramPhase = (body) => {
        return fetch({
            method: 'PUT',
            resolvePath: (authInfo) => `/users/${authInfo.uuid}/customer/program_phase`,
            requiresAuth: true,
            body: body,
            errorInfo: {
                title: 'Update Program Phases Failed!',
            },
        });
    };

    getEmotions = () => {
        return fetch({
            method: 'GET',
            path: `/lookups/emotions`,
            requiresAuth: true,
            loggingOption: {
                logRequest: false,
                logResponse: false,
            },
            errorInfo: {
                title: 'Get Emotion Failed!',
            },
        });
    };

    assessPassword(data) {
        return fetch({
            method: 'POST',
            path: '/lookups/assess_password',
            body: data,
            errorInfo: {
                title: 'Assess password failed!',
            },
            loggingOption: {
                logRequest: false,
                logResponse: false,
            },
            informEventBus: false,
        });
    }
}

export default new apis();
