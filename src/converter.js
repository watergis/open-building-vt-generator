const { parse } = require('wkt');

module.exports = (record, callback) => {
    let geometry;
    if (record.geometry === 'GEOMETRYCOLLECTION EMPTY') {
        geometry = {
            type: 'Point',
            coordinates: [Number(record.longitude), Number(record.latitude)]
        }
    } else {
        geometry = parse(record.geometry);
    }
    const feature = {
        type: 'Feature',
        geometry: geometry,
        properties: {
            latitude: Number(record.latitude),
            longitude: Number(record.longitude),
            area_in_meters: Number(record.area_in_meters),
            confidence: Number(record.confidence),
            full_plus_code: record.full_plus_code
        }
    }
    callback(null, JSON.stringify(feature) + '\n');
}