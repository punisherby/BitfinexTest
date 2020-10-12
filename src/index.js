import React from "react";
import {View} from "react-native";
import { Provider } from "react-redux";
import store from "./redux/configureStore";
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './ui/home/Home';
import {navigationRef} from './ui/RootNavigation';
const Stack = createStackNavigator();

export default class App extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <View
                    style={{
                        flex: 1,
                        width: null,
                        height: null,
                        backgroundColor: "transparent",
                    }}
                >
                    <NavigationContainer ref={navigationRef}>
                        <Stack.Navigator initialRouteName="Bitfinex App">
                            <Stack.Screen name="Bitfinex App" component={Home} />
                        </Stack.Navigator>
                    </NavigationContainer>
                </View>
            </Provider>
        );
    }
}
