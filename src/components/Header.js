import React from 'react';
import {Link} from 'react-router-dom';
import { ReactComponent as Logo } from '../img/logo.svg';
import { ReactComponent as Cogwheel } from '../img/cogwheel.svg';
import '../header.scss';

class Header extends React.Component{

    render() {
        return (
            <header className='gameHeader'>
                <Link to={{pathname: "/game"}}>
                    <Logo />
                </Link>
                <div>
                    { this.props.showUserInfo !== 'none'
                        ? <span>Hallo <strong>{localStorage.user}</strong>, jouw score: {this.props.score}</span>
                        : null
                    }
                    <Link to={{pathname: "/config"}}>
                        <Cogwheel/>
                    </Link>
                </div>
            </header>
        );
    }

}

export default Header;
