const linkSession = new Map();

// =========================
// SUPPORTED PLATFORMS
// =========================
const SUPPORTED_DOMAINS = [
"tiktok.com", "vt.tiktok", "douyin.com", "capcut.com", "threads.net",
"instagram.com", "facebook.com", "fb.watch", "espn.com", "pinterest.com",
"pin.it", "imdb.com", "imgur.com", "ifunny.co", "izlesene.com",
"reddit.com", "youtube.com", "youtu.be", "twitter.com", "x.com",
"vimeo.com", "snapchat.com", "bilibili.com", "dailymotion.com",
"sharechat.com", "likee.video", "linkedin.com", "tumblr.com",
"hipi.co.in", "t.me", "getstickerpack.com", "bitchute.com",
"febspot.com", "9gag.com", "ok.ru", "rumble.com", "streamable.com",
"ted.com", "sohu.com", "xvideos.com", "xnxx.com", "xiaohongshu.com",
"ixigua.com", "weibo.com", "miaopai.com", "meipai.com", "xiaoying.tv",
"yingke.com", "sina.com", "vk.com", "vkvideo.ru", "soundcloud.com",
"mixcloud.com", "spotify.com", "zingmp3.vn", "bandcamp.com"
];

function detectLinkPlatform(text) {
if (!text) return null;

const urlMatch = text.match(/https?:\/\/[^\s]+/);
if (!urlMatch) return null;

const url = urlMatch[0];

const isSupported =
    SUPPORTED_DOMAINS.some(
        domain => url.includes(domain)
    );

if (!isSupported) return null;

const platformLabel =
    url.includes("tiktok") ||
    url.includes("douyin")
        ? "TikTok"
    : url.includes("youtube") ||
      url.includes("youtu.be")
        ? "YouTube"
    : url.includes("instagram")
        ? "Instagram"
    : url.includes("facebook") ||
      url.includes("fb.watch")
        ? "Facebook"
    : url.includes("twitter") ||
      url.includes("x.com")
        ? "Twitter/X"
    : url.includes("pinterest") ||
      url.includes("pin.it")
        ? "Pinterest"
    : url.includes("spotify")
        ? "Spotify"
    : url.includes("soundcloud")
        ? "SoundCloud"
    : url.includes("reddit")
        ? "Reddit"
    : url.includes("vimeo")
        ? "Vimeo"
    : url.includes("snapchat")
        ? "Snapchat"
    : url.includes("threads")
        ? "Threads"
    : "Media";

return {
    url,
    platform: platformLabel
};

}

// =========================
// PROSES DOWNLOAD
// =========================
async function processDownload(ctx, url) {

    // =========================
    // KHUSUS YOUTUBE
    // =========================
    if (
        url.includes("youtube.com") ||
        url.includes("youtu.be")
    ) {

        const { data } =
            await axios.get(
                "https://fgsi.dpdns.org/api/downloader/youtube/v1",
                {
                    params: {
                        url,
                        apikey: "fgsiapi-2d6917a7-6d"
                    },
                    timeout: 60000
                }
            );

        if (
            !data?.status ||
            !data?.data?.url
        ) {

            await ctx.reply(
                tools.msg.info(
                    "Gagal mengambil video YouTube."
                )
            );

            return;

        }

        await ctx.reply({
            video: {
                url: data.data.url
            },
            mimetype: "video/mp4",
            caption:
                `*${data.title || "YouTube Video"}*\n` +
                `› Channel: ${data.channel || "-"}`
        });

        return;

    }

    // =========================
    // PLATFORM LAIN (SYNOX)
    // =========================
    const { data: res } =
        await axios.get(
            "https://api.synoxcloud.xyz/download/all-in-one",
            {
                params: { url },
                timeout: 60000
            }
        );

    if (
        !res.status ||
        !res.result?.data
    ) {

        await ctx.reply(
            tools.msg.info(
                "Gagal memproses link. Pastikan link valid dan platformnya didukung."
            )
        );

        return;

    }

    const data =
        res.result.data;

    const source =
        data.source ||
        "unknown";

    if (
        !data.medias?.length
    ) {

        await ctx.reply(
            tools.msg.info(
                "Tidak ada media yang bisa didownload dari link itu."
            )
        );

        return;

    }

    const videoMedias =
        data.medias.filter(
            m =>
                m.type === "video" &&
                m.url
        );

    const pickStandardVideo =
        medias => {

            if (!medias.length)
                return null;

            const preferOrder = [
                "480p",
                "360p",
                "720p",
                "240p",
                "1080p"
            ];

            for (
                const q
                of preferOrder
            ) {

                const found =
                    medias.find(
                        m =>
                            m.label?.includes(q) ||
                            m.quality?.includes(q)
                    );

                if (found)
                    return found;

            }

            return medias[0];

        };

    const selectedVideo =
        pickStandardVideo(
            videoMedias
        );

    if (
        !selectedVideo
    ) {

        await ctx.reply(
            tools.msg.info(
                "Tidak ditemukan video yang bisa diproses."
            )
        );

        return;

    }

    const caption =
        `*${data.title || "Media"}*\n` +
        `› Sumber: ${tools.msg.ucwords(source)}\n` +
        (
            data.author
                ? `› Author: ${data.author}\n`
                : ""
        ) +
        (
            data.duration
                ? `› Durasi: ${data.duration}s\n`
                : ""
        ) +
        `› Kualitas: ${
            selectedVideo.label ||
            selectedVideo.quality ||
            "Standar"
        }`;

    await ctx.reply({
        video: {
            url:
                selectedVideo.url
        },
        caption
    });

}

// =========================
// MAIN HANDLER
// =========================
async function handleAutoDownloader(ctx) {

const jid =
    ctx.sender.jid;

const body =
    ctx.msg?.body || "";

try {

    if (
        body === "autodl_yes" ||
        body === "autodl_no"
    ) {

        const pending =
            linkSession.get(
                jid
            );

        if (!pending)
            return;

        linkSession.delete(
            jid
        );

        if (
            body ===
            "autodl_no"
        ) {

            await ctx.reply(
                tools.msg.info(
                    "Dibatalkan."
                )
            );

            return;

        }

        await ctx.reply(
            tools.msg.info(
                "Scrapping Metadata..."
            )
        );

        try {

            await processDownload(
                ctx,
                pending.url
            );

        } catch (error) {

            await ctx.reply(
                tools.msg.info(
                    "Gagal memproses link. Coba lagi nanti."
                )
            );

            log.error(
                "[AutoDownloader]",
                error.message
            );

        }

        return;

    }

    const linkInfo =
        detectLinkPlatform(
            body
        );

    if (!linkInfo)
        return;

    linkSession.set(
        jid,
        {
            url:
                linkInfo.url
        }
    );

    setTimeout(
        () =>
            linkSession.delete(
                jid
            ),
        60000
    );

    const msg = {
        viewOnceMessage: {
            message: {
                interactiveMessage: {
                    body: {
                        text:
                            `Link ${linkInfo.platform} terdeteksi.\n\n` +
                            `Apakah kamu ingin mendownloadnya?`
                    },
                    footer: {
                        text:
                            config.msg.footer
                    },
                    header: {
                        title:
                          `#########`,
                        hasMediaAttachment: false
                    },
                    nativeFlowMessage: {
                        buttons: [
                            {
                                name: "quick_reply",
                                buttonParamsJson:
                                    JSON.stringify({
                                        display_text: "Iya, Download",
                                        id: "autodl_yes"
                                    })
                            },
                            {
                                name: "quick_reply",
                                buttonParamsJson:
                                    JSON.stringify({
                                        display_text: "Tidak, Batal",
                                        id: "autodl_no"
                                    })
                            }
                        ]
                    }
                }
            }
        }
    };

    await ctx.reply({
        ...msg,
        raw: true
    });

} catch (error) {

    log.error(
        "[AutoDownloader]",
        error.message
    );

}

}

module.exports = {
handleAutoDownloader,
linkSession
};