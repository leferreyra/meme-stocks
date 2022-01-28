
export default function Home({ stocks }) {
  return (
    <>
      <h1>Heyoo</h1>
      <p>{JSON.stringify(stocks)}</p>
    </>
  )
}

function getSymbolsFromTitle(title, allSymbols) {
  return title
    .split(" ")
    .reduce((symbols, word) => {
      if (word.length > 1 && (allSymbols[word] || allSymbols[`$${word}`])) {
        symbols.add(word)
      }
      return symbols;
    }, new Set())
}

function getSymbolsFromPosts(posts, allSymbols) {
  return posts
    .map(post => post.data.title)
    .filter(title => title !== title.toUpperCase())
    .reduce((symbols, title) => {
      console.log(title, getSymbolsFromTitle(title, allSymbols))
      return new Set([ ...symbols, ...getSymbolsFromTitle(title, allSymbols)])
    }, new Set())
}

async function getWSBPosts() {
  let posts = [];
  let after = null;
  for (let i = 0; i < 10; i++) {
    const page = await fetch("https://www.reddit.com/r/wallstreetbets/hot.json?limit=100" + (after ? `&after=${after}` : ""))
      .then(response => response.json())
    posts = posts.concat(page.data.children)
    after = page.data.after;
    console.log("after", after);
  }
  return posts;
}

async function getStockSymbols() {
  return fetch("https://finnhub.io/api/v1/stock/symbol?exchange=US&token=c0m7pjf48v6rkav1pd0g")
    .then(response => response.json())
    .then(items => {
      return items.reduce((symbols, item) => {
        symbols[item.symbol] = true;
        return symbols;
      }, {})
    })
}

export async function getStaticProps() {

  const symbols = await getStockSymbols();
  const posts = await getWSBPosts();

  const stocks = Array.from(getSymbolsFromPosts(posts, symbols));

  return {
    props: {
      stocks
    }
  }
}