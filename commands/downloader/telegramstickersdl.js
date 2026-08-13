// commands/telegramstickersdl.js
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { Sticker } = require('wa-sticker-formatter');

// ─── HARDCODED TELEGRAM BOT TOKEN ───
const TELEGRAM_TOKEN = "8998949573:AAFmHgdvW0vuV7qpype2jWA_6nUGombmUEQ";

module.exports = {
    name: "telegramstickersdl",
    aliases: ["tgstickers", "tgsticker", "tgsdl"],
    category: "downloader",
    permissions: {
        coin: 20
    },

    code: async (ctx) => {
        try {
            const input = ctx.args[0];
            if (!input) {
                return await ctx.reply(
                    `📦 *Telegram Sticker Pack Downloader*\n\n` +
                    `Convert any Telegram sticker pack to WhatsApp stickers.\n\n` +
                    `*Usage:*\n` +
                    `${ctx.used.prefix}${ctx.used.command} <pack_name_or_link>\n\n` +
                    `*Examples:*\n` +
                    `${ctx.used.prefix}${ctx.used.command} PepeStickers\n` +
                    `${ctx.used.prefix}${ctx.used.command} https://t.me/addstickers/PepeStickers\n\n` +
                    `⚠️ *Cost:* 20 coins per pack`
                );
            }

            // ─── Extract pack name ───
            let packName = input;
            const linkMatch = input.match(/t\.me\/addstickers\/([^\/\s]+)/);
            if (linkMatch) packName = linkMatch[1];

            const token = TELEGRAM_TOKEN;

            await ctx.reply(`🔄 Fetching sticker pack *${packName}*...`);

            const apiUrl = `https://api.telegram.org/bot${token}/getStickerSet?name=${packName}`;
            const response = await axios.get(apiUrl, { timeout: 15000 });

            if (!response.data.ok) {
                return await ctx.reply(`❌ *Failed to fetch pack:* ${response.data.description || 'Unknown error'}`);
            }

            const stickerSet = response.data.result;
            const stickers = stickerSet.stickers || [];

            if (stickers.length === 0) {
                return await ctx.reply("❌ No stickers found in this pack.");
            }

            // ─── Check for animated ───
            const hasAnimated = stickers.some(s => s.is_animated);
            if (hasAnimated) {
                await ctx.reply("⚠️ *Animated stickers detected!* They will be skipped.");
            }

            // ─── Create temp folder in root ───
            const tmpDir = path.join(process.cwd(), 'temp');
            if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

            const packAuthor = stickerSet.creator_name || 'Telegram';
            const packTitle = stickerSet.title || 'Telegram Stickers';

            let processed = 0;
            let skipped = 0;
            let stickerBuffers = [];

            await ctx.reply(`📥 Downloading ${stickers.length} stickers...`);

            for (const sticker of stickers) {
                if (sticker.is_animated) {
                    skipped++;
                    continue;
                }

                const fileId = sticker.file_id;
                const fileInfo = await axios.get(
                    `https://api.telegram.org/bot${token}/getFile?file_id=${fileId}`,
                    { timeout: 10000 }
                );

                const filePath = fileInfo.data.result.file_path;
                if (!filePath) {
                    skipped++;
                    continue;
                }

                const fileUrl = `https://api.telegram.org/file/bot${token}/${filePath}`;
                const stickerRes = await axios.get(fileUrl, {
                    responseType: 'arraybuffer',
                    timeout: 15000
                });

                const rawBuffer = Buffer.from(stickerRes.data);

                // ─── Convert to WhatsApp sticker ───
                try {
                    const stickerObj = new Sticker(rawBuffer, {
                        pack: packTitle,
                        author: packAuthor,
                        type: 'full',
                        quality: 70,
                        background: '#FFFFFF'
                    });

                    const convertedBuffer = await stickerObj.toBuffer();
                    stickerBuffers.push(convertedBuffer);
                    processed++;
                } catch (convError) {
                    console.error(`[TGSticker] Conversion failed:`, convError.message);
                    // Try to send as image if conversion fails
                    stickerBuffers.push(rawBuffer);
                    processed++;
                }
            }

            if (stickerBuffers.length === 0) {
                return await ctx.reply("❌ No stickers could be converted.");
            }

            // ─── Send stickers (batched) ───
            await ctx.reply(`📤 Sending ${stickerBuffers.length} stickers...`);

            const batchSize = 5;
            for (let i = 0; i < stickerBuffers.length; i += batchSize) {
                const batch = stickerBuffers.slice(i, i + batchSize);
                for (const buffer of batch) {
                    try {
                        // Try sending as sticker
                        await ctx.reply({ sticker: buffer }, { quoted: ctx._msg });
                    } catch (sendError) {
                        console.error(`[TGSticker] Send error:`, sendError.message);
                        // Fallback: send as image
                        try {
                            await ctx.reply({ image: buffer }, { quoted: ctx._msg });
                        } catch (imgError) {
                            console.error(`[TGSticker] Image fallback also failed:`, imgError.message);
                        }
                    }
                    await new Promise(resolve => setTimeout(resolve, 300));
                }
                if (i + batchSize < stickerBuffers.length) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }

            // ─── Deduct coins ───
            const userDb = ctx.db.user;
            if (userDb) {
                userDb.coin = (userDb.coin || 0) - 20;
                userDb.save();
            }

            await ctx.reply(
                `✅ *Sticker Pack Converted!*\n\n` +
                `📦 *Pack:* ${packTitle}\n` +
                `👤 *Author:* ${packAuthor}\n` +
                `📊 *Converted:* ${processed}\n` +
                `⏭️ *Skipped:* ${skipped}\n\n` +
                `💡 If some stickers didn't send, they might be animated or corrupt.`
            );

        } catch (error) {
            console.error('[TGSticker] Error:', error);
            await ctx.reply(`❌ *Error:* ${error.message || 'Unknown error'}`);
        }
    }
};