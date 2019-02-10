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
    // add recipe
    const itemdata = Object.entries(data.itemdata).reduce((obj, [key, value]) => {
        if (value.components) {
            const recipe = value.components.some((name, index) => /recipe/.test(name));

            if (recipe) {
                const newComponents = recipe
                    ? value.components.filter(name => !/recipe/.test(name))
                    : value.components;

                return {
                    ...obj,
                    [key]: {
                        ...value,
                        components: [...newComponents, 'recipe'],
                    },
                };
            } else {
                const componentsCost = value.components.reduce((sum, name) => {
                    const item = data.itemdata[name];
                    const cost = item ? item.cost : 0;

                    return sum + cost;
                }, 0);

                if (componentsCost !== value.cost) {
                    return {
                        ...obj,
                        [key]: {
                            ...value,
                            components: [...value.components, 'recipe'],
                        },
                    };
                }
            }
        }

        return {
            ...obj,
            [key]: value,
        };
    }, {});

    const allItems = Object.entries(itemdata).map(([name, value]) => ({
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
        itemdata,
    };

    render(<App {...initalProps} />, document.querySelector('#root'));
});
