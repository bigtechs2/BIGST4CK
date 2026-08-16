// commands/facebook.js
const config = require('../config');
const axios = require('axios');
const { AIRich } = require('../lib/NIXCODE');

const FOOTER = config.msg.footer || `© ${config.bot.name} by bigmanjtech™`;

// ─── Helper: Try Hansa API (fallback) ──────────────────
async function tryHansaAPI(url) {
    try {
        const apiUrl = `https://api-aswin-sparky.koyeb.app/api/downloader/fbdl?url=${encodeURIComponent(url)}`;
        const res = await axios.get(apiUrl, { timeout: 25000 });
        const data = res.data;

        if (!data.success || !data.result) {
            throw new Error('Hansa: No result in response');
        }

        const videoList = data.result.result;
        if (!Array.isArray(videoList) || videoList.length === 0) {
            throw new Error('Hansa: No video options found');
        }

        let selectedVideo = videoList.find(v => v.quality.includes('720') || v.quality.includes('HD'));
        if (!selectedVideo) selectedVideo = videoList[0];

        return {
            videoUrl: selectedVideo.url,
            title: data.result.title || 'Facebook Video',
            thumbnail: data.result.thumbnail,
            quality: selectedVideo.quality
        };
    } catch (error) {
        console.error('[FB Hansa Error]', error.message);
        throw error;
    }
}

module.exports = {
    name: "facebook",
    aliases: ["fb", "fbdl"],
    category: "downloader",

    code: async (ctx) => {
        const sock = ctx.core;
        const chatId = ctx._msg.key.remoteJid;
        const msg = ctx._msg;
        const args = ctx.used.args || [];
        const prefix = ctx.used.prefix || '.';

        // ─── Check URL ──────────────────────────────────
        const url = args.join(' ').trim();
        if (!url || !url.includes('facebook.com')) {
            const usage =
`» Facebook Video Downloader
»
› Usage: ${prefix}facebook <facebook_url>
› Example: ${prefix}fb https://fb.watch/xyz
»
${FOOTER}`;
            await sock.sendMessage(chatId, { text: usage }, { quoted: msg });
            return;
        }

        // ─── Attempt download via primary API ──────────
        let videoData;
        try {
            const apiUrl = `https://api-aswin-sparky.koyeb.app/api/downloader/fbdl?url=${encodeURIComponent(url)}`;
            const res = await axios.get(apiUrl, { timeout: 25000 });
            const data = res.data;

            if (!data.status || !data.data) throw new Error('ASWIN: No status or data');
            if (!data.data.high && !data.data.low) throw new Error('ASWIN: No video URLs');

            videoData = {
                videoUrl: data.data.high || data.data.low,
                title: data.data.title || 'Facebook Video',
                thumbnail: data.data.thumbnail
            };
        } catch (primaryError) {
            // ─── Fallback to Hansa API ──────────────────
            try {
                videoData = await tryHansaAPI(url);
            } catch (fallbackError) {
                await sock.sendMessage(chatId, {
                    text: `» Download failed.\n› All APIs failed. Please try again later.\n${FOOTER}`
                }, { quoted: msg });
                return;
            }
        }

        if (!videoData.videoUrl) {
            await sock.sendMessage(chatId, {
                text: `» No download link found.\n${FOOTER}`
            }, { quoted: msg });
            return;
        }

        // ─── Send AIRich card ──────────────────────────
        const description = videoData.title || 'Facebook Video';
        const link = url;
        const thumbnail = videoData.thumbnail || config.bot.thumbnail;

        try {
            await new AIRich(sock)
                .addImage(thumbnail)
                .addVideo(videoData.videoUrl)
                .addText(
                    `» Title: ${description}\n» Link: ${link}`
                )
                .addTip('Tap the video to play')
                .setFooter(FOOTER)
                .send(chatId, { quoted: msg });
        } catch (sendError) {
            console.error('Send error:', sendError);
            await sock.sendMessage(chatId, {
                text: `» Failed to send video card.\n› ${sendError.message || 'Unknown error'}\n${FOOTER}`
            }, { quoted: msg });
        }
    }
};