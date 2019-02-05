import React, { PureComponent } from 'react';
import classnames from 'classnames/bind';

import styles from './styles.css';
import placeholder from './images/item_slot_unknown.png';

const cx = classnames.bind(styles);

export default class Item extends PureComponent {
    static defaultProps = {
        disabled: false,
    };

    handleClick = () => {
        const { onClick, name } = this.props;

        if (onClick) onClick(name);
    };

    render() {
        const { dname, img, disabled } = this.props;
        const innerClassName = cx(styles.inner, {
            disabled,
        });

        return (
            <div className={innerClassName} onClick={this.handleClick}>
                <img src={`/images/items/${img}` || placeholder} alt={dname} title={dname} />
            </div>
        );
    }
}
