import React from 'react';
import { render } from 'react-dom';
import { getRandom } from 'utils';

import 'destyle.css';
import './main.css';
import App from './App';

import('./data.json').then(({ default: data }) => {
    const INITIAL_DATA = Object.entries(data.itemdata).reduce((obj, [key, value]) => {
        if (!value.cost) return obj;
        if (value.id === 1032) return obj; // "Pocket Roshan"

        return {
            ...obj,
            [key]: {
                ...value,
                img: `/images/items/${value.img}`,
            },
        };
    }, {});

    const allItems = Object.entries(INITIAL_DATA).map(([name, value]) => ({
        ...value,
        name,
    }));
    const baseItems = allItems.filter(item => !item.created);

    // get random item by index and return id
    // u can set id of item
    const createdItems = allItems.filter(item => item.created && item.components);
    const allIdsCreatedItems = createdItems.map(item => item.id);
    const randomIndex = getRandom(allIdsCreatedItems.length);
    const randomId = 214 || allIdsCreatedItems[randomIndex];
    const randomItem = createdItems.find(item => item.id === randomId);

    const initalProps = {
        _INITIAL_POINT: 200,
        _RANDOM_ITEMS: 8,
        _GUESSES: 3,
        _ANSWER_POINT: 30,
        _INITIAL_SCORE: 0,

        baseItems,
        allItems,
        randomItem,
        itemsWithComponents: createdItems,
        itemdata: INITIAL_DATA,
    };

    render(<App {...initalProps} />, document.querySelector('#root'));
});
