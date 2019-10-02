import React from 'react';
import {Link} from 'react-router-dom';

class Login extends React.Component{

    constructor(){
        super();
        this.state = {
            username: ''
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.formHandler = this.formHandler.bind(this);
        this.createLocalStorage = this.createLocalStorage.bind(this);

    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    createLocalStorage() {
        localStorage.setItem("user", this.state.username);
        localStorage.setItem("userHighScore", 0);
    }

    formHandler(event) {
        event.preventDefault();
        document.querySelector('form a').click();
    }

    render(){
        return(
            <div>
                <p>Hallo, wat is je naam?</p>
                <form onSubmit={this.formHandler} autoComplete="off">
                    <input name="username" type="input" value={this.state.username} onChange={this.handleInputChange} /><br/>
                    <Link to={{pathname: "/game", state: { username: this.state.username }}} onClick={this.createLocalStorage}>klik</Link>
                </form>
            </div>
        )
    }
}

export default Login;
