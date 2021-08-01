const { BuidlingCsv2GeoJSON}  = require('../src/index');
const path = require('path');

(() => {
    const parentDir = __dirname;
    const inputDir = path.resolve(parentDir, './data')
    const outputDir = path.resolve(parentDir, './output')
    const csv2geojson = new BuidlingCsv2GeoJSON(inputDir, outputDir);
    csv2geojson.convert();
})();