import {View, Text, TouchableOpacity} from "react-native";
import React from 'react';
import * as RootNavigation from '../RootNavigation.js';
import {GLOBAL_ACTIONS} from '../../redux/actionTypes';
import store from '../../redux/configureStore';

const msg = JSON.stringify({
    event: 'subscribe',
    channel: 'ticker',
    symbol: 'tBTCUSD'
}, {
    event: 'subscribe',
    channel: 'ticker',
    symbol: 'tZECUSD'
})

export default class Home extends React.Component{

    constructor() {
        super();

        this.socket = new WebSocket("wss://api-pub.bitfinex.com/ws/2");

        this.socket.onopen = () => {
            // connection opened
            console.log("websocket started");
            this.socket.send(msg); // send a message
        };

        this.socket.onmessage = (e) => {
            // a message was received
            if(!e.data.includes("hb")) {
                console.log(e.data);
            }
        };

        this.socket.onerror = (e) => {
            // an error occurred
            console.log("websocket error");
            console.log(e.message);
        };

        this.socket.onclose = (e) => {
            // connection closed
            console.log("websocket closed");
            console.log(e.code, e.reason);
        };
    }

    componentDidMount() {
        store.dispatch({ type: GLOBAL_ACTIONS.GET_TICKER_REQUEST, payload: "ALL" });
    }

    render() {
        return (
            <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                <Text>Home</Text>
                <TouchableOpacity onPress={() => RootNavigation.navigate('Details', { userName: 'Lucy' })}>
                    <Text>Click to view Details</Text>
                </TouchableOpacity>
            </View>
        )
    }
}
