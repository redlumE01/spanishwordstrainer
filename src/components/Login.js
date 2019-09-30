import React from 'react';

class Login extends React.Component{

    constructor(){
        super();
        this.state = {
            username: ''
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.formHandler = this.formHandler.bind(this);
    }

    handleInputChange(event) {
        // object destructuring
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    formHandler(event) {
        event.preventDefault();
        console.log(this.state);
    }

    render(){
        return(
            <div>
                <p>Hallo, wat is je naam?</p>
                <form onSubmit={this.formHandler}>
                    <input name="username" type="input" value={this.state.username} onChange={this.handleInputChange} /><br/>
                    <button>Start</button>
                </form>
            </div>
        )
    }
}

export default Login;
