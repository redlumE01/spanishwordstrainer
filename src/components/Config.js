import React from 'react';
import Header from './Header';
import { ReactComponent as Trophy } from '../img/trophy.svg';
import '../config.scss';

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
    }

    render(){

        return (

            <div className='default'>
                <Header showUserInfo = 'none' />
                <div className='content userCredentials'>
                    <h1>Hallo {this.state.userName}</h1>
                    <p>Dit is jouw highscore:</p>
                    <div className='highScore'>
                        <div>
                            <Trophy/><span>{localStorage.getItem("userHighScore")}</span>
                        </div>
                    </div>
                    <p>Hieronder kun je jouw gegevens op <strong>¡Hola y Hallo!</strong> wijzigen.</p>
                    <form onSubmit={this.formHandler}>
                        <label>Jouw naam:</label>
                        <input name="userName" type="input" value={this.state.userName} onChange={this.handleInputChange} />
                        <label className="container">
                            <input name="playTimedGame" type="checkbox" checked={this.state.playTimedGame} onChange={this.handleInputChange} />
                            <span className="checkmark"></span>
                            <span>Spelen met tijdslimiet</span>
                        </label>
                        <button className='btn'>Wijzigingen opslaan</button>
                    </form>
                </div>
            </div>
        )
    }
}

export default Config;