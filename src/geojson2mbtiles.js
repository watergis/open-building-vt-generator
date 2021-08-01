const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process')

class GeoJSON2mbtiles {
    constructor(inputDir, outputDir, options) {
        this.inputDir = inputDir;
        this.outputDir = outputDir;
        this.skipMbtiles = options.skipMbtiles || false;
    }

    async convert() {
        if (!fs.existsSync(this.inputDir)) throw new Error('Input directory does not exist');
        if (!fs.existsSync(this.outputDir)) fs.mkdirSync(this.outputDir);
        const files = fs.readdirSync(this.inputDir);
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const geojsonPath = path.join(this.inputDir, file);
            const stats = fs.statSync(geojsonPath);
            if (!stats.isFile()) continue;
            if (path.extname(file) !== '.geojson') continue;
            const outputFile = path.join(this.outputDir, `${path.parse(file).name}.mbtiles`);
            if (fs.existsSync(outputFile)) {
                if (this.skipMbtiles) continue;
                fs.unlinkSync(outputFile);
            }
            console.log(`Generating ${outputFile}...`)
            await this.execute('tippecanoe', [
                '--read-parallel',
                '--force',
                '--no-feature-limit',
                '--no-tile-size-limit',
                '--maximum-zoom=15',
                '--minimum-zoom=15',
                '--base-zoom=15',
                '--projection=EPSG:4326',
                '--layer=open-buildings',
                `--output=${outputFile}`,
                geojsonPath
            ])
        }
    }

    execute(command, args){
        return new Promise((resolve, reject) => {
            const cmd = spawn(command, args, { stdio: 'inherit' })
            cmd.on('close', code => code === 0 ? resolve() : reject())
        })
    }
}

module.exports = GeoJSON2mbtiles;