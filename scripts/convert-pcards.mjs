import { readFileSync, writeFileSync } from 'fs'
import { EOL } from 'os'; 
import { exit } from 'process';

const fileData = readFileSync('./pcards.csv')

const startId = 256
const json = [];

/**
 * @param {string} str 
 * @returns {{id: string, number: number, type: number, value: string}}
 */
const generateObject = (str) => ({
    id: (startId + json.length).toString(),
    number: startId + json.length,
    type: 'CardType.PlayerCard',
    value: str.replace(/["[\]]/g, '')
})

fileData.toString().split(EOL).forEach(line => {
    json.push(generateObject(line.trim()))
})

writeFileSync('./out.txt', JSON.stringify(json, null, 2))

console.info('Done!')

exit(0)