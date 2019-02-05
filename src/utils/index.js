export const getRandom = (max, min = 0) => {
    return Math.floor(Math.random() * (max - min) + min);
};

export const shuffle = array => {
    const newArray = [...array];

    let m = newArray.length;
    while (m) {
        const i = Math.floor(Math.random() * m--);
        [newArray[m], newArray[i]] = [newArray[i], newArray[m]];
    }
    return newArray;
};

export const range = (max, step = 1) => [...new Array(max).keys((item, index) => index + step)];
