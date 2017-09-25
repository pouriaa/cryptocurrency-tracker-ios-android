/**
 * A quick summary of the balance and transaction
 * history for ETH/EDG accounts. 
 */
import React from 'react';
import {
    View,
    Text,
    AsyncStoragee,
    AppRegistry,
    TextInput,
    ListView,
    StyleSheet
} from 'react-native';

import Config from '../config.js'
import TransactionRecords from './TransactionRecords'

const edgUsdEndpoint = 'https://min-api.cryptocompare.com/data/pricehistorical?fsym=EDG&tsyms=USD';
const ethUsdEndpoint = 'https://min-api.cryptocompare.com/data/pricehistorical?fsym=ETH&tsyms=USD';

const ethBalanceEndpoint = 'https://api.etherscan.io/api?module=account&action=balance&address='+Config.ETH_ADDRESS+'&tag=latest&apikey='+Config.ETHERSCAN_KEY;
const edgBalanceEndpoint = 'https://api.ethplorer.io/getAddressInfo/'+ Config.EDG_ADDRESS +'?apiKey='+Config.ETHPLORER_KEY;

export default class BalanceOverview extends React.Component {
   
    constructor(props) {
      super(props);

      this.state = {eth: '', edg: '', transactionCount: '', ethUsd: '', edgUsd: ''};
      this.dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1!==r2});
    }

    /**
     * Get the balance for ETH and EDG accounts
     */
    async fetchBalance() {
        
        // fetch all of the ETH data
        let ethBalanceResponse = await fetch(ethBalanceEndpoint)
        let ethBalance = JSON.parse(ethBalanceResponse._bodyText).result / 1000000000000000000
        let ethUsdConversionResponse = await fetch(ethUsdEndpoint);
        let ethUsdConversion = JSON.parse(ethUsdConversionResponse._bodyText).ETH.USD;
        let ethUsd = ethUsdConversion * ethBalance;
        
        // fetch all of the EDG data. This requires 
        // some filtering on the server's response
        let edgBalanceResponse = await fetch(edgBalanceEndpoint)
        let edgBalance = JSON.parse(edgBalanceResponse._bodyText)
                            .tokens
                            .find( (element) => 
                                element.tokenInfo.symbol == 'EDG'
                            )
                            .balance
        let edgUsdConversionResponse = await fetch(edgUsdEndpoint);
        let edgUsdConversion = JSON.parse(edgUsdConversionResponse._bodyText).EDG.USD;
        let edgUsd = edgUsdConversion * edgBalance;

        this.setState({eth: ethBalance, edg: edgBalance, edgUsd: edgUsd, ethUsd: ethUsd});
    }

    async componentWillMount() {
        await this.fetchBalance()
    }

    render() {
        return(
            <View style={{
                flex: 1, 
                flexDirection: 'column'
            }}>
                <View style={{flex: 1, flexDirection: 'row', paddingTop: 40}}> 
                    <Text style={styles.balanceText}>
                       Ethereum Balance: {parseFloat(this.state.eth).toFixed(3)}/${parseFloat(this.state.ethUsd).toFixed(2)}
                    </Text>
                </View>
                <View style={{flex: 1, flexDirection: 'row'}}> 
                    <Text style={styles.balanceText}>
                       Edgless Balance: {this.state.edg}/${parseFloat(this.state.edgUsd).toFixed(2)}
                    </Text>
                </View>
                <TransactionRecords />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    balanceText: {
        fontSize: 20,        
        backgroundColor: '#fff',
    },
});