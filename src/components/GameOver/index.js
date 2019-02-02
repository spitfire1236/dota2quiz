import React, { Component } from 'react';
import { Transition, animated } from 'react-spring';

import styles from './styles.css';

export default class GameOver extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: [],
        };
    }
    componentDidMount() {
        setTimeout(() => this.setState({ items: ['GAME OVER!'] }), 0);
        setTimeout(() => this.setState({ items: ['YOU LOSE!'] }), 2000);
        setTimeout(() => this.setState({ items: ['TRY HARD!'] }), 4000);
    }
    handleClick = () => {
        const { onClick } = this.props;

        if (onClick) onClick();
    };
    render() {
        const { score } = this.props;
        const { items } = this.state;

        const mainTexts = [
            { text: 'GAME OVER!', key: '1' },
            { text: 'YOU LOSE!', key: '2' },
            { text: 'TRY HARD!', key: '3' },
        ];

        return (
            <div className={styles.gameOver}>
                <div className={styles.flyWords}>
                    <Transition
                        items={items}
                        from={{ opacity: 0, transform: 'scale(1)' }}
                        enter={{ opacity: 1, transform: 'scale(1.5)' }}
                        leave={{ opacity: 0 }}
                    >
                        {item => props => (
                            <animated.div className={styles.gameOverTitle} style={props} children={item} />
                        )}
                    </Transition>
                </div>
                <p className={styles.gameOverScore}>Your score: {score}</p>
                <button type="button" className={styles.button} onClick={this.handleClick}>
                    Try Again...
                </button>
            </div>
        );
    }
}
