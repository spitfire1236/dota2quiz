import React, { Component } from 'react';

import styles from './styles.css';
import placeholder from './images/item_slot_unknown.png';

export default class Item extends Component {
    handleClick = () => {
        const { onClick, name } = this.props;

        if (onClick) onClick(name);
    };
    render() {
        const { dname, img } = this.props;

        return (
            <div className={styles.inner} onClick={this.handleClick}>
                <img src={img || placeholder} alt={dname} title={dname} />
            </div>
        );
    }
}
