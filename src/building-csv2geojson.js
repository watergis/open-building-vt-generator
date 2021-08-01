const fs = require('fs');
const path = require('path');
const converter = require('./converter');
const csvParse = require('csv-parse');
const streamTransform = require('stream-transform');

class BuidlingCsv2GeoJSON {
    constructor(inputDir, outputDir) {
        this.inputDir = inputDir;
        this.outputDir = outputDir;
    }

    convert() {
        if (!fs.existsSync(this.inputDir)) throw new Error('Input directory does not exist');
        if (!fs.existsSync(this.outputDir)) fs.mkdirSync(this.outputDir);
        const files = fs.readdirSync(this.inputDir);
        files.forEach(file=>{
            const csvPath = path.join(this.inputDir, file);
            const stats = fs.statSync(csvPath);
            if (!stats.isFile()) return;
            if (path.extname(file) !== '.csv') return;
            const outputFile = path.join(this.outputDir, `${path.parse(file).name}.geojson`);
            if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile);
            const createReadStream = fs.createReadStream;
            const createWriteStream = fs.createWriteStream;
            const writeStream = createWriteStream(outputFile);
            createReadStream(csvPath,'utf-8')
                .pipe(csvParse({ columns: true }))
                .pipe(streamTransform(converter))
                .pipe(writeStream)
                .on('error', (err)=>{
                    console.error(err);
                    writeStream.end();
                })
                .on('close', () =>{
                    console.log(`exported: ${outputFile}`)
                })
        })
    }
}

module.exports = BuidlingCsv2GeoJSON;