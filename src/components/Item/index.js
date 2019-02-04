import React, { Component } from 'react';

import styles from './styles.css';
import placeholder from './images/item_slot_unknown.png';

export default class Item extends Component {
    handleClick = () => {
        const { onClick, name } = this.props;

        if (onClick) onClick(name);
    };
    render() {
        const { dname, img, webp } = this.props;

        return (
            <div className={styles.inner} onClick={this.handleClick}>
                <picture className={styles.image}>
                    <source srcSet={webp} type="image/webp" />
                    <img srcSet={img} alt={dname} title={dname} />
                </picture>
            </div>
        );
    }
}
