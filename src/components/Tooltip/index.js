import React, { Component } from 'react';

import classNames from 'classnames/bind';

import styles from './styles.css';
const cx = classNames.bind(styles);

export default class Tooltip extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { children, tooltip } = this.props;

        return (
            <div className={style.wrapper}>
                {children}
                <div className={style.tooltip}>
                    <div>{tooltip}</div>
                </div>
            </div>
        );
    }
}
