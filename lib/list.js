async function get(ctx, type) {
    try {
        let text = "";
        const createList = (data, list) => data.map(list).join("\n");

        switch (type) {
            case "alkitab": {
                const data = (await ctx.request.get("https://api-alkitab.vercel.app/api/book")).data.data;
                text = createList(data, (list) =>
                    `› ${ctx.format.bold("Book")}: ${list.name} (${list.abbr})\n` +
                    `› ${ctx.format.bold("Chapters")}: ${list.chapter}`
                );
                break;
            }
            case "alquran": {
                const data = (await ctx.request.get("https://raw.githubusercontent.com/penggguna/QuranJSON/master/quran.json")).data;
                text = createList(data, (list) =>
                    `› ${ctx.format.bold("Surah")}: ${list.name} (${list.number_of_surah})\n` +
                    `› ${ctx.format.bold("Verses")}: ${list.number_of_ayah}`
                );
                break;
            }
            case "claim": {
                const data = [
                    "daily (Daily reward)",
                    "weekly (Weekly reward)",
                    "monthly (Monthly reward)",
                    "yearly (Yearly reward)"
                ];
                text = createList(data, (list) => `› ${list}`);
                break;
            }
            case "group": {
                const data = [
                    "open (Open group)",
                    "close (Close group)",
                    "lock (Lock group)",
                    "unlock (Unlock group)",
                    "approve (Enable join approval)",
                    "disapprove (Disable join approval)",
                    "invite (Allow members to add members)",
                    "restrict (Only admins can add members)"
                ];
                text = createList(data, (list) => `› ${list}`);
                break;
            }
            case "mode": {
                const data = [
                    "premium (Premium mode – only responds to premium users and owner)",
                    "group (Group mode – only responds in groups)",
                    "private (Private mode – only responds in private chats)",
                    "public (Public mode – responds in both groups and private chats)",
                    "self (Self mode – only responds to itself and the owner)"
                ];
                text = createList(data, (list) => `› ${list}`);
                break;
            }
            case "osettext": {
                const data = [
                    "donate – Available variables: %tag%, %name%, %prefix%, %command%, %footer%, %readmore% (Set donation text)",
                    "price – Available variables: %tag%, %name%, %prefix%, %command%, %footer%, %readmore% (Set price text)",
                    "qris (Set QRIS image for donations, image must be a link)"
                ];
                text = createList(data, (list) => `› ${list}`);
                break;
            }
            case "setoption": {
                const data = [
                    "antiaudio (Anti audio)",
                    "antidocument (Anti document)",
                    "antiimage (Anti image)",
                    "antisticker (Anti sticker)",
                    "antivideo (Anti video)",
                    "antigcsw (Anti group status)",
                    "antilink (Anti link)",
                    "antispam (Anti spam)",
                    "antitagsw (Anti tag status)",
                    "antitoxic (Anti toxic, e.g. offensive language)",
                    `autokick (Auto‑kick if someone violates any ${ctx.format.inlineCode("anti...")} option)`,
                    "gamerestrict (Members cannot play games)",
                    "welcome (Member welcome message)"
                ];
                text = createList(data, (list) => `› ${list}`);
                break;
            }
            case "settext": {
                const data = [
                    "goodbye (Goodbye text – available variables: %tag%, %subject%, %description%)",
                    "intro (Intro text)",
                    "welcome (Welcome text – available variables: %tag%, %subject%, %description%)"
                ];
                text = createList(data, (list) => `› ${list}`);
                break;
            }
            case "vccgenerator": {
                const data = [
                    "visa",
                    "mastercard",
                    "amex",
                    "cup",
                    "jcb",
                    "diners",
                    "rupay"
                ];
                text = createList(data, (list) => `› ${list}`);
                break;
            }
            case "ai": {
                const data = [
                    "chatgpt – AI chat with ChatGPT",
                    "unlimitedai – Free unlimited AI chat",
                    "publicai – Public AI for everyone",
                    "deepseek – DeepSeek AI assistant",
                    "gemini – Google Gemini AI",
                    "claude – Claude AI by Anthropic",
                    "meta – Meta AI (Llama)"
                ];
                text = createList(data, (list) => `› ${list}`);
                break;
            }
            case "downloader": {
                const data = [
                    "play – Search and download music",
                    "facebookdl – Download Facebook videos",
                    "ytmp3 – Download YouTube audio",
                    "ytmp4 – Download YouTube video",
                    "tiktok – Download TikTok videos",
                    "instagram – Download Instagram posts"
                ];
                text = createList(data, (list) => `› ${list}`);
                break;
            }
            default: {
                text = ctx.format.info(`Unknown type: ${type}`);
                break;
            }
        }

        return text;
    } catch (error) {
        return ctx.format.info(`Error loading list: ${error.message}`);
    }
}

module.exports = {
    get
};