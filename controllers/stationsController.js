import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const stationsPath = path.join(__dirname, '../data/indian-railway-stations-2026-04-29.json');
let stationsData = [];
let dataVersion = "1.0.0";

try {
    const rawData = fs.readFileSync(stationsPath,'utf-8');
    stationsData = JSON.parse(rawData);
    console.log('✅ Station data loaded successfully');
} catch (error) {
    console.error('❌ Error loading station JSON:', error);
}

export const getStationList = (req, res) => {
    res.set('X-Data-Version', dataVersion); 
    res.status(200).json(stationsData);
};