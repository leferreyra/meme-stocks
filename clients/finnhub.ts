
import Axios from 'axios';

const BASE_URL = 'https://finnhub.io/api/v1'
const API_KEY = 'c0m7pjf48v6rkav1pd0g'

export type GetStockSymbolsResponse = {
	[symbol: string]: SymbolResponse
}

export type SymbolResponse = {
	symbol: string;
	description: string;
}

export async function getStockSymbols(): Promise<GetStockSymbolsResponse> {
	return Axios.get(`${BASE_URL}/stock/symbol`, {
		params: {
			exchange: 'US',
			token: API_KEY
		}
	})
	.then(response => {
		return response.data.reduce((symbols, item) => {
			symbols[item.symbol] = item;
			return symbols;
		}, {})
	})
}
