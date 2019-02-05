import React from 'react';
import { render } from 'react-dom';

import 'destyle.css';
import './main.css';
import App from './App';

if (process.env.NODE_ENV !== 'production') {
    const { whyDidYouUpdate } = require('why-did-you-update'); // eslint-disable-line
    whyDidYouUpdate(React);
}

import('./data2.json').then(({ default: data }) => {
    const allItems = Object.entries(data.itemdata).map(([name, value]) => ({
        ...value,
        name,
    }));
    const baseItems = allItems.filter(item => !item.created && item.cost);

    const initalProps = {
        _STREAK_BONUS: 0.15,
        _ANSWER_POINT: 30,
        _GUESSES: 3,
        _INITIAL_COMBO: 0,
        _INITIAL_POINT: 200,
        _RANDOM_ITEMS: 8,
        _INITIAL_SCORE: 0,

        baseItems,
        allItems,
        itemdata: data.itemdata,
    };

    render(<App {...initalProps} />, document.querySelector('#root'));
});
