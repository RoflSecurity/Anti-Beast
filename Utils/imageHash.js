const imghash = require('imghash');
const fs = require('fs');
const path = require('path');

const HASH_PATH = path.join(__dirname, '../Data/hashes.json');

let knownHashes = [];

try {
    knownHashes = JSON.parse(fs.readFileSync(HASH_PATH));
} catch {
    console.warn("⚠️ hashes.json introuvable ou vide");
}

// ===== HAMMING =====
function hammingDistance(a, b) {
    let dist = 0;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) dist++;
    }
    return dist;
}

// ===== FETCH BUFFER =====
async function getImageBuffer(url) {
    const res = await fetch(url);

    if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
    }

    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(arrayBuffer);
}

// ===== DETECTION =====
async function isScamImage(imageUrl) {
    try {
        const buffer = await getImageBuffer(imageUrl);
        const hash = await imghash.hashRaw(buffer, 16);

        for (const sample of knownHashes) {
            const dist = hammingDistance(hash, sample.hash);

            if (dist <= 10) return true;
        }

        return false;

    } catch (err) {
        console.error("Hash error:", err);
        return false;
    }
}

module.exports = {
    isScamImage
};