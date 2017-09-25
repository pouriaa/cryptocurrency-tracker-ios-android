/**
 * Page to render the balance overview 
 * with a conversion to USD which includes
 * a list of  all past transactions
 * for each type of token.
 */

import React from 'react';
import { StyleSheet, Text, View} from 'react-native';

import BalanceOverview from './components/BalanceOverview'

export default class App extends React.Component {
    render() {
        return (
            <View style={styles.container}>
               <BalanceOverview />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        paddingLeft: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
