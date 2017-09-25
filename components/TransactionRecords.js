/**
 * A record of past transactions for all ETH/EDG accounts. 
 */

import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  FlatList,
} from 'react-native';

import Config from '../config.js'

const ethTransactionsLink = 'http://api.etherscan.io/api?module=account&action=txlist&address='+Config.ETH_ADDRESS+'&startblock=0&endblock=99999999&sort=asc&apikey=' + Config.ETHERSCAN_KEY;
const edgTransactionsLink = 'https://api.ethplorer.io/getAddressHistory/' + Config.EDG_ADDRESS + '?apiKey=' + Config.ETHPLORER_KEY;

export default class TransactionRecords extends Component {

	/**
	 * Render a transaction
	 */
	renderEthList({item, index}) {
		
		// check for incoming or outgoing transaction
		let plusOrMinus = (item.from.toLocaleLowerCase() == Config.ETH_ADDRESS.toLocaleLowerCase()) ? '-' : '+';

		return (
			<View style={{
					flex: 1, 
					flexDirection: 'row'
				}}>
					<Text style={{paddingRight: 10}}>
						{new Date((item.timeStamp) * 1000).toISOString().slice(0,10)}
					</Text>
					<Text>
						{plusOrMinus}
						{(item.value / 1000000000000000000).toFixed(4)}
					</Text>
			</View>
		)
	}

	/**
	 * Render a transaction 
	 */
	renderEdgList({item, index}) 
	{
		
		// Only render edge tokens
		if (item.tokenInfo.symbol != 'EDG') {
			return;
		}

		// check for incoming or outgoing transaction
		let plusOrMinus = (item.from.toLocaleLowerCase() == Config.ETH_ADDRESS.toLocaleLowerCase()) ? '-' : '+';
		
		return (
			<View style={{
				flex: 1, 
				flexDirection: 'row'
			}}>
				<Text style={{paddingRight: 10}}>
					{new Date((item.timestamp) * 1000).toISOString().slice(0,10)}
				</Text>
				<Text>
					{plusOrMinus}
					{item.value}
				</Text>
			</View>
		)
	}

	/**
	 * Get the transactions for a specific account
	 */
	async fetchTransactions() {
		// reset the state
		this.setState({transactions: {eth: [], edg: []}})

		// get the ETH transactions
	    let ethTransactionsResponse = await fetch(ethTransactionsLink)
	    let ethTransactions = JSON.parse(ethTransactionsResponse._bodyText).result

	    // get the EDG transactions
	    let edgTransactionsResponse = await fetch(edgTransactionsLink)
	    let edgTransactions = JSON.parse(edgTransactionsResponse._bodyText).operations

	    this.setState({transactions: {eth: ethTransactions, edg: edgTransactions}})
	}

	async componentWillMount() {
		await this.fetchTransactions()
	}

	render() {
		return (
			<View style={{paddingBottom: 40}}>
				<Text style={{fontWeight: 'bold'}}>Ethereum Transactions</Text>
				<FlatList
					data={this.state.transactions.eth}
					renderItem={this.renderEthList}
					keyExtractor={(item, index) => index}
					style={{paddingBottom: 20}}
				/>
				<Text style={{fontWeight: 'bold'}}>Edgeless Transactions</Text>
				<FlatList
					data={this.state.transactions.edg}
					renderItem={this.renderEdgList}
					keyExtractor={(item, index) => index}
				/>
			</View>
		);
	}
}