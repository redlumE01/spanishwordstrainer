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
            celebratorMode : false
        };

        this.gameStart = this.gameStart.bind(this);
        this.gameReset = this.gameReset.bind(this);
        this.gameContinue = this.gameContinue.bind(this);
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

    gameStart(){

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
    }

    gameReset(){
        this.setState({
            gameState: true,
            userInputAnswer : '',
            userPoints: 0
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
        if (this.state.userInputAnswer.toLowerCase() === this.state.wordObject.answer.toLowerCase() ){
            this.setState({
                gameState : 'right',
                userPoints: this.state.userPoints + 1
            });
        }else{
            this.setState({gameState : 'wrong'});
            if (this.state.userPoints > localStorage.getItem('userHighScore')){
                localStorage.setItem("userHighScore", this.state.userPoints);
                this.setState({celebratorMode : true});
            }
        }
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({[name]: value});
    }

    renderSwitch(param) {
        switch(param) {
            case 'right':
                const runTimeOut =() => {setTimeout(this.gameContinue, 3000)};
                 return (
                    <div>
                        <Header score={this.state.userPoints}/>
                        <h1>Dat is het juiste antwoord</h1>
                        {runTimeOut()}
                     </div>
                );
            case 'wrong':

                const isCeleBration = this.state.celebratorMode;
                let celebrationMode;

                if (isCeleBration) {
                    celebrationMode = <h2>GEFELICITEERD!! je hebt een nieuwe highscore:<br/>{this.state.userPoints}</h2>;
                }

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
                        <form onSubmit={this.checkAnswer} autoComplete="off">
                            <h2>{this.state.wordObject.question}</h2>
                            <input name="userInputAnswer" type="input" value={this.state.userInputAnswer} onChange={this.handleInputChange}/>
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
