import React from 'react'
import { getArticles, fetchArticles } from './api'
import ArticleList from './components/articlesList'
import SearchBar from './components/searchBar'
import { Container, Header } from 'semantic-ui-react'

class App extends React.Component {
  state = {
    articles: [],
    searchTopic: '',
    totalResults: '',
    loading: false,
    apiError: '',
    page: 0,
  }

  searchForTopic = async (topic) => {
    if (!this.state.loading) {
      try {
        this.setState({ loading: true })
        let { page } = this.state
        const response = await fetchArticles(topic, page + 1)
        this.setState({
          articles: [...this.state.articles, ...response.articles],
          page: page + 1,
          searchTopic: topic,
          totalResults: response.totalResults,
        })
      } catch (error) {
        this.setState({ apiError: 'Could not find any articles' })
      }
      this.setState({ loading: false })
    }
  }

  render() {
    const {
      articles,
      apiError,
      loading,
      searchTopic,
      totalResults,
    } = this.state
    return (
      <Container>
        <Header as='h2' style={{ textAlign: 'center', margin: 20 }}>
          Search for a topic
        </Header>
        <SearchBar searchForTopic={this.searchForTopic} />
        <p style={{ textAlign: 'center' }}>
          Powered by <a href='https://newsapi.org/'>NewsAPI.org</a>
        </p>
        {loading && (
          <p style={{ textAlign: 'center' }}>Searching for articles...</p>
        )}
        {articles.length > 0 && (
          <Header as='h4' style={{ textAlign: 'center', margin: 20 }}>
            Found {totalResults} articles on "{searchTopic}"
          </Header>
        )}
        {articles.length > 0 && <ArticleList articles={articles} />}
        {apiError && <p>Could not fetch any articles. Please try again.</p>}
      </Container>
    )
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll.bind(this))
    return () => window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll() {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
      document.documentElement.offsetHeight
    )
      return
    console.log('Fetch more list items!')
    this.searchForTopic(this.state.topic)
  }
}

export default App
