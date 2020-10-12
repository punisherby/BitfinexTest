import {View, Text, ScrollView, ActivityIndicator} from 'react-native';
import React, {PureComponent} from 'react';
import {GLOBAL_ACTIONS} from '../../../../redux/actionTypes';
import store from '../../../../redux/configureStore';
import {connect} from 'react-redux';
import _ from 'lodash';

const msg = JSON.stringify({
    event: 'subscribe',
    channel: 'book',
    symbol: 'tBTCUSD',
    prec: 'P2',
    freq:'F1'
})

class OrderBook extends PureComponent {

    constructor() {
        super();

        this._connectWebSocket();
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                <View style={{padding: 10, borderBottomWidth: 0.5, borderBottomColor: "#DDDDDD"}}>
                    <Text style={{color: "#FFFFFF", fontSize: 16, fontWeight: "bold"}}>ORDER BOOK <Text style={{fontWeight: "normal"}}>BTC/USD</Text></Text>
                </View>
                <View style={{flexDirection: "row", justifyContent: "space-between", paddingTop: 6}}>
                    <View style={{flexDirection: "row", flex: 0.5, justifyContent: "space-between"}}>
                        <View style={{flex: 0.35, alignItems: "center"}}>
                            <Text style={{color: "#FFFFFF", fontSize: 12}}>TOTAL</Text>
                        </View>
                        <View style={{flex: 0.35, alignItems: "center"}}>
                            <Text style={{color: "#FFFFFF", fontSize: 12}}>PRICE</Text>
                        </View>
                    </View>
                    <View style={{flexDirection: "row", flex: 0.5, justifyContent: "space-between"}}>
                        <View style={{flex: 0.35, alignItems: "center"}}>
                            <Text style={{color: "#FFFFFF", fontSize: 12}}>PRICE</Text>
                        </View>
                        <View style={{flex: 0.35, alignItems: "center"}}>
                            <Text style={{color: "#FFFFFF", fontSize: 12}}>TOTAL</Text>
                        </View>
                    </View>
                </View>
                <ScrollView contentContainerStyle={{flexDirection: "row", justifyContent: "space-between", paddingTop: 4}}>
                    <View style={{flex: 0.5, justifyContent: "space-between"}}>
                        {this._renderTradesBuyData()}
                    </View>
                    <View style={{flex: 0.5, justifyContent: "space-between"}}>
                        {this._renderTradesSellData()}
                    </View>
                </ScrollView>
            </View>
        );
    }

    _renderTradesBuyData() {
        const{orderbookBuyStream}= this.props;

        if(!orderbookBuyStream || orderbookBuyStream.length == 0) {
            return <ActivityIndicator />
        }

        let cols = [];
        let total = 0;

        orderbookBuyStream.forEach((item) => {
            const singleItem = item.split(",")
            total+= Math.abs(_.round(singleItem[2], 4));
            cols.push(
                <View key={singleItem[0] + Math.random()} style={{flex: 1, flexDirection: "row", justifyContent: "space-between"}}>
                    <View style={{flex: 0.35, alignItems: "center"}}>
                        <Text style={{color: "#FFFFFF", fontSize: 12}}>{_.round(total, 2)}</Text>
                    </View>
                    <View style={{flex: 0.35, alignItems: "center"}}>
                        <Text style={{color: "#FFFFFF", fontSize: 12}}>{_.round(singleItem[0],2)}</Text>
                    </View>
                </View>
            )
        });

        return cols;
    }

    _renderTradesSellData() {
        const{orderbookSellStream}= this.props;

        if(!orderbookSellStream || orderbookSellStream.length == 0) {
            return <ActivityIndicator />
        }

        let cols = [];
        let total = 0;

        orderbookSellStream.forEach((item) => {
            const singleItem = item.split(",")
            total+= Math.abs(_.round(singleItem[2], 4));
            cols.push(
                <View key={singleItem[0] + Math.random()} style={{flex: 1, flexDirection: "row", justifyContent: "space-between"}}>
                    <View style={{flex: 0.35, alignItems: "center"}}>
                        <Text style={{color: "#FFFFFF", fontSize: 12}}>{_.round(singleItem[0])}</Text>
                    </View>
                    <View style={{flex: 0.35, alignItems: "center"}}>
                        <Text style={{color: "#FFFFFF", fontSize: 12}}>{_.round(total, 2)}</Text>
                    </View>
                </View>
            )
        });

        return cols;
    }

    _calculateTotal() {
        _
    }

    _connectWebSocket() {
        this.socket = new WebSocket('wss://api-pub.bitfinex.com/ws/2');

        this.socket.onopen = () => {
            console.log('orderbook websocket started');
            this.socket.send(msg);
        };

        this.socket.onmessage = (e) => {
            if (!e.data.includes('hb')) {
                if(e.data.includes(",[[")) {
                    let dataArr = e.data.split(",[[", 2);
                    if(dataArr && dataArr[1]) {
                        store.dispatch({
                            type: GLOBAL_ACTIONS.SET_INITIALIZE_ORDERBOOK,
                            payload: dataArr[1].substring(0, dataArr[1].length - 3),
                        });
                    }
                } else {
                    let dataArr = e.data.split(',[', 2);
                    if (dataArr && dataArr[1]) {
                        store.dispatch({
                            type: GLOBAL_ACTIONS.SET_ORDERBOOK,
                            payload: dataArr[1].substring(0, dataArr[1].length - 2),
                        });
                    }
                }
            }
        };

        this.socket.onerror = (e) => {
            console.log('orderbook websocket error');
            console.log(e.message);
            this.socket.close();
        };

        this.socket.onclose = (e) => {
            console.log('orderbook websocket closed');
            console.log(e.code, e.reason);

            setTimeout(() => {
                console.log('ticker websocket reconnecting...');
                this.socket = new WebSocket('wss://api-pub.bitfinex.com/ws/2');
            }, 1000);
        };
    }
}

const styles = {
    mainContainer: {
        height: 300,
        width: null,
        marginHorizontal: 20,
        paddingHorizontal: 5,
        backgroundColor: '#000000',
    },
};

function mapStateToProps(state) {
    return {
        orderbookBuyStream: state.global.orderbookBuyStream,
        orderbookSellStream: state.global.orderbookSellStream,
    };
}

export default connect(mapStateToProps, null)(OrderBook);
