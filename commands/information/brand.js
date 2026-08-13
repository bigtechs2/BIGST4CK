module.exports = {
    name: "brand",
    aliases: ["about", "info", "bigmanjtech"],
    category: "information",
    permissions: { coin: 0 },
    code: async (ctx) => {
        try {
            const ownerNumber = config?.owner?.id || "255636756591";
            const phoneFormatted = ownerNumber.replace(/[^0-9]/g, '');
            const groupLink = config?.bot?.groupLink || "https://chat.whatsapp.com/EWlNm6bMYJCELwzvnmboyC";
            const channelLink = config?.bot?.channellink || "https://whatsapp.com/channel/0029VbDJJY19WtC1T0Vgqp0v";
            const websiteLink = config?.bot?.website || "https://bigweb.onrender.com";
            const footer = config?.msg?.footer || `© ${config?.bot?.name || "BIGST4CK"}`;

            const bookingDescription =
                `» *BIGST4CK by bigmanjtech™*\n` +
                `  › Built with ♥︎ in Tanzania\n\n` +
                `» *Who We Are*\n` +
                `  › Tanzanian technology brand\n` +
                `  › AI-powered bots & automation\n` +
                `  › Server hosting solutions\n\n` +
                `» *What We Do*\n` +
                `  › WhatsApp & Telegram Bots\n` +
                `  › Server Hosting (1GB – Unlimited)\n` +
                `  › Pterodactyl Panel Management\n` +
                `  › Website Development\n` +
                `  › Automation & Digital Solutions\n\n` +
                `» *Our Products*\n` +
                `  › BIGST4CK – WhatsApp Bot\n` +
                `  › BIGST4CK – Telegram Bot\n` +
                `  › BigWeb – Website\n` +
                `  › BigPanel – Pterodactyl Management\n\n` +
                `» *Our Team*\n` +
                `  › bigtechs1 – Lead Developer\n` +
                `  › bigtechs2 – Developer\n` +
                `  › bigtechs3 – Upcoming Tech\n\n` +
                `» *Mission*\n` +
                `  › Making technology accessible,\n` +
                `  › affordable, and useful for everyone.\n\n` +
                `» *Values*\n` +
                `  › Innovation · Simplicity · Reliability\n` +
                `  › Community-Driven\n\n` +
                `» *Connect With Us*\n` +
                `  › WhatsApp: wa.me/${phoneFormatted}\n` +
                `  › Email: bigmanj.tech@gmail.com\n` +
                `  › Group: BIGST4CK Family\n` +
                `  › Channel: BIGST4CK Updates\n` +
                `  › Website: ${websiteLink}\n\n` +
                `_Built with ♥︎ by bigmanjtech™_`;

            const outerBody =
                `» *BIGST4CK by bigmanjtech™*\n` +
                `  › Built with ♥︎ in Tanzania\n\n` +
                `» *Your Tech Hub*\n` +
                `  › AI Bots · Server Hosting · Automation\n\n` +
                `_Tap the button below for full details._`;

            await ctx.core.relayMessage(ctx._msg.key.remoteJid, {
                messageContextInfo: {
                    threadId: [],
                    deviceListMetadata: { senderKeyIndexes: [], recipientKeyIndexes: [] },
                    deviceListMetadataVersion: 2
                },
                interactiveMessage: {
                    header: {
                        title: "🖥️ BIGST4CK",
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
                                location: "BIGST4CK",
                                booking_url: websiteLink,
                                phone_number: phoneFormatted,
                                booking_management_url: `https://wa.me/${phoneFormatted}`,
                                description: bookingDescription,
                                email: "bigmanj.tech@gmail.com",
                                display_text: "📊 View Brand Details",
                                display_content: {
                                    display_language: "en",
                                    display_meeting_type: "Brand Information",
                                    display_bottom_sheet_header: "📋 BIGST4CK",
                                    display_add_to_calendar_cta_text: "BRAND",
                                    display_view_on_maps_cta_text: "View Website",
                                    display_manage_booking_cta_text: "📱 Contact",
                                    display_manage_booking_not_supported_text: "Brand Info",
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
            console.error("[brand] Error:", error);
            await ctx.reply("❌ Failed to load brand information.");
        }
    }
};