import { getSubredditPages, PostResponse } from "../clients/reddit";
import { getStockSymbols, GetStockSymbolsResponse, SymbolResponse } from "../clients/finnhub";
import uniq from 'lodash.uniq';

const BLACKLISTED_WORDS = [
	'A', // Just a preposition at the start
	'J', // J Powell
	'TA', // Technical Analysis
	'DD', // Due Diligence
	'AM', // Morning
	'MJ',
	'TV',
	'PT',
	'YOLO',
	'COOL',
	'CEO',
	'USD',
].reduce((map, word) => {
	map[word] = true;
	return map;
}, {});

function parseSymbols(text: string, symbols: GetStockSymbolsResponse) {
	if (text === text.toUpperCase()) return []
	return text.split(" ").filter(word => {
		const word_ = word.replace('$', '');
		return symbols[word_] && !BLACKLISTED_WORDS[word_]
	});
}

function getPostSymbols(post: PostResponse, symbols: GetStockSymbolsResponse) {
	const stocks = parseSymbols(post.data.title, symbols).map(s => s.replace('$', ''));
	return uniq(stocks);
}

function getPostScore(post: PostResponse): number {
	return post.data.score + post.data.num_comments * 5;
}

type GetTrendingStocksResponse = Array<{
	score: number;
	symbol: SymbolResponse;
	posts: Array<PostResponse>
}>

export async function getTrendingStocks(): Promise<GetTrendingStocksResponse> {
	
	const symbols = await getStockSymbols();
	
	const posts = await getSubredditPages({
		subreddit: 'wallstreetbets',
		listing: 'hot'
	});

	const ranked: {[s: string]: {
		score: number;
		symbol: SymbolResponse;
		posts: Array<PostResponse>
	}} = {};

	posts.forEach(post => {
		const postSymbols = getPostSymbols(post, symbols);
		postSymbols.forEach(s => {
			const current = ranked[s] || { score: 0, symbol: symbols[s], posts: [] }
			ranked[s] = {
				...current,
				score: current.score + getPostScore(post),
				posts: [...current.posts, post]
			}
		})
	})

	const sorted = Object.values(ranked).sort((a, b) => b.score - a.score)

	return sorted;
}