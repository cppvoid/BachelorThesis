import React, { Component } from 'react'
import { Route, Switch, Router } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import './App.css'

import Categories from './Categories'
import Notes from './Notes'

class App extends Component {
  render() {
    const history = createBrowserHistory()
		return (
			<Router history={history}>
						<Switch>
							<Route exact path='/' component={Categories} />
							<Route exact path='/category/:id' component={Notes} />
						</Switch>
			</Router>
		)
  }
}

export default App
