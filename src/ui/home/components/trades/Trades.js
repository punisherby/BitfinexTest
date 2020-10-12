import {View, Image, Text, ScrollView, ActivityIndicator} from 'react-native';
import React, {PureComponent} from 'react';
import {GLOBAL_ACTIONS} from '../../../../redux/actionTypes';
import store from '../../../../redux/configureStore';
import {connect} from 'react-redux';
import _ from 'lodash';
import moment from "moment";
import Icon from "react-native-vector-icons/Ionicons";

const msg = JSON.stringify({
    event: 'subscribe',
    channel: 'trades',
    symbol: 'tBTCUSD'
})

class Trades extends PureComponent {

    constructor() {
        super();

        this._connectWebSocket();
    }

    render() {

        return (
            <View style={styles.mainContainer}>
                <View style={{padding: 10, borderBottomWidth: 0.5, borderBottomColor: "#DDDDDD"}}>
                    <Text style={{color: "#FFFFFF", fontSize: 16, fontWeight: "bold"}}>TRADES <Text style={{fontWeight: "normal"}}>BTC/USD</Text></Text>
                </View>
                <View style={{flexDirection: "row", justifyContent: "space-between", paddingTop: 6}}>
                    <View style={{flex: 0.1, alignItems: "center"}}>
                        <Text style={{color: "#FFFFFF", fontSize: 12}}></Text>
                    </View>
                    <View style={{flex: 0.3, alignItems: "flex-start"}}>
                        <Text style={{color: "#FFFFFF", fontSize: 12}}>TIME</Text>
                    </View>
                    <View style={{flex: 0.3, alignItems: "center"}}>
                        <Text style={{color: "#FFFFFF", fontSize: 12}}>PRICE</Text>
                    </View>
                    <View style={{flex: 0.3, alignItems: "flex-end"}}>
                        <Text style={{color: "#FFFFFF", fontSize: 12}}>AMOUNT</Text>
                    </View>
                </View>
                <ScrollView contentContainerStyle={{paddingTop: 4}}>
                    {this._renderTradesData()}
                </ScrollView>
            </View>
        );
    }

    _renderTradesData() {
        const{tradesStream}= this.props;

        if(tradesStream.length == 0) {
            return <ActivityIndicator />
        }

        let cols = [];

        tradesStream.forEach((item) => {
            const singleItem = item.split(",")
            cols.push(
                <View key={singleItem[1] + Math.random()} style={{flexDirection: "row", justifyContent: "space-between", backgroundColor: singleItem[2] > 0 ? "#294538" : "#4e3934", marginBottom: 1}}>
                    <View style={{flex: 0.13, alignItems: "center"}}>
                        <Text style={{color: "#FFFFFF", fontSize: 12}}>{singleItem[2] > 0 ? <Icon name="arrow-up" size={20} color="green" /> : <Icon name="arrow-down" size={20} color="red" />}</Text>
                    </View>
                    <View style={{flex: 0.29, alignItems: "flex-start"}}>
                        <Text style={{color: "#FFFFFF", fontSize: 12}}>{moment.unix(singleItem[1]).local().format("HH:MM:ss")}</Text>
                    </View>
                    <View style={{flex: 0.29, alignItems: "center"}}>
                        <Text style={{color: "#FFFFFF", fontSize: 12}}>{_.round(singleItem[3])}</Text>
                    </View>
                    <View style={{flex: 0.29, alignItems: "flex-end"}}>
                        <Text style={{color: "#FFFFFF", fontSize: 12}}>{Math.abs(_.round(singleItem[2], 4))}</Text>
                    </View>
                </View>
            )
        });

        return cols;
    }

    _connectWebSocket() {
        this.socket = new WebSocket('wss://api-pub.bitfinex.com/ws/2');

        this.socket.onopen = () => {
            console.log('trades websocket started');
            this.socket.send(msg);
        };

        this.socket.onmessage = (e) => {
            if (!e.data.includes('hb')) {

                if(e.data.includes(",[[")) {
                    let dataArr = e.data.split(",[[", 2);
                    if(dataArr && dataArr[1]) {
                        store.dispatch({
                            type: GLOBAL_ACTIONS.SET_INITIALIZE_TRADES,
                            payload: dataArr[1].substring(0, dataArr[1].length - 3),
                        });
                    }
                } else if(e.data.includes("tu") || e.data.includes("te")) {
                    let dataArr = e.data.split(',[', 2);
                    if (dataArr && dataArr[1]) {
                        store.dispatch({
                            type: GLOBAL_ACTIONS.SET_TRADES,
                            payload: dataArr[1].substring(0, dataArr[1].length - 2),
                        });
                    }
                }
            }
        };

        this.socket.onerror = (e) => {
            console.log('trades websocket error');
            console.log(e.message);
            this.socket.close();
        };

        this.socket.onclose = (e) => {
            console.log('trades websocket closed');
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
        height: 400,
        width: null,
        marginHorizontal: 20,
        paddingHorizontal: 5,
        backgroundColor: '#000000',
    },
};

function mapStateToProps(state) {
    return {
        tradesStream: state.global.tradesStream,
    };
}

export default connect(mapStateToProps, null)(Trades);
