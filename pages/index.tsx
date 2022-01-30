import Head from "next/head"
import NextScript from "next/script"
import { getTrendingStocks } from "../utils/wsb"
import styled from "styled-components"

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
		font-weight: bold;
		font-size: 80px;
	}

	p {
		font-size: 30px;
	}

	a {
		color: #0099ff;
	}

	@media (max-width: 574px) {

		padding: 80px 0;

		h1 {
			font-size: 60px;
		}

		p {
			font-size: 20px;
		}
	}

	@media (max-width: 460px) {
		h1 {
			font-size: 50px;
		}
	}

	@media (max-width: 390px) {

		padding: 40px 0;

		h1 {
			font-size: 40px;
		}

		p {
			font-size: 18px;
		}
	}
`;

const Grid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
	grid-gap: 40px;
`;

const Card = styled.div`
	display: flex;
	padding: 40px;
	border: 1px solid #CCC;
	border-radius: 15px;
	transition: all 0.2s ease-in-out;
	position: relative;
	overflow: hidden;
	color: #555;
	font-size: 50px;
	font-weight: bold;
	cursor: pointer;

	&:hover {
		border: 1px solid #AAA;
		color: black;
	}
`;

const Ranking = styled.span`
	color: #DDD;
	margin-right: 10px;
`;

export default function Home({ stocks }) {
	return (
		<Container>
			<Head>
				<title>Meme Stocks | Trending stocks from the wallstreetbets subreddit</title>

				<script async src="https://www.googletagmanager.com/gtag/js?id=G-E858XT1XWR"></script>

				<script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-E858XT1XWR', {
              page_path: window.location.pathname,
            });
          `,
            }}
          />
			</Head>
			<Hero>
				<h1>Meme Stocks</h1>
				<p>
					Trending stocks from the <a href="https://www.reddit.com/r/wallstreetbets/" target="_blank" rel="noreferrer">/r/wallstreetbets</a> subreddit
				</p>
			</Hero>
			<Grid>
				{stocks.map((stock, idx) => (
					<a
						key={stock.symbol.symbol}
						target="_blank"
						rel="noreferrer"
						href={`https://www.reddit.com/r/wallstreetbets/search/?q=${stock.symbol.symbol}&restrict_sr=1&sr_nsfw=k`}>
						<Card>
							<Ranking>#{idx + 1}</Ranking>
							{stock.symbol.symbol}
						</Card>
					</a>
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