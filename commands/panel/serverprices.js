module.exports = {
    name: "serverprices",
    aliases: ["sellservers", "prices", "serverlist"],
    category: "panel",
    permissions: { coin: 0 },
    code: async (ctx) => {
        try {
            const prefix = ctx.used.prefix;
            const ownerNumber = config?.owner?.id || "255636756591";
            const phoneFormatted = ownerNumber.replace(/[^0-9]/g, '');
            const groupLink = config?.bot?.groupLink || "https://chat.whatsapp.com/JgHII0iCl42JD2mGoJSwji";
            const footer = config?.msg?.footer || `© ${config?.bot?.name || "BIGST4CK"}`;

            const plans = [];
            const prices = [1500, 2500, 3500, 5000, 6500, 8000, 9500, 11000, 13000];
            const cpus = [50, 100, 150, 200, 250, 300, 350, 400, 450];
            const disks = [5, 10, 15, 20, 25, 30, 35, 40, 45];

            for (let i = 1; i <= 9; i++) {
                plans.push({
                    name: `${i} GB`,
                    ram: `${i} GB`,
                    cpu: `${cpus[i-1]}%`,
                    disk: `${disks[i-1]} GB`,
                    price: `${prices[i-1].toLocaleString()} TZS`
                });
            }

            plans.push({
                name: "Unlimited",
                ram: "∞",
                cpu: "∞",
                disk: "∞",
                price: "25,000 TZS"
            });

            let fullDetails = `» *SERVER PLANS (Monthly)*\n\n`;
            plans.forEach((p, i) => {
                const num = i + 1;
                fullDetails += `${num}. › *${p.name}*\n`;
                fullDetails += `   › RAM: ${p.ram}\n`;
                fullDetails += `   › CPU: ${p.cpu}\n`;
                fullDetails += `   › Disk: ${p.disk}\n`;
                fullDetails += `   › Price: ${p.price}\n\n`;
            });
            fullDetails += `» *CONTACT US*\n`;
            fullDetails += `› Telegram: t.me/bigmanj09\n`;
            fullDetails += `› WhatsApp: wa.me/255636756591\n`;
            fullDetails += `› Email: bigmanj.tech@gmail.com\n\n`;
            fullDetails += `_Contact us to order or for custom quotes._`;

            const outerBody =
                `» *Server Hosting Plans*\n\n` +
                `› 1 GB to Unlimited plans available\n` +
                `› Affordable monthly pricing\n` +
                `› Reliable & secure hosting\n\n` +
                `_Tap the button below for full details._`;

            await ctx.core.relayMessage(ctx._msg.key.remoteJid, {
                messageContextInfo: {
                    threadId: [],
                    deviceListMetadata: { senderKeyIndexes: [], recipientKeyIndexes: [] },
                    deviceListMetadataVersion: 2
                },
                interactiveMessage: {
                    header: {
                        title: "🖥️ Server Plans",
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
                                location: "BIGST4CK Hosting",
                                booking_url: groupLink,
                                phone_number: phoneFormatted,
                                booking_management_url: `https://wa.me/${phoneFormatted}`,
                                description: fullDetails,
                                email: "",
                                display_text: "📊 View Server Plans",
                                display_content: {
                                    display_language: "en",
                                    display_meeting_type: "Server Hosting",
                                    display_bottom_sheet_header: "📋 Server Plans",
                                    display_add_to_calendar_cta_text: "HOSTING",
                                    display_view_on_maps_cta_text: "View Plans",
                                    display_manage_booking_cta_text: "📱 Contact",
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

        } catch (error) {
            console.error("[serverprices] Error:", error);
            await ctx.reply("❌ Failed to load server prices.");
        }
    }
};