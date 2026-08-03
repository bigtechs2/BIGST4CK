const moment = require("moment-timezone");

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
        return await ctx.reply(`Example: ${ctx.used.prefix}${ctx.used.command} username-nomer`);
    }

    const username = t[0];
    const targetJid = ctx.quoted
        ? ctx.quoted.sender
        : (t[1] ? t[1].replace(/[^0-9]/g, "") + "@s.whatsapp.net" : ctx.mentionedJid?.[0]);

    if (!targetJid) return;

    const email = `${username}@gmail.com`;
    const deskripsi = moment().tz(config.system.timeZone || "Africa/Nairobi").format("dddd, D MMMM - YYYY");

    const checkExists = (await ctx.core.onWhatsApp(targetJid.split("@")[0]))?.[0] || {};
    const password = checkExists.exists ? randomKarakter(5) : t[3];

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
        }
    }).catch(e => ({ data: e.response?.data }));

    const data = resUser.data;
    if (data.errors) return await ctx.reply(JSON.stringify(data.errors[0], null, 2));

    const user = data.attributes;

    const eggRes = await axios.get(`${global.domain}/api/application/nests/5/eggs/${global.eggs}`, {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${global.plta}`
        }
    });

    await ctx.reply("_Creating Server..._");

    const startupCmd = eggRes.data.attributes.startup;

    // ━━━ Kirim Panel Data via Button (cta_copy x2 + cta_url) ━━━
    await new Button(ctx.core)
        .setTitle("Panel Data")
        .setBody(
            `*HERE IS YOUR PANEL DATA*\n\n` +
            `• Username: ${user.username}\n` +
            `• Password: ${password}\n` +
            `• Server: ${global.domain}\n\n` +
            `Keep your panel data safe`
        )
        .setImage("https://i.pinimg.com/736x/e9/84/8e/e9848e90f9a4cc57c839c6e579472169.jpg")
        .addCopy("Copy Username", user.username)
        .addCopy("Copy Password", String(password))
        .addUrl("Open Domain", global.domain, false)
        .send(targetJid, { quoted: null });

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
            JS_FILE: "index.js"
        },
        limits: { memory: memo, swap: 0, disk, io: 500, cpu },
        feature_limits: { databases: 0, backups: 0, allocations: 0 },
        deploy: { locations: [parseInt(global.locc)], dedicated_ip: false, port_range: [] }
    }, {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${global.plta}`
        }
    }).catch(e => ({ data: e.response?.data }));

    const res = resServer.data;
    if (res.errors) return await ctx.reply(JSON.stringify(res.errors[0], null, 2));

    const server = res.attributes;

    await ctx.reply(
        `SUCCESSFULLY CREATE PANEL\n\n` +
        `ID User : ${user.id}\n` +
        `ID Server : ${server.id}\n` +
        `Ram ${memo}\n` +
        `Disk ${disk}\n` +
        `Cpu ${cpu}%\n\n` +
        `Username and password have been sent to the target number`
    );
}

module.exports = createPanel;