import React from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { Table, Form, FormGroup, Label, Input, Col, Button, Collapse, Navbar, NavLink, NavbarToggler, NavbarBrand, Nav, NavItem, Container, Row, Media} from 'reactstrap'

class Menu extends React.Component {
  constructor (props) {
    super(props)
    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    return(
      <div>
        <Navbar color="dark" dark expand='md'>
          <NavbarBrand className='text-white'>Software Anecdotes</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className='ml-auto' navbar>
              <NavItem>
                <NavLink tag={Link} to="/anecdotes" className='text-white'>anecdotes</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/new" className='text-white'>add new</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/about" className='text-white'>about</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    )
  }
}

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h3>List of anecdotes</h3>
    <Table striped>
      <tbody>
        {anecdotes.map(anecdote =>
          <tr key={anecdote.id} >
            <td>
              <Link to={`/anecdotes/${anecdote.id}`} key={anecdote.id}>
                {anecdote.content}
              </Link>
            </td>
            <td>
              {anecdote.author}
            </td>
          </tr>
        )}
      </tbody>  
    </Table>
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
  <Container>
    <Row>
      <Col>
        <h3>About the Anecdote app</h3>
      </Col>
    </Row>
    <Row>
      <Col>   
        <p>According to Wikipedia:</p>
        
        <em>An anecdote is a brief, revealing account of an individual person or an incident. 
          Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself, 
          such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative. 
          An anecdote is "a story with a point."</em>

        <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
      </Col>
      <Col md='auto'>
        <Media object src='https://upload.wikimedia.org/wikipedia/commons/5/50/NicoBZH_-_Richard_Stallman_%28by-sa%29_%289%29.jpg' style={{width: 200}}/>
      </Col>
    </Row>
  </Container>
)

const Footer = () => (
  <div>
    <h6>
      Anecdote app made totally by me.

      See <a href='https://github.com/mluukkai/routed-anecdotes'>github</a> for the source code. 
    </h6>
  </div>
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
        <div><h3>Create a new anecdote</h3></div>
        <Form>
          <FormGroup row>
            <Label for='content' sm={2}>Anecdote</Label>
            <Col sm={5}>
              <Input type='textarea' name='content' id='content' onChange={this.handleChange}/>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for='author' sm={2}>Author</Label>
            <Col sm={5}>
              <Input type='text' name='author' id='author' onChange={this.handleChange}/>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for='url' sm={2}>Url</Label>
            <Col sm={5}>
              <Input type='text' name='url' id='url' onChange={this.handleChange}/>
            </Col>
          </FormGroup>
          <FormGroup check row>
            <Col sm={{ size: 10, offset: 2 }}>
              <Button onClick={this.handleSubmit}>Submit</Button>
            </Col>
          </FormGroup>
          
        </Form>
      </div>  
    )

  }
}

const notificationStyle = {
  color: 'green',
  fontStyle: 'italic',
  fontSize: 16,
  borderStyle: 'solid',
  borderColor: 'green',
  borderRadius: 5,
  borderWidth: 2,
  padding: 10,
  display: 'inline-block'


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
      <div className='container'>
        <Router>
          <div>
              <Menu /><br />
              <Route exact path='/' render={() => <AnecdoteList anecdotes={this.state.anecdotes} />} />
              <Route exact path='/anecdotes' render={() => <AnecdoteList anecdotes={this.state.anecdotes} />} />
              {this.state.notification !== '' && <div style={notificationStyle}>{this.state.notification}</div> }
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
