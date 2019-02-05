const fs = require('fs');
const rimraf = require('rimraf');
const request = require('request');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const imageminWebp = require('imagemin-webp');

const json = require('../src/data2.json');

const dir = './public/source';
const output = './public/images/items';

if (fs.existsSync(output)) {
    rimraf.sync(output);
}

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

Object.values(json.itemdata).forEach((item, index, array) => {
    const image = item.img.replace(/\?\d{1,}$/, '');

    request(`http://cdn.dota2.com/apps/dota2/images/items/${image}`)
        .pipe(fs.createWriteStream(`${dir}/${image}`))
        .on('close', test => {
            if (index === array.length - 1) {
                console.log('download complete');

                setTimeout(() => {
                    Promise.all([
                        imagemin([`${dir}/*.{jpg,png}`], output, {
                            plugins: [
                                imageminJpegtran({
                                    progressive: true,
                                }),
                                imageminPngquant({
                                    quality: [0.75, 0.8],
                                }),
                            ],
                        }),
                        // imagemin([`${dir}/*.{jpg,png}`], output, {
                        //     use: [imageminWebp()],
                        // }),
                        // imagemin([`${dir}/*.{png}`], output, {
                        //     use: [imageminWebp({ lossless: true })],
                        // }),
                    ])
                        .then(() => {
                            console.log('done!!!');

                            rimraf.sync(dir);
                        })
                        .catch(error => console.log(error));
                }, 2000);
            }
        });
});
