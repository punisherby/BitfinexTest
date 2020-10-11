import React from "react";
import {View, Text} from "react-native";
import { Provider } from "react-redux";
import store from "./redux/configureStore";
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './ui/home/Home';
import {Details} from './ui/details/Details';
import {navigationRef} from './ui/RootNavigation';

//const AppContainer = createAppContainer(MainStackNavigator);
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
                        <Stack.Navigator initialRouteName="Home">
                            <Stack.Screen name="Home" component={Home} />
                            <Stack.Screen name="Details" component={Details} />
                        </Stack.Navigator>
                    </NavigationContainer>
                </View>
            </Provider>
        );
    }
}
