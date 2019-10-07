import React from 'react';
import Header from './Header';
import '../game.scss';

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
                        <main className='gameInterface'>
                            <h1>Dat is het juiste antwoord</h1>
                        </main>
                        {runTimeOut()}
                     </div>
                );

            case 'wrong':

                return (
                    <div>
                        <Header score={this.state.userPoints}/>
                        <main className='gameInterface'>
                            <h2>Helaas dat is niet het juiste antwoord</h2>
                            <p>Het juiste antwoord was: {this.state.wordObject.answer} </p>
                            {celebrationMode}
                            <button onClick={this.gameReset}>restart game</button>
                        </main>
                    </div>
                );

            case 'timeout':

                return (
                    <div>
                        <Header score={this.state.userPoints}/>
                        <main className='gameInterface'>
                            <h2>Helaas dat is niet het juiste antwoord</h2>
                            <p>Het juiste antwoord was: {this.state.wordObject.answer} </p>
                            {celebrationMode}
                            <button onClick={this.gameReset}>restart game</button>
                        </main>
                    </div>
                );

            default:
                const cssTimerStyle = 'timer-' + this.state.gameTime;
                return (
                    <div>
                        <Header score={this.state.userPoints}/>
                        <main className='gameInterface'>

                            <div className='timer'>
                                { this.state.gameTime === ''
                                    ? <span className='timer load'>
                                        <svg viewBox="0 0 250 250">
                    <g>
                    <path d="M244.68,174.957c1.2,1.92,1.801,4.56,1.801,7.92c0,6.239-1.523,11.201-4.561,14.88c-15.84,19.361-32.723,29.04-50.64,29.04
                    c-15.521,0-27.923-6-37.2-18c-9.281-12-13.92-29.197-13.92-51.601c0-5.438,0.24-10.878,0.72-16.319
                    c-10.56,1.92-22.08,3.359-34.56,4.319c-8.321,0.642-14.003,1.043-17.041,1.2c-3.202,16.32-7.68,36.322-13.44,60
                    c-3.36,13.92-9.761,20.88-19.2,20.88c-10.241,0-15.36-4.639-15.36-13.92c0-2.077,0.398-4.957,1.2-8.64
                    c5.438-21.919,9.757-40.478,12.96-55.68l-11.52,0.479c-5.28,0-9.12-0.919-11.52-2.76c-2.4-1.838-3.6-4.838-3.6-9
                    c0-5.28,1.519-9.157,4.56-11.641c3.038-2.479,8.078-3.877,15.12-4.199l12.72-0.48c4.159-22.56,6.24-39.757,6.24-51.6
                    c0-7.519-1.121-12.638-3.36-15.36c-2.243-2.719-5.201-4.08-8.88-4.08c-11.202,0-23.843,9.36-37.92,28.08
                    c-2.081,2.723-4.402,4.08-6.96,4.08c-2.242,0-4.162-1.039-5.76-3.12c-1.598-2.077-2.4-4.717-2.4-7.92c0-4.958,2.002-10.237,6-15.84
                    c7.039-9.758,15.918-17.797,26.64-24.12c10.718-6.319,21.6-9.48,32.64-9.48c10.399,0,18.439,3.562,24.12,10.68
                    c5.677,7.121,8.52,18.202,8.52,33.24c0,13.283-1.92,31.283-5.76,54l23.52-1.2c10.08-0.48,18.72-1.279,25.92-2.4
                    c2.88-17.599,7.279-34.08,13.2-49.44c5.918-15.36,13.278-27.84,22.08-37.44c8.798-9.6,18.638-14.4,29.52-14.4
                    c7.999,0,14.318,3.161,18.96,9.48c4.64,6.322,6.961,14.603,6.961,24.84c0,39.683-20.243,67.2-60.721,82.561
                    c-0.479,6.4-0.72,13.042-0.72,19.92c0,16.8,2.077,28.721,6.24,35.76c4.158,7.042,9.997,10.56,17.52,10.56
                    c6.559,0,12.559-1.717,18-5.159c5.438-3.439,11.599-9.319,18.48-17.641c1.92-2.238,4.08-3.359,6.479-3.359
                    C241.838,172.077,243.48,173.037,244.68,174.957z M196.2,45.597c-3.923,6.401-7.643,15.12-11.16,26.16
                    c-3.521,11.04-6.322,23.122-8.4,36.24c12.799-5.28,22.238-12.799,28.32-22.561c6.079-9.757,9.12-22.32,9.12-37.68
                    c0-3.679-0.642-6.559-1.92-8.64c-1.282-2.078-2.88-3.12-4.8-3.12C203.839,35.997,200.119,39.199,196.2,45.597z"/>
                    </g>
                    </svg>
                                    </span>
                                    : <span className={cssTimerStyle}>{this.state.gameTime}</span>
                                }
                            </div>

                            <form onSubmit={this.checkAnswer} autoComplete="off">
                                <h2>{this.state.wordObject.question}</h2>
                                <input ref={this.focusInput} name="userInputAnswer" type="input" value={this.state.userInputAnswer} onChange={this.handleInputChange}/>
                                <br/>
                                <button>CHECK IT</button>
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
