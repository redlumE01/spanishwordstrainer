import React from 'react';
import Header from './Header';

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
        this.setState({loading: true});

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

        this.gameTimer();
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

        const isCelebration = this.state.celebratorMode;
        let celebrationMode;

        if (isCelebration) {
            celebrationMode = <h2>GEFELICITEERD!! je hebt een nieuwe highscore:<br/>{this.state.userPoints}</h2>;
        }

        switch(param) {

            case 'right':
                const runTimeOut = () => {setTimeout(this.gameContinue, 2000)};
                 return (
                    <div>
                        <Header score={this.state.userPoints}/>
                        <h1>Dat is het juiste antwoord</h1>
                        {runTimeOut()}
                     </div>
                );

            case 'wrong':

                return (
                    <div>
                        <Header score={this.state.userPoints}/>
                        <h2>Helaas dat is niet het juiste antwoord</h2>
                        <p>Het juiste antwoord was: {this.state.wordObject.answer} </p>
                        {celebrationMode}
                        <button onClick={this.gameReset}>restart game</button>
                    </div>
                );

            case 'timeout':

                return (
                    <div>
                        <Header score={this.state.userPoints}/>
                        <h2>Helaas dat is niet het juiste antwoord</h2>
                        <p>Het juiste antwoord was: {this.state.wordObject.answer} </p>
                        {celebrationMode}
                        <button onClick={this.gameReset}>restart game</button>
                    </div>
                );

            default:
                return (
                    <div>
                        <Header score={this.state.userPoints}/>
                        <div>{this.state.gameTime}</div>
                        <form onSubmit={this.checkAnswer} autoComplete="off">
                            <h2>{this.state.wordObject.question}</h2>
                            <input ref={this.focusInput} name="userInputAnswer" type="input" value={this.state.userInputAnswer} onChange={this.handleInputChange}/>
                            <br/>
                            <button>CHECK IT</button>
                        </form>
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
