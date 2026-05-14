const Tesseract = require('tesseract.js');

async function extractText(imageUrl) {
    try {
        const { data: { text } } = await Tesseract.recognize(
            imageUrl,
            'eng',
            { logger: () => {} }
        );

        return text.toLowerCase();
    } catch (err) {
        console.error("OCR error:", err);
        return '';
    }
}

function analyzeText(text) {
    let score = 0;

    if (!text) return 0;

    if (text.includes('withdrawal')) score += 2;
    if (text.includes('success')) score += 1;
    if (text.includes('crypto')) score += 2;
    if (text.includes('bonus')) score += 1;
    if (text.includes('balance')) score += 1;
    if (text.includes('winnings')) score += 2;
    if (text.includes('claim')) score += 1;
    if (text.includes('free')) score += 1;

    return score;
}

module.exports = {
    extractText,
    analyzeText
};
