import {View, Text, TouchableOpacity} from "react-native";
import React from 'react';
import * as RootNavigation from '../RootNavigation.js';
import {GLOBAL_ACTIONS} from '../../redux/actionTypes';
import store from '../../redux/configureStore';
import WS from 'react-native-websocket';

export default class Home extends React.Component{

    send = (data) => this.state.ws.send(data)

    componentDidMount() {
        store.dispatch({ type: GLOBAL_ACTIONS.GET_TICKER_REQUEST, payload: "ALL" });
    }

    render() {
        return (
            <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                <WS
                    ref={ref => {this.ws = ref}}
                    url="wss://echo.websocket.org/"
                    onOpen={() => {
                        console.log('Open!')
                        this.ws.send('Hello')
                    }}
                    onMessage={console.log}
                    onError={console.log}
                    onClose={console.log}
                    reconnect // Will try to reconnect onClose
                />
                <Text>Home</Text>
                <TouchableOpacity onPress={() => RootNavigation.navigate('Details', { userName: 'Lucy' })}>
                    <Text>Click to view Details</Text>
                </TouchableOpacity>
            </View>
        )
    }
}
