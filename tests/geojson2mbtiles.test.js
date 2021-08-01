const { GeoJSON2mbtiles}  = require('../src/index');
const path = require('path');

(async () => {
    // const parentDir = __dirname;
    // const inputDir = path.resolve(parentDir, './output')
    // const outputDir = path.resolve(parentDir, './mbtiles')
    const parentDir = '/Volumes/DATA/google_buildings'
    const inputDir = path.resolve(parentDir, './geojson')
    const outputDir = path.resolve(parentDir, './mbtiles')
    const geojson2mbtiles = new GeoJSON2mbtiles(inputDir, outputDir, {
        skipMbtiles: true,
    });
    await geojson2mbtiles.convert();
})();