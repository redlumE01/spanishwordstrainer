import React from 'react';
import Header from './Header';
import '../game.scss';
import { ReactComponent as Loadertime } from '../img/timer_load.svg';
import { ReactComponent as Smileysad } from '../img/sad.svg';
import { ReactComponent as Smileysmile } from '../img/smile.svg';

class Game extends React.Component{

    constructor() {
        super();

        this.state = {
            loading: false,
            wordBank: {},
            wordObject: {
                question: '',
                answer: ''
            },
            userInputAnswer: '',
            userPoints: 0,
            gameState: 'default',
            gameTime: '',
            celebratorMode : false
        };

        this.gameStart = this.gameStart.bind(this);
        this.gameReset = this.gameReset.bind(this);
        this.gameContinue = this.gameContinue.bind(this);
        this.gameTimer = this.gameTimer.bind(this);
        this.gameCelebrationCheck = this.gameCelebrationCheck.bind(this);

        this.checkAnswer = this.checkAnswer.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);

    }

    componentDidMount() {

        // Loading state
        this.setState({loading: true});
        this._isMounted = true;

        fetch("https://www.redlum-media.com/swtdata/public/_/items/wordbank")
            .then(response => response.json())
            .then(data => {

                this.setState({
                    loading: false,
                    wordBank: data
                });

                this.gameStart();
        });

        // Fill localstorage data

        if (!localStorage.user){
            localStorage.setItem("user", "gast_" + Math.floor(Math.random() * 999));
            localStorage.setItem("userHighScore", 0);
            localStorage.setItem("playTimedGame", false);
        }
    }

    focusInput = (component) => {
        if (component) {
            component.focus();
        }
    };

    gameStart(){

        // Get the Word Object
        const wordObject = this.state.wordBank.data[Math.floor(Math.random() *this.state.wordBank.data.length)];

        // Clear user input
        if (this.state.userInputAnswer){this.setState({userInputAnswer : ''})}

        if (Math.floor(Math.random() * 2) > 0){
            this.setState({
                wordObject : {
                    question: wordObject.spaans,
                    answer: wordObject.nederlands
                }
            });
        }else {
            this.setState({
                wordObject : {
                    question: wordObject.nederlands,
                    answer: wordObject.spaans
                }
            });
        }

        // Timed Game

        if ( localStorage.getItem("playTimedGame") === "true"){
            this.gameTimer();
        }

    }

    gameTimer(){

        let counter = 10;

        const gameCountDown = setInterval(
            () => {
                this.setState({gameTime : counter});
                 counter--;
                 if (counter < 0) {
                     this.setState({gameTime : 0});
                     clearInterval(gameCountDown);
                     this.setState({gameState : 'timeout'});
                     this.gameCelebrationCheck();
                 }
            }, 1000);

    }

    gameReset(){
        this.setState({
            gameState: 'default',
            userInputAnswer : '',
            userPoints: 0,
            celebratorMode: false,
            gameTime: ''
        });
        this.gameStart();
    }

    gameContinue(){

        this.setState({
            gameState: 'default',
            userInputAnswer : ''
        });

        this.gameStart();
    }

    checkAnswer(event){
        event.preventDefault();

        // Clear the undefined GameTimer & reset game Time

        (() => {
            for (var i = 1; i < 99999; i++)window.clearInterval(i);
            this.setState({gameTime: ''});
        })();

        // Checks the answer in lowercase

        if (this.state.userInputAnswer.toLowerCase() === this.state.wordObject.answer.toLowerCase() ){
            this.setState({
                gameState : 'right',
                userPoints: this.state.userPoints + 1
            });
        }else{
            this.setState({gameState : 'wrong'});
            this.gameCelebrationCheck();
        }
    }

    gameCelebrationCheck(){
        if (this.state.userPoints > Number(localStorage.getItem('userHighScore'))){
            localStorage.setItem("userHighScore", this.state.userPoints);
            this.setState({celebratorMode : true});
        }
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({[name]: value});
    }

    renderSwitch(param) {

        // new HighScore

        const isCelebration = this.state.celebratorMode;
        let celebrationMode;

        if (isCelebration === true) {
            celebrationMode = <div><h2>Gefeliciteerd!</h2>Je hebt een nieuwe highscore:<br/><strong>{this.state.userPoints}</strong></div>;
        }

        switch(param) {

            case 'right':
                const runTimeOut = () => {setTimeout(this.gameContinue, 2000)};
                 return (
                    <div className={param}>
                        <Header score={this.state.userPoints}/>
                        <main className='content'>
                            <Smileysmile />
                            <h2>Dat is het juiste antwoord</h2>
                        </main>
                        {runTimeOut()}
                     </div>
                );

            case 'wrong':

                return (
                    <div className={param}>
                        <Header score={this.state.userPoints}/>
                        <main className='content'>
                            <Smileysad />
                            <h2>Helaas is dat niet het juiste antwoord</h2>
                            <p>Het juiste antwoord was: <br/> <strong>{this.state.wordObject.answer}</strong></p>
                            {celebrationMode}
                            <button onClick={this.gameReset} className='btn'>restart game</button>
                        </main>
                    </div>
                );

            case 'timeout':

                return (
                    <div className={param}>
                        <Header score={this.state.userPoints}/>
                        <main className='content'>
                            <h2>Helaas dat is niet het juiste antwoord</h2>
                            <p>Het juiste antwoord was: {this.state.wordObject.answer} </p>
                            {celebrationMode}
                            <button onClick={this.gameReset} className='btn'>restart game</button>
                        </main>
                    </div>
                );

            default:
                const cssTimerStyle = 'timer-' + this.state.gameTime;
                return (
                    <div className={param}>
                        <Header score={this.state.userPoints}/>
                        <main className='content'>

                            <div className='timer'>
                                { this.state.gameTime === ''
                                    ? <span className='timer load'><Loadertime /></span>
                                    : <span className={cssTimerStyle}>{this.state.gameTime}</span>
                                }
                            </div>

                            <form onSubmit={this.checkAnswer} autoComplete="off">
                                <h2>{this.state.wordObject.question}</h2>
                                <input ref={this.focusInput} name="userInputAnswer" type="input" value={this.state.userInputAnswer} onChange={this.handleInputChange}/>
                                <br/>
                                <button className='btn'>controleer</button>
                            </form>
                        </main>
                    </div>
                );
        }
    }

    render() {
        return (
            <div>
                {this.renderSwitch(this.state.gameState)}
            </div>
        );
    }

}

export default Game;
