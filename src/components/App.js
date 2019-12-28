import React from 'react';
import '../styles/App.css';
import { TopBar } from './TopBar';
import { Main } from './Main';
import { TOKEN_KEY } from '../constants';


class App extends React.Component {
  state = {
    // isLoggedIn: localStorage.getItem(TOKEN_KEY) ? true : false
    isLoggedIn: !!localStorage.getItem(TOKEN_KEY)
  }
  //callback function
  handleLogin = (token) => {
    this.setState({isLoggedIn: true});
    localStorage.setItem(TOKEN_KEY, token);
  }
  //callback function
  handleLogout = () => {
    this.setState({isLoggedIn: false});
    localStorage.removeItem(TOKEN_KEY);
  }
  render() {
    return (
      <div className="App">
        {/* Test callback function and state change */}
        {/* {this.state.isLoggedIn ? 'login' : 'logout'} 
        <button onClick={this.state.isLoggedIn ? this.handleLogout : this.handleLogin}>flip</button> */}
        <TopBar isLoggedIn={this.state.isLoggedIn} handleLogout={this.handleLogout}/>
        <Main isLoggedIn={this.state.isLoggedIn} handleLogin={this.handleLogin}/>
      </div>
    );
  }
}

export default App;
