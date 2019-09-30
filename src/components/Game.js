import React from 'react';

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
            gameState: 'default'
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
                        {runTimeOut()}
                        <h1>OOWWW!! JAAA  WIJNEN WIJNEN</h1>
                        <iframe title="funny" src="https://giphy.com/embed/fVnMLhKljkVGlAim8t" width="180" height="180" frameBorder="0" className="giphy-embed" allowFullScreen></iframe><br/>
                     </div>
                );
            case 'wrong':
                return (
                    <div>
                        <h2>NEEE--heee dat is  FOUHOOOUTT!!</h2>
                        <iframe title="wrong" src="https://giphy.com/embed/h6ZKeVAcN8fTe2Axdr" width="240" height="240" frameBorder="0" className="giphy-embed" allowFullScreen></iframe>
                        <p>Het juiste antwoord was: {this.state.wordObject.answer} </p>
                        <button onClick={this.gameReset}>restart game</button>
                    </div>
                );
            default:
                return (
                    <div>
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
                <header>jouw score: {this.state.userPoints}</header>
                {this.renderSwitch(this.state.gameState)}
            </div>
        );
    }

}

export default Game;
