import React, { Component } from 'react';

import classNames from 'classnames/bind';

import styles from './styles.css';
const cx = classNames.bind(styles);

export default class Tooltip extends Component {
    state = {
        show: false,
    };
    handleMouseEnter = () => {
        this.setState({
            show: true,
        });
    };
    handleMouseOver = () => {
        this.setState({
            show: false,
        });
    };
    render() {
        const { children, tooltip } = this.props;
        const { show } = this.state;
        const tooltipClassName = cx(styles.tooltip, {
            show,
        });

        return (
            <div className={styles.wrapper}>
                <div onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseOver}>
                    {children}
                </div>
                <div className={tooltipClassName}>
                    <div>{tooltip}</div>
                </div>
            </div>
        );
    }
}
