import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import apiClient from './api';
import axiosMiddleware from 'redux-axios-middleware';

import reducer from './ducks';
import Router from './Router';

const store = createStore(reducer, applyMiddleware(axiosMiddleware(apiClient)));

console.disableYellowBox = true;

export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <View style={styles.container}>
                    <Router/>
                </View>
            </Provider>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: 50
    }
});