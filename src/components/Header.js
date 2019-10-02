import React from 'react';

class Header extends React.Component{

    render() {

        return (
            <div>
                <header>Hallo {localStorage.user}: <br/> jouw score: {this.props.score} <br/></header>
            </div>
        );
    }

}

export default Header;
