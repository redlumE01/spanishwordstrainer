import React from 'react';
import {BrowserRouter, Route, Redirect} from 'react-router-dom';
import Game from './components/Game';
import Login from './components/Login';
import Config from './components/Config';

class App extends React.Component{

    render(){
        return (
            <BrowserRouter basename="/spanishwordtrainer/">
                {localStorage.getItem('user') ? <Redirect to='/game'/> : null}
                <Route path="/" component={Login} exact/>
                <Route path="/game" component={Game} exact/>
                <Route path="/config" component={Config} exact/>
            </BrowserRouter>
        )
    }
}

export default App;