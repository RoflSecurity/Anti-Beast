const fs = require('fs');
const path = require('path');
const imghash = require('imghash');

const SAMPLE_DIR = path.join(__dirname, '../Samples');
const OUTPUT = path.join(__dirname, '../Data/hashes.json');

(async () => {
    const files = fs.readdirSync(SAMPLE_DIR);
    const hashes = [];

    for (const file of files) {
        const filePath = path.join(SAMPLE_DIR, file);

        const hash = await imghash.hash(filePath, 16);
        hashes.push({ file, hash });

        console.log(`Hashed: ${file}`);
    }

    fs.writeFileSync(OUTPUT, JSON.stringify(hashes, null, 2));
    console.log("✅ Hashes saved");
})();