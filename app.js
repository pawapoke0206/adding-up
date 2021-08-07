'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ input: rs, output: {} });
const prefectureMap = new Map();
rl.on('line', lineString => {
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const prefecture = columns[1];
    const popu = parseInt(columns[3]);

    if (year === 2010 || year === 2015) {
        let value = prefectureMap.get(prefecture);
        if (!value) {
            value = {
                popu2010 : 0,
                popu2015 : 0,
                change : null
            };
        }
        if (year === 2010) {
            value.popu2010 = popu;
        }
        if (year === 2015) {
            value.popu2015 = popu;
        }
        prefectureMap.set(prefecture,value);
    }
});
rl.on('close', () => {
    for (const [key,value] of prefectureMap) {
        value.change = value.popu2015 / value.popu2010;
    }
    const rankingArray = Array.from(prefectureMap).sort((pair1,pair2) => {
        return pair2[1].change - pair1[1].change;
    });
    const rankingStrings = rankingArray.map(([key,value]) => {
        return (
            key +
            ': ' +
            value.popu2010 +
            '=>' +
            value.popu2015 +
            ' 変化率:' +
            value.change
        );
    });
    console.log(rankingStrings);
});
