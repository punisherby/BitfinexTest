import {View, Image, Text} from 'react-native';
import React, {PureComponent} from 'react';
import {GLOBAL_ACTIONS} from '../../../../redux/actionTypes';
import store from '../../../../redux/configureStore';
import {connect} from 'react-redux';
import _ from 'lodash';

const msg = JSON.stringify({
    event: 'subscribe',
    channel: 'ticker',
    symbol: 'tBTCUSD',
});

class Ticker extends PureComponent {

    constructor() {
        super();

        this._connectWebSocket();
    }

    render() {

        const {btcTicker} = this.props;

        let isChangePositive = btcTicker[4] >= 0;

        return (
            <View style={styles.mainContainer}>
                <View style={{flex: 0.15}}>
                    <Image style={{width: 30, height: 35}} source={require('../../../../images/bitcoin_logo.png')}/>
                </View>
                <View style={{flex: 0.50}}>
                    <Text style={{color: '#FFFFFF'}}>BTC/USD</Text>
                    <Text style={{color: '#FFFFFF'}}>VOL {_.round(btcTicker[7])} BTC</Text>
                    <Text style={{color: '#FFFFFF'}}>LOW {_.round(btcTicker[9], 2)}</Text>
                </View>
                <View style={{flex: 0.35, alignItems: 'flex-end'}}>
                    <Text style={{color: '#FFFFFF'}}>{_.round(btcTicker[6], 2)}</Text>
                    <Text style={{color: isChangePositive ? 'green' : 'red'}}>{_.round(btcTicker[4], 2)} /
                        ({_.round(btcTicker[5] * 100, 2)}%)</Text>
                    <Text style={{color: '#FFFFFF'}}>HIGH {_.round(btcTicker[8], 2)}</Text>
                </View>
            </View>
        );
    }

    _connectWebSocket() {
        this.socket = new WebSocket('wss://api-pub.bitfinex.com/ws/2');

        this.socket.onopen = () => {
            console.log('ticker websocket started');
            this.socket.send(msg);
        };

        this.socket.onmessage = (e) => {
            if (!e.data.includes('hb')) {
                let dataArr = e.data.split(',[', 2);
                if (dataArr && dataArr[1]) {
                    store.dispatch({
                        type: GLOBAL_ACTIONS.SET_BTC_TICKER,
                        payload: dataArr[1].substring(0, dataArr[1].length - 2),
                    });
                }
            }
        };

        this.socket.onerror = (e) => {
            console.log('ticker websocket error');
            console.log(e.message);
            this.socket.close();
        };

        this.socket.onclose = (e) => {
            console.log('ticker websocket closed');
            console.log(e.code, e.reason);

            setTimeout(() => {
                console.log('ticker websocket reconnecting...');
                this._connectWebSocket();
            }, 1000);
        };
    }
}

const styles = {
    mainContainer: {
        height: 80,
        width: null,
        flexDirection: 'row',
        marginHorizontal: 20,
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
    },
};

function mapStateToProps(state) {
    return {
        btcTicker: state.global.btcTicker,
    };
}

export default connect(mapStateToProps, null)(Ticker);
