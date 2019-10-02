import React from 'react';
import Header from './Header';
import Game from './Game';

class GameInterface extends React.Component{

    render() {
        return (
            <div>
                <Header/>
                <Game/>
            </div>
        );
    }

}

export default GameInterface;
