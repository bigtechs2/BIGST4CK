const moment = require("moment-timezone");

function convertMsToDuration(ms, requestedParts = null) {
    if (!ms || ms <= 0) return "0 second";

    const duration = moment.duration(ms);
    const hasLargerUnits = duration.asSeconds() >= 1;
    const units = {
        year: {
            value: duration.years(),
            condition: duration.years() > 0
        },
        month: {
            value: duration.months(),
            condition: duration.months() > 0
        },
        week: {
            value: duration.weeks(),
            condition: duration.weeks() > 0
        },
        day: {
            value: duration.days(),
            condition: duration.days() > 0
        },
        hour: {
            value: duration.hours(),
            condition: duration.hours() > 0
        },
        minute: {
            value: duration.minutes(),
            condition: duration.minutes() > 0
        },
        second: {
            value: duration.seconds(),
            condition: duration.seconds() > 0
        },
        millisecond: {
            value: duration.milliseconds(),
            condition: duration.milliseconds() > 0
        }
    };

    const parts = [];
    if (requestedParts && Array.isArray(requestedParts)) {
        for (const part of requestedParts) {
            if (units[part]) parts.push(`${units[part].value} ${part}`);
        }
    } else {
        for (const [unit, data] of Object.entries(units)) {
            if (unit === "milliseconds") {
                if (!hasLargerUnits && data.value > 0) parts.push(`${data.value} ${unit}`);
            } else if (data.condition) {
                parts.push(`${data.value} ${unit}`);
            }
        }
    }

    return parts.length > 0 ? parts.join(" ") : "0 second";
}

function formatSize(byteCount, withPerSecond = false) {
    if (!byteCount) return `0 yBytes${withPerSecond ? "/s" : ""}`;

    let index = 8;
    let size = byteCount;
    const bytes = ["yBytes", "zBytes", "aBytes", "fBytes", "pBytes", "nBytes", "µBytes", "mBytes", "Bytes", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];

    while (size < 1 && index > 0) {
        size *= 1024;
        index--;
    }
    while (size >= 1024 && index < bytes.length - 1) {
        size /= 1024;
        index++;
    }

    return `${size.toFixed(2)} ${bytes[index]}${withPerSecond ? "/s" : ""}`;
}

function generateCmdExample(used, args) {
    if (!used || !args) return `${formatter.inlineCode("used")} or ${formatter.inlineCode("args")} must given!`;
    return `Example: ${formatter.inlineCode(`${used.prefix + used.command} ${args}`)}`;
}

function generateInstruction(actions, mediaTypes) {
    if (!actions || !mediaTypes || !Array.isArray(actions) || !Array.isArray(mediaTypes)) return `${formatter.inlineCode("actions")} And ${formatter.inlineCode("mediaTypes")} must be an array!`;

    const mediaTypeTranslations = {
        audio: "audio",
        document: "document",
        image: "picture",
        sticker: "sticker",
        text: "text",
        video: "video",
        viewOnce: "viewonce"
    };
    const translatedMediaTypeList = mediaTypes.map(type => mediaTypeTranslations[type]);
    let mediaTypesList;
    if (translatedMediaTypeList.length > 1) {
        const lastMediaType = translatedMediaTypeList[translatedMediaTypeList.length - 1];
        mediaTypesList = `${translatedMediaTypeList.slice(0, -1).join(", ")} or ${lastMediaType}`;
    } else {
        mediaTypesList = translatedMediaTypeList[0];
    }

    const actionTranslations = {
        send: "Send",
        reply: "Reply"
    };
    const instructions = actions.map(action => `${actionTranslations[action]}`);
    const actionList = instructions.join(actions.length > 1 ? " or " : "");

    return info(`${actionList} ${mediaTypesList}!`);
}

function generatesFlagInfo(flags) {
    if (!flags || typeof flags !== "object") return `${formatter.inlineCode("flags")} must be an object!`;
    return "Flag:\n" +
        Object.entries(flags).map(([flag, description]) => `- ${formatter.inlineCode(flag)}: ${description}`).join("\n");
}

function generateNotes(notes) {
    if (!notes || !Array.isArray(notes)) return `${formatter.inlineCode("notes")} must be a string!`;
    return "Notes:\n" +
        notes.map(note => `- ${note}`).join("\n");
}

function info(text) {
    return `ⓘ ${formatter.italic(text)}`;
}

function ucwords(text) {
    if (!text) return null;
    return text.toLowerCase().replace(/\b\w/g, (txt) => txt.toUpperCase());
}

module.exports = {
    convertMsToDuration,
    formatSize,
    generateCmdExample,
    generateInstruction,
    generatesFlagInfo,
    generateNotes,
    info,
    ucwords
};