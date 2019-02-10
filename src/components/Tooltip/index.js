import React, { PureComponent } from 'react';
import classNames from 'classnames/bind';
import ItemTooltip from 'components/ItemTooltip';

import styles from './styles.css';
const cx = classNames.bind(styles);

export default Trigger => {
    return class Tooltip extends PureComponent {
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
            const { show } = this.state;
            const tooltipClassName = cx(styles.tooltip, {
                show,
            });

            return (
                <div className={styles.wrapper} onMouseLeave={this.handleMouseOver}>
                    <div onMouseEnter={this.handleMouseEnter}>
                        <Trigger {...this.props} />
                    </div>
                    <div className={tooltipClassName}>
                        <ItemTooltip {...this.props} />
                    </div>
                </div>
            );
        }
    };
};
