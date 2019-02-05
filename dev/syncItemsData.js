const fs = require('fs');
const request = require('request');

require('es6-promise').polyfill();
require('isomorphic-fetch');

const outputDir = './src/data2.json';

const createJSON = (filepath, fileContent) => {
    fs.writeFile(filepath, fileContent, err => {
        if (err) throw err;

        console.log('The file was succesfully saved!');
    });
};

fetch('http://www.dota2.com/jsfeed/itemdata?v=4928632&l=english')
    .then(function(response) {
        if (response.status >= 400) {
            throw new Error('Bad response from server');
        }
        return response.json();
    })
    .then(function(response) {
        const data = Object.entries(response.itemdata).reduce((obj, [key, value]) => {
            if (!value.cost) return obj;
            if (value.id === 1032) return obj; // "Pocket Roshan"

            return {
                ...obj,
                [key]: value,
            };
        }, {});

        data.recipe = {
            img: 'recipe_lg.png',
            dname: 'Recipe',
            qual: 'component',
            desc: 'A recipe to build the desired item.',
            cost: 0,
            attrib: '',
            mc: 0,
            cd: 0,
            lore: 'A recipe is always necessary to craft the most mighty of objects.',
            components: null,
            created: false,
        };

        const json = JSON.stringify({ itemdata: data });

        createJSON(outputDir, json);
    });
