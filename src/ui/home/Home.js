import {View} from "react-native";
import React, {PureComponent} from 'react';
import OrderBook from './components/order-book/OrderBook';
import Ticker from './components/ticker/Ticker';

export default class Home extends PureComponent{
    render() {
        return (
            <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                <Ticker></Ticker>
                <OrderBook></OrderBook>
            </View>
        )
    }
}
