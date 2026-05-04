const { Events } = require('discord.js');
const { isScamImage } = require('../Utils/imageHash');
const { extractText, analyzeText } = require('../Utils/ocr');
module.exports = {
    name: Events.MessageCreate,
    once: false,
    async execute(message) {
        try {
            if (message.author.bot) return;
            if (!message.guild) return;

            const hasImage = message.attachments.some(a => a.contentType?.startsWith('image/'));
            if (!hasImage) return;

            let totalScore = 0;

            for (const attachment of message.attachments.values()) {
                if (!attachment.contentType?.startsWith('image/')) continue;
                if (attachment.size > 2_000_000) continue;

                // ===== PHASH CHECK =====
                const scamMatch = await isScamImage(attachment.url);

                if (scamMatch) {
                    await message.delete().catch(() => { });

                    await message.channel.send({
                        content: `⚠️ ${message.author} image recognized.`
                    });

                    return;
                }

                // ===== OCR FALLBACK =====
                const text = await extractText(attachment.url);
                const score = analyzeText(text);

                totalScore += score;
            }

            // ===== CONTEXT =====
            const hasLink = /(https?:\/\/)/i.test(message.content);
            if (hasLink) totalScore += 2;

            const isNewAccount =
                message.member?.joinedTimestamp &&
                (Date.now() - message.member.joinedTimestamp < 86400000);

            if (isNewAccount) totalScore += 1;

            // ===== DECISION =====
            if (totalScore >= 3) {
                try {
                    await message.delete().catch(() => { });

                    // Vérifie si le bot peut bannir
                    if (!message.member.bannable) {
                        await message.channel.send({
                            content: `⚠️ I'll need the permission to ban members !`
                        });
                        return;
                    }

                    // Bannissement
                    await message.member.ban({
                        reason: 'Scam image detected (earlam)'
                    });

                    // Annonce
                    await message.channel.send({
                        content: `🚫 ${message.author.tag} have been banned.`
                    });

                } catch (err) {
                    console.error("Ban error:", err);
                }
            }

        } catch (err) {
            console.error("MessageCreate error:", err);
        }
    },
};