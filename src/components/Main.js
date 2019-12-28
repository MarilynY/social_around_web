import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Register } from './Register';
import { Login } from './Login';
import { Home } from './Home';


export class Main extends React.Component {
    getLogin = () => {
        return this.props.isLoggedIn ? 
            <Redirect to="/home" /> : 
            <Login handleLogin={this.props.handleLogin}/>
    }

    getHome = () => {
        return this.props.isLoggedIn ?
            <Home /> :
            <Redirect to="/Login" />
    }
    render() {
        return(
            <div className="main">
                {/* use Switch to render the first match component */}
                <Switch>
                    <Route exact path="/" render={this.getLogin}/>
                    <Route path="/register" component={Register}/>
                    <Route path="/login" render={this.getLogin}/>
                    <Route path="/home" render={this.getHome}/>
                    {/* render Login component if all pathes above did not match */}
                    <Route render={this.getLogin}/>
                </Switch>
            </div>
        );
    }
}