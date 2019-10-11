import React from 'react';
import Header from './Header';
import { ReactComponent as Trophy } from '../img/trophy.svg';
import '../config.scss';
import {Link} from "react-router-dom";

class Config extends React.Component{


    constructor(props) {

        super(props);

        // Convert to boolean
        let playTimedGame;
        localStorage.getItem("playTimedGame") === "true" ? playTimedGame = true : playTimedGame = false;

        this.state = {
            playTimedGame: playTimedGame,
            userName: localStorage.getItem("user")
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.formHandler = this.formHandler.bind(this);

    }

    handleInputChange(event) {
        const target = event.target;

        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    formHandler(event) {
        event.preventDefault();
        localStorage.setItem("user", this.state.userName);
        localStorage.setItem("playTimedGame", this.state.playTimedGame);

        // Button animation
        let button = event.target[2],
            buttonText = button.children[1],
            buttonTextInnerHTML = button.children[1].innerHTML;

        button.classList.toggle("saving");
        buttonText.innerHTML = 'Bezig met opslaan';

        setTimeout(function(){
            button.classList.toggle("saving");
            buttonText.innerHTML = buttonTextInnerHTML;
        }, 1000);


    }

    render(){

        return (

            <div className='default'>
                <Header showUserInfo = 'none' />
                <div className='content userCredentials'>
                    <h1>Hallo {this.state.userName}</h1>
                    <div className="highScore">
                        <Trophy/><span>Dit is jouw highscore: <strong>{localStorage.getItem("userHighScore")}</strong></span>
                    </div>
                    <p>Hieronder kun je jouw gegevens op <strong>¡Hola y Hallo!</strong> wijzigen:</p>
                    <form onSubmit={this.formHandler} autoComplete="off">
                        <label>Jouw naam:</label>
                        <input name="userName" type="input" value={this.state.userName} onChange={this.handleInputChange} />
                        <label className="container">
                            <input name="playTimedGame" type="checkbox" checked={this.state.playTimedGame} onChange={this.handleInputChange} />
                            <span className="checkmark"></span>
                            <span>Tijdslimiet instellen</span>
                        </label>
                        <button className='btn'>
                            <div className="lds-ring">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                            <span>Wijzigingen opslaan</span>
                        </button>
                    </form>
                    <Link className='btn' to={{pathname: "/game"}}>Start spel</Link>
                </div>
            </div>
        )
    }
}

export default Config;