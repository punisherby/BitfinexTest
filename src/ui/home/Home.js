import {View, ScrollView} from "react-native";
import React from 'react';
import OrderBook from './components/order-book/OrderBook';
import Ticker from './components/ticker/Ticker';
import Trades from './components/trades/Trades';

export default class Home extends React.Component{
    render() {
        return (
            <ScrollView contentContainerStyle={{flex: 1, width: null, height: null}}>
                <Ticker></Ticker>
                <View style={{height: 10}}></View>
                <OrderBook></OrderBook>
                <View style={{height: 10}}></View>
                <Trades></Trades>
            </ScrollView>
        )
    }
}
