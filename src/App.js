import React from 'react';
import axios from 'axios';
import { Route, Link, HashRouter as Router, Routes } from 'react-router-dom';

import Login from './components/Login'
import MyProfile from './components/MyProfile'

const BASE_URL = 'http://localhost:3000';

class App extends React.Component {

  // App state
  state = {
    // We store a reference to the current user. I'm going the lazy route and storing the whole user as an object.
    // Not the best way as we hold on to sensitive data like email and password digest.
    currentUser: undefined
  }

  // function to run on component mounting
  componentDidMount() {
    //This is a function that will load once when you load the website. We just want to check if the user is logged in when we visit so we'll pass in the setCurrentUser function.
    this.setCurrentUser();
  }

  // function to set the state to the current logged in user
  setCurrentUser = () => {
    //This function gets the current user from your db (if there is one)
    // We declare a token which holds a json web token 'jwt' from your local storage. (We'll set this on the login page).
    // We do an axios request to the back end and ask if we're logged in already. We pass the jwt token as an auth header to let our server validate us.
    // If our token is valid then we set the state to our current user. If not you'll see a warning in your console that you're unauthorized.

    let token = "Bearer " + localStorage.getItem("jwt");
    axios.get(`${BASE_URL}/users/current`, {
      headers: {
        'Authorization': token
      }
    })
      .then(res => {
        this.setState({ currentUser: res.data })
      })
      .catch(err => console.warn(err))
  }

  // function to log the user out
  handleLogout = () => {

    // To completely reset logged in state:
    // 1. Set state of current user to undefined.
    // 2. Remove the jwt token from local storage
    // 3. Set axios default headers to undefined.

    this.setState({ currentUser: undefined });
    localStorage.removeItem("jwt");
    axios.defaults.headers.common['Authorization'] = undefined;

  }

  render() {
    return (
      <Router>
        <header>
          <nav>
            {/* Show either logged in or logged out nav bar */}
            {
              this.state.currentUser !== undefined
                ?
                (
                  <ul>
                    <li>Welcome {this.state.currentUser.name} | </li>
                    <li><Link to="/my_profile">My Profile</Link></li>
                    <li><Link onClick={this.handleLogout} to='/'>Logout</Link></li>
                  </ul>
                )
                :
                (
                  <ul>
                    <li><Link to="/login">Login</Link></li>
                  </ul>
                )
              }
          </nav>
          <hr />
        </header>
          <Route exact path="/my_profile" component={MyProfile} />
          <Route
            exact path="/login"
            render={(props) => <Login setCurrentUser={this.setCurrentUser}{...props} />
          }
        />
      </Router>
    );//return
  }// render
} // class App

export default App;