import { getTrendingStocks } from "./utils/wsb"
import styled from "styled-components";

const Container = styled.div`
	max-width: 900px;
	margin: 0 auto;
	padding: 0 40px 40px 40px;
	box-sizing: border-box;
`;

const Hero = styled.div`
	padding: 100px 0;

	h1, p {
		margin: 0;
	}

	h1 {
		font-size: 80px;
	}

	p {
		font-size: 30px;
	}
`;

const Grid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
	grid-gap: 40px;
`;

const Card = styled.div`
	font-size: 50px;
	font-weight: bold;
	padding: 40px;
	border: 1px solid #CCC;
	border-radius: 15px;
	color: #444;
	transition: all 0.2s ease-in-out;

	&:hover {
		border: 1px solid #AAA;
		color: black;
	}
`;

export default function Home({ stocks }) {
	return (
		<Container>
			<Hero>
				<h1>Meme Stocks</h1>
				<p>Trending stocks from the /r/wallstreetbets subreddit</p>
			</Hero>
			<Grid>
				{stocks.map(stock => (
					<Card key={stock.symbol.symbol}>
						{stock.symbol.symbol}
					</Card>
				))}
			</Grid>
		</Container>
	)
}
	
export async function getStaticProps() {
	
	const stocks = await getTrendingStocks();
	
	return {
		props: {
			stocks
		}
	}
}