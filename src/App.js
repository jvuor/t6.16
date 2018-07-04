import React from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

const Menu = () => (
  <div>    
    <Link to="/">anecdotes</Link>|
    <Link to="/new">add new</Link>|
    <Link to="/about">about</Link>
  </div>
)

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map(anecdote => 
        <Link to={`/anecdotes/${anecdote.id}`} key={anecdote.id}>
          <li key={anecdote.id} >{anecdote.content}</li>
        </Link>
      )}
    </ul>  
  </div>
)

const AnecdoteView = ({ anecdote }) => (
  <div>
    <h3>{anecdote.content}</h3>
    <p>by {anecdote.author} <br />
    see <a href={`${anecdote.info}`}>{anecdote.info}</a> for more info</p>
  </div>
)

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>
    
    <em>An anecdote is a brief, revealing account of an individual person or an incident. 
      Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself, 
      such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative. 
      An anecdote is "a story with a point."</em>

    <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
  </div>
)

const Footer = () => (
  <h6>
    Anecdote app made totally by me.

    See <a href='https://github.com/mluukkai/routed-anecdotes'>github</a> for the source code. 
  </h6>
)

class CreateNew extends React.Component {
  constructor() {
    super()
    this.state = {
      content: '',
      author: '',
      info: '',
    }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.addNew({
      content: this.state.content,
      author: this.state.author,
      info: this.state.info,
      votes: 0
    })
    this.props.notify(`added new anecdote "${this.state.content}"`)
    this.props.history.push('/')    
  }

  render() {
    return(
      <div>
        <h2>create a new anecdote</h2>
        <form onSubmit={this.handleSubmit}>
          <div>
            content 
            <input name='content' value={this.state.content} onChange={this.handleChange} />
          </div>
          <div>
            author
            <input name='author' value={this.state.author} onChange={this.handleChange} />
          </div>
          <div>
            url for more info
            <input name='info' value={this.state.info} onChange={this.handleChange} />
          </div> 
          <button>create</button>
        </form>
      </div>  
    )

  }
}

class App extends React.Component {
  constructor() {
    super()

    this.state = {
      anecdotes: [
        {
          content: 'If it hurts, do it more often',
          author: 'Jez Humble',
          info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
          votes: 0,
          id: '1'
        },
        {
          content: 'Premature optimization is the root of all evil',
          author: 'Donald Knuth',
          info: 'http://wiki.c2.com/?PrematureOptimization',
          votes: 0,
          id: '2'
        }
      ],
      notification: ''
    } 

    this.timer = null
  }

  addNew = (anecdote) => {
    anecdote.id = (Math.random() * 10000).toFixed(0)
    this.setState({ anecdotes: this.state.anecdotes.concat(anecdote) })
  }

  notify = async (message) => {
    this.setState({notification: message})
    if (this.timer === null) { clearTimeout(this.timer)}
    this.timer = setTimeout(() => {
      this.setState({notification: ''})
    }, 5000)
  }

  anecdoteById = (id) =>
    this.state.anecdotes.find(a => a.id === id)

  vote = (id) => {
    const anecdote = this.anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    const anecdotes = this.state.anecdotes.map(a => a.id === id ? voted : a)

    this.setState({ anecdotes })
  }

  render() {
    return (
      <div>
        <Router>
          <div>
            <h1>Software anecdotes</h1>
              <Menu />
              <Route exact path='/' render={() => <AnecdoteList anecdotes={this.state.anecdotes} />} />
              <Route exact path='/anecdotes' render={() => <AnecdoteList anecdotes={this.state.anecdotes} />} />
              {this.state.notification !== '' && <div>{this.state.notification}</div> }
              <Route path='/anecdotes/:id' render={({match}) => <AnecdoteView anecdote={this.anecdoteById(match.params.id)} />} />
              <Route path='/about' render={() => <About />} />
              <Route path='/new' render={({history}) => <CreateNew addNew={this.addNew} history={history} notify={this.notify} />} />

          </div>
        </ Router>
        <Footer />
      </div>
    );
  }
}

export default App;
