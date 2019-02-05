import React, { Component } from 'react';

import ItemTooltip from 'components/ItemTooltip';

export default class Items extends Component {
    render() {
        const { allItems, itemdata } = this.props;

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)' }}>
            {allItems.length &&
                allItems.map(({ components, id, img, ...props }) => {
                    const builds = components ? components.map(item => itemdata[item]).filter(Boolean) : [];

                    return <ItemTooltip {...props} key={id} img={img} builds={builds} />;
                })}
        </div>;
    }
}
