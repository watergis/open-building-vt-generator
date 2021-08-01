# open-building-vt-generator

This module is to convert csv files of [Google's building data in Africa](https://sites.research.google/open-buildings/) to GeoJSON files.

## Download

First of all, download all of building data by commandline.

```bash
gsutil cp -R gs://open-buildings-data/v1/polygons_s2_level_4_gzip .
```

The total size of files is 46GB for 135 files.

## Extract .csv.gz to .csv

```bash
find ./polygons_s2_level_4_gzip -type f -name "*.gz" -exec gunzip {} \;
```

The total size of files after extracting is 129.5GB

## Convert .csv to GeoJSON

- Installation

```bash
git clone git@github.com:watergis/google-building-csv2geojson.git
cd google-building-csv2geojson
npm i
```

- Convert

Modify `building-csv2geojson.test.js`

```js
const { BuidlingCsv2GeoJSON} = require('../src/index');
const path = require('path');

(() => {
    // specify the directory where stored csv files
    const inputDir = path.resolve(__dirname, './data')
    // specify the directory where export to
    const outputDir = path.resolve(__dirname, './output')
    const csv2geojson = new BuidlingCsv2GeoJSON(inputDir, outputDir);
    csv2geojson.convert();
})();
```

```bash
npm run convert
```

### generate vector tiles by tippecanoe

- if you just want to convert few GeoJSON files...

```bash
tippecanoe -P --no-feature-limit --no-tile-size-limit --force --minimum-zoom=15 --maximum-zoom=15 --base-zoom=15 --hilbert -l "open-buildings" -o open-buildings.mbtiles $(find ./tests/output/*.geojson)
```

This might take very long time to generate mbtiles if the number of GeoJSON is too much.

- if you want to convert in the entire Africa...

Modify `geojson2mbtiles.test.js`

```js
const { GeoJSON2mbtiles}  = require('../src/index');
const path = require('path');

(async () => {
    const parentDir = __dirname;
    // specify the GeoJSON directory path.
    const inputDir = path.resolve(parentDir, './output')
    // specify the mbtiles directory path to export
    const outputDir = path.resolve(parentDir, './mbtiles')
    const geojson2mbtiles = new GeoJSON2mbtiles(inputDir, outputDir);
    await geojson2mbtiles.convert();
})();
```

```bash
npm run generate
```

Finally, you can merge all of mbtiles into one.

```bash
tile-join --force -o open-buildings.mbtiles --maximum-zoom=15 --minimum-zoom=15 --no-tile-size-limit $(find ./tests/mbtiles/*.mbtiles)
```

## License

This source code's license is MIT, however the license of data is belong to Google. It is CC By 4.0 license. Please check their [website](https://sites.research.google/open-buildings/).
