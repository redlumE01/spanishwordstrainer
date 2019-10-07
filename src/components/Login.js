import React from 'react';
import {Link} from 'react-router-dom';
import { ReactComponent as Logo } from '../img/logo.svg';

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
                <header className='content'>
                    <Logo />
                </header>
                <main className='content'>
                    <h1>Spaanse woorden oefenen</h1>
                    <p>
                        Sed semper massa eu nibh pulvinar<br/> Nam sollicitudin non est vel dignissim. Quisque non felis et odio interdum consectetur.
                    </p>
                    <form onSubmit={this.formHandler} autoComplete="off">
                        <input name="username" type="input" value={this.state.username} onChange={this.handleInputChange} /><br/>
                        <Link className='btn' to={{pathname: "/game", state: { username: this.state.username }}} onClick={this.createLocalStorage}>start</Link>
                    </form>
                </main>
                <footer></footer>
            </div>
        )
    }
}

export default Login;
