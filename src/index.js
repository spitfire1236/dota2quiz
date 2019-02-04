import React from 'react';
import { render } from 'react-dom';
import { getRandom } from 'utils';

import 'destyle.css';
import './main.css';
import App from './App';

if (0 && process.env.NODE_ENV !== 'production') {
    const { whyDidYouUpdate } = require('why-did-you-update'); // eslint-disable-line
    whyDidYouUpdate(React);
}

import('./data.json').then(({ default: data }) => {
    const INITIAL_DATA = Object.entries(data.itemdata).reduce((obj, [key, value]) => {
        if (!value.cost) return obj;
        if (value.id === 1032) return obj; // "Pocket Roshan"

        const image = value.img.replace(/\?\d{1,}$/, '');

        return {
            ...obj,
            [key]: {
                ...value,
                img: `/images/items/${image}`,
                webp: `/images/items/${image.replace(/\.(png|jpg)$/, '.webp')}`,
            },
        };
    }, {});

    const allItems = Object.entries(INITIAL_DATA).map(([name, value]) => ({
        ...value,
        name,
    }));
    const baseItems = allItems.filter(item => !item.created);

    const initalProps = {
        _INITIAL_POINT: 200,
        _RANDOM_ITEMS: 8,
        _GUESSES: 3,
        _ANSWER_POINT: 30,
        _INITIAL_SCORE: 0,

        baseItems,
        allItems,
        itemdata: INITIAL_DATA,
    };

    render(<App {...initalProps} />, document.querySelector('#root'));
});
