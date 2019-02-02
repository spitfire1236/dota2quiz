const fs = require('fs');
const request = require('request');

const json = require('../src/data.json');

Object.values(json.itemdata).forEach((item, index) => {
    const image = item.img.replace(/\?\d{1,}$/, '');

    request(`http://cdn.dota2.com/apps/dota2/images/items/${image}`)
        .pipe(fs.createWriteStream(`./public/images/items/${image}`))
        .on('close', () => console.log('Done 👻'));
});
