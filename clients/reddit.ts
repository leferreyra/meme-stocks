import Axios from 'axios';
import pick from 'lodash.pick';

const BASE_URL = "https://www.reddit.com"

type GetSubredditPageParams = {
	subreddit: string;
	listing: 'hot' | 'top' | 'latest';
	limit?: number;
	after?: string;
}

type GetSubredditPageResponse = {
	data: {
		after?: string;
		children: Array<PostResponse>
	}
}

export type PostResponse = {
	data: {
		title: string;
		score: number;
		num_comments: number;
	}
}

export async function getSubredditPage({ listing = 'hot', limit = 100, after }: GetSubredditPageParams): Promise<GetSubredditPageResponse> {
	return Axios.get(`${BASE_URL}/r/wallstreetbets/${listing}.json`, {
		params: {
			limit,
			...(after ? { after } : {})
		}
	}).then(response => response.data)
}

type GetSubredditPagesParams = Omit<GetSubredditPageParams, 'after'> & {
	pages?: number;
}

type GetSubredditPagesResponse = Array<PostResponse>;

export async function getSubredditPages({ pages = 10, ...rest }: GetSubredditPagesParams): Promise<GetSubredditPagesResponse> {
	let posts = [], after;
	
	for (let i = 0; i < pages; i++) {
		const { data } = await getSubredditPage({ ...rest, after });
		
		posts = posts.concat(data.children)
		
		if (!data.after) {
			break;
		}
		
		after = data.after;
	}
	
	return posts.map(post => ({
		data: pick(post.data, ['title', 'score', 'num_comments'])
	}));
}
