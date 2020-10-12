import {View, Text, TouchableOpacity} from "react-native";
import React from 'react';
import {GLOBAL_ACTIONS} from '../../../../redux/actionTypes';
import store from '../../../../redux/configureStore';


export default class OrderBook extends React.Component{

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
