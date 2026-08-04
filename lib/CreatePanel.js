const moment = require("moment-timezone");
const axios = require("axios");
// Button is global from NIXCODE

function randomKarakter(jumlah) {
    const huruf = "abcdefghijklmnopqrstuvwxyz";
    let hasil = "";
    for (let i = 0; i < jumlah; i++) {
        let h = huruf[Math.floor(Math.random() * huruf.length)];
        hasil += Math.random() < 0.5 ? h.toUpperCase() : h;
    }
    return hasil;
}

async function createPanel(ctx, { memo, cpu, disk }) {
    const text = ctx.text || "";
    const t = text.split("-");

    if (t.length < 2) {
        return await ctx.reply(`Example: ${ctx.used.prefix}${ctx.used.command} username-number`);
    }

    const username = t[0];
    const targetJid = ctx.quoted
        ? ctx.quoted.sender
        : (t[1] ? t[1].replace(/[^0-9]/g, "") + "@s.whatsapp.net" : ctx.mentionedJid?.[0]);

    if (!targetJid) {
        return await ctx.reply("❌ No target number found. Please provide a valid phone number.");
    }

    const email = `${username}@gmail.com`;
    const deskripsi = moment().tz(config.system.timeZone || "Africa/Nairobi").format("dddd, D MMMM - YYYY");

    // ── Constant Password ──
    const password = "own password"; // use your password 

    // ── Create User ──
    let user;
    try {
        const resUser = await axios.post(`${global.domain}/api/application/users`, {
            email,
            username,
            first_name: username,
            last_name: username,
            language: "en",
            password: String(password)
        }, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${global.plta}`
            },
            timeout: 10000
        });

        const data = resUser.data;
        if (data.errors) {
            const errMsg = data.errors.map(e => e.detail || JSON.stringify(e)).join("\n");
            return await ctx.reply(
                `» *User Creation Failed*\n\n` +
                `\`\`\`\n${errMsg}\n\`\`\`\n\n` +
                `_Please check the username and try again._`
            );
        }
        user = data.attributes;
    } catch (error) {
        console.error("[createPanel] User creation error:", error.response?.data || error.message);
        const status = error.response?.status || "N/A";
        const detail = error.response?.data?.errors?.[0]?.detail || error.message || "Unknown error";
        return await ctx.reply(
            `» *User Creation Error*\n\n` +
            `› Status: ${status}\n` +
            `› Detail: ${detail}\n\n` +
            `_Please check your username and try again._`
        );
    }

    // ── Fetch egg configuration ──
    let eggData;
    try {
        const eggRes = await axios.get(`${global.domain}/api/application/nests/5/eggs/${global.eggs}`, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${global.plta}`
            },
            timeout: 10000
        });
        eggData = eggRes.data.attributes;
    } catch (error) {
        console.error("[createPanel] Egg fetch error:", error.response?.data || error.message);
        const status = error.response?.status || "N/A";
        const detail = error.response?.data?.errors?.[0]?.detail || error.message || "Unknown error";
        return await ctx.reply(
            `» *Egg Fetch Error*\n\n` +
            `› Status: ${status}\n` +
            `› Detail: ${detail}\n\n` +
            `_Please check Nest/Egg IDs and panel URL._`
        );
    }

    await ctx.reply("_Creating Server..._");

    const startupCmd = eggData.startup;

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // ── PANEL DATA – BUTTON WITH REAL COPY/OPEN BUTTONS ──
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const thumbnails = [
        "https://files.catbox.moe/54sbu9.png",
        // You can add more thumbnails here
    ];
    const rThumbnail = thumbnails[Math.floor(Math.random() * thumbnails.length)];

    try {
        const panelBody =
            `» *PANEL DATA*\n\n` +
            `› Username: ${user.username}\n` +
            `› Password: ${password}\n` +
            `› Server: ${global.domain}\n\n` +
            `_Keep your panel data safe._`;

        await new Button(ctx.core)
            .setTitle("Panel Data")
            .setBody(panelBody)
            .setImage(rThumbnail)
            .setFooter(config.msg.footer || `© ${config?.bot?.name || "BIGST4CK"}`)
            .addCopy("Copy Username", user.username)
            .addCopy("Copy Password", String(password))
            .addUrl("Open Domain", global.domain, false)
            .send(targetJid, { quoted: null });
    } catch (error) {
        console.error("[createPanel] Button send error:", error.message);
        await ctx.reply(
            `» *Panel Data*\n\n` +
            `› Username: ${user.username}\n` +
            `› Password: ${password}\n` +
            `› Server: ${global.domain}`
        );
    }

    // ── Create Server ──
    let server;
    try {
        const resServer = await axios.post(`${global.domain}/api/application/servers`, {
            name: username,
            description: deskripsi,
            user: user.id,
            egg: parseInt(global.eggs),
            docker_image: "ghcr.io/parkervcp/yolks:nodejs_18",
            startup: startupCmd,
            environment: {
                INST: "npm",
                USER_UPLOAD: "0",
                AUTO_UPDATE: "0",
                CMD_RUN: "npm start",
                JS_FILE: "index.js",
                MAIN_FILE: "index.js"
            },
            limits: { memory: memo || 1024, swap: 0, disk: disk || 5120, io: 500, cpu: cpu || 100 },
            feature_limits: { databases: 0, backups: 0, allocations: 0 },
            deploy: { locations: [parseInt(global.locc)], dedicated_ip: false, port_range: [] }
        }, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${global.plta}`
            },
            timeout: 15000
        });

        const res = resServer.data;
        if (res.errors) {
            const errMsg = res.errors.map(e => e.detail || JSON.stringify(e)).join("\n");
            return await ctx.reply(
                `» *Server Creation Failed*\n\n` +
                `\`\`\`\n${errMsg}\n\`\`\`\n\n` +
                `_Please check your server configuration and try again._`
            );
        }
        server = res.attributes;
    } catch (error) {
        console.error("[createPanel] Server creation error:", error.response?.data || error.message);
        const status = error.response?.status || "N/A";
        const detail = error.response?.data?.errors?.[0]?.detail || error.message || "Unknown error";
        return await ctx.reply(
            `» *Server Creation Error*\n\n` +
            `› Status: ${status}\n` +
            `› Detail: ${detail}\n\n` +
            `_Please check your panel configuration and try again._`
        );
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // ── PING2 STYLE CONFIRMATION (Outer Message + Booking Card) ──
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const ownerNumber = config?.owner?.id || "255777580820";
    const phoneFormatted = ownerNumber.replace(/[^0-9]/g, '');
    const groupLink = config?.bot?.groupLink || "https://chat.whatsapp.com/EWlNm6bMYJCELwzvnmboyC";
    const footer = config?.msg?.footer || `© ${config?.bot?.name || "BIGST4CK"}`;

    // ── Inner Description (Booking Card) ──
    const bookingDescription =
        `» *Server Details*\n\n` +
        ` › 🚀*Server Created Successfully!*\n\n` +
        `› User ID: ${user.id}\n` +
        `› Server ID: ${server.id}\n` +
        `› RAM: ${memo || 1024} MB\n` +
        `› Disk: ${disk || 5120} MB\n` +
        `› CPU: ${cpu || 100}%\n\n` +
        `_Credentials have been sent to the target number._`;

    // ── Outer Message ──
    const outerBody =
        `» 🚀 *Server Created!*\n\n` +
        `› Name: ${username}\n` +
        `› RAM: ${memo || 1024} MB\n` +
        `› Disk: ${disk || 5120} MB\n` +
        `› CPU: ${cpu || 100}%\n\n` +
        `_Tap the button below for full details._`;

    // ── Send Interactive Message (Ping2 Style) ──
    await ctx.core.relayMessage(ctx._msg.key.remoteJid, {
        messageContextInfo: {
            threadId: [],
            deviceListMetadata: { senderKeyIndexes: [], recipientKeyIndexes: [] },
            deviceListMetadataVersion: 2
        },
        interactiveMessage: {
            header: {
                title: "Server Created",
                hasMediaAttachment: false
            },
            body: {
                text: outerBody
            },
            footer: { text: footer },
            nativeFlowMessage: {
                buttons: [{
                    name: "booking_confirmation",
                    buttonParamsJson: JSON.stringify({
                        start_datetime: new Date().toISOString(),
                        end_datetime: new Date(Date.now() + 600000).toISOString(),
                        location: "BIGST4CK Panel",
                        booking_url: groupLink,
                        phone_number: phoneFormatted,
                        booking_management_url: `https://wa.me/${phoneFormatted}`,
                        description: bookingDescription,
                        email: "",
                        display_text: "View Server Details",
                        display_content: {
                            display_language: "en",
                            display_meeting_type: "Server Information",
                            display_bottom_sheet_header: "Server Details",
                            display_add_to_calendar_cta_text: "SERVER",
                            display_view_on_maps_cta_text: "View Panel",
                            display_manage_booking_cta_text: "Contact",
                            display_manage_booking_not_supported_text: "Server Info",
                            display_read_more: "View Details"
                        }
                    })
                }],
                messageParamsJson: "{}"
            },
            contextInfo: {
                mentionedJid: [],
                groupMentions: [],
                statusAttributions: [],
                stanzaId: "StatusBiz",
                participant: "0@s.whatsapp.net",
                quotedMessage: {
                    contactMessage: {
                        displayName: config?.bot?.name || "BIGST4CK",
                        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${config?.bot?.name || "BIGST4CK"} Bot\nFN:${config?.bot?.name || "BIGST4CK"} Bot\nORG:${config?.bot?.name || "BIGST4CK"};\nTEL;type=CELL;type=VOICE;waid=${phoneFormatted}:${phoneFormatted}\nEND:VCARD`
                    }
                },
                remoteJid: "status@broadcast"
            }
        }
    }, {
        additionalNodes: [{
            tag: "biz",
            attrs: {},
            content: [{
                tag: "interactive",
                attrs: { type: "native_flow", v: "1" },
                content: [{ tag: "native_flow", attrs: { v: "9", name: "mixed" } }]
            }]
        }]
    });
}

module.exports = createPanel;