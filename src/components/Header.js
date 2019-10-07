import React from 'react';
import '../header.scss';

class Header extends React.Component{

    render() {
        return (
            <header className='gameHeader'>
                Hallo <strong>{localStorage.user}</strong>,  jouw score: {this.props.score} <br/>
            </header>
        );
    }

}

export default Header;
