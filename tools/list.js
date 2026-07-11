// Import required modules and dependencies
const api = require("./api.js");
const util = require("node:util");

async function get(type) {
    try {
        let text = "";
        const createList = (data, list) => data.map(list).join("\n");

        switch (type) {
            case "alkitab": {
                const data = (await axios.get("https://api-alkitab.vercel.app/api/book")).data.data;
                text = createList(data, (list) =>
                    `› ${formatter.bold("Book")}: ${list.name} (${list.abbr})\n` +
                    `› ${formatter.bold("Total Chapters")}: ${list.chapter}`
                );
                break;
            }
            case "alquran": {
                const data = (await axios.get("https://raw.githubusercontent.com/penggguna/QuranJSON/master/quran.json")).data;
                text = createList(data, (list) =>
                    `› ${formatter.bold("Surah")}: ${list.name} (${list.number_of_surah})\n` +
                    `› ${formatter.bold("Total Verses")}: ${list.number_of_ayah}`
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
                    "approve (Enable login approvals)",
                    "disapprove (Disable login approvals)",
                    "invite (Allow members to add members)",
                    "restrict (Only admins can add members)"
                ];
                text = createList(data, (list) => `› ${list}`);
                break;
            }
            case "mode": {
                const data = [
                    "premium (Premium mode: only responds to premium users and owners)",
                    "group (Group mode: only responds in groups)",
                    "private (Private mode: only responds in private chats)",
                    "public (Public mode: responds in groups and private chats)",
                    "self (Self mode: only responds to itself and the owner)"
                ];
                text = createList(data, (list) => `› ${list}`);
                break;
            }
            case "osettext": {
                const data = [
                    "donate - Available variables: %tag%, %name%, %prefix%, %command%, %footer%, %readmore% (Set donation text)",
                    "price - Available variables: %tag%, %name%, %prefix%, %command%, %footer%, %readmore% (Set price text)",
                    "qris (Set QRIS image for donation; image must be a URL)"
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
                    "antigcsw (Anti GC status)",
                    "antilink (Anti link)",
                    "antispam (Anti spam)",
                    "antitagsw (Anti tag status)",
                    "antitoxic (Anti toxic language)",
                    `autokick (Auto-kick if someone violates one of the ${formatter.inlineCode("anti...")} options)`,
                    "gamerestrict (Members are prohibited from playing games)",
                    "welcome (Member welcome message)"
                ];
                text = createList(data, (list) => `› ${list}`);
                break;
            }
            case "setprofile": {
                const data = [
                    "autolevelup (Auto level-up)",
                    "stickerwm (Sticker watermark)"
                ];
                text = createList(data, (list) => `› ${list}`);
                break;
            }
            case "settext": {
                const data = [
                    "goodbye (Goodbye text; available variables: %tag%, %subject%, %description%)",
                    "intro (Intro text)",
                    "welcome (Welcome text; available variables: %tag%, %subject%, %description%)"
                ];
                text = createList(data, (list) => `› ${list}`);
                break;
            }
            default: {
                text = tools.msg.info(`Unknown type: ${type}`);
                break;
            }
        }

        return text;
    } catch (error) {
        return null;
    }
}

module.exports = {
    get
};