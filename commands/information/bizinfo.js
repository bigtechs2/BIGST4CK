module.exports = {
    name: "bizinfo",
    aliases: ["profile", "brand", "aboutme", "business"],
    category: "information",

    code: async (ctx) => {
        try {
            const chatId = ctx._msg.key.remoteJid;
            const footer = config?.msg?.footer || `© ${config?.bot?.name || "BIGST4CK"}`;

            // ── Contributors data (from config or fallback) ──
            const contributors = config?.owner?.contributors || [
                {
                    name: "bigtechs1",
                    number: "255777580820",
                    email: "bigmanj429@gmail.com",
                    website: "https://bigmanjtech.com",
                    group: "https://chat.whatsapp.com/JgHII0iCl42JD2mGoJSwji"
                },
                {
                    name: "bigtechs2",
                    number: "255636756591",
                    email: "bigmanj429@gmail.com",
                    website: "https://bigmanjtech.com",
                    group: "https://chat.whatsapp.com/JgHII0iCl42JD2mGoJSwji"
                },
                {
                    name: "bigmanjtech™",
                    number: "255636756591",
                    email: "bigmanj429@gmail.com",
                    website: "https://bigmanjtech.com",
                    group: "https://chat.whatsapp.com/JgHII0iCl42JD2mGoJSwji"
                }
            ];

            // ── Outer message ──
            let outerText = `📋 *${config?.bot?.name || "BIGST4CK"}*\n\n👥 *Contributors:*\n`;
            contributors.forEach((c, i) => {
                outerText += `  ${i + 1}. ${c.name}\n`;
            });
            outerText += `\n🔹 *Status:* 🟣 Verified ✓`;

            // ── Booking card details ──
            let bookingText = `📋 *${config?.bot?.name || "BIGST4CK"} - Full Details*\n\n`;
            contributors.forEach((c, i) => {
                const num = c.number.replace(/[^0-9]/g, '');
                bookingText += `👤 *${c.name}*\n`;
                bookingText += `  📱 Number: ${num}\n`;
                bookingText += `  📧 Email: ${c.email || "N/A"}\n`;
                bookingText += `  🌐 Website: ${c.website || "N/A"}\n`;
                bookingText += `  👥 Group: ${c.group || "N/A"}\n\n`;
            });
            bookingText += `🔹 *Status:* 🟣 Verified ✓\n\n_Tap the button below to view full team details._`;

            const mainNumber = contributors[2]?.number?.replace(/[^0-9]/g, '') || "255636756591";

            // ── Send interactive message with one button ──
            await ctx.core.relayMessage(chatId, {
                interactiveMessage: {
                    header: {
                        title: "🏢 Business Info",
                        hasMediaAttachment: false
                    },
                    body: {
                        text: outerText
                    },
                    footer: { text: footer },
                    nativeFlowMessage: {
                        buttons: [
                            {
                                name: "booking_confirmation",
                                buttonParamsJson: JSON.stringify({
                                    start_datetime: new Date().toISOString(),
                                    end_datetime: new Date(Date.now() + 600000).toISOString(),
                                    location: config?.bot?.name || "BIGST4CK",
                                    booking_url: "https://bigmanjtech.com",
                                    phone_number: mainNumber,
                                    booking_management_url: `https://wa.me/${mainNumber}`,
                                    description: bookingText,
                                    email: "",
                                    display_text: "📞 View Team Details",
                                    display_content: {
                                        display_language: "en",
                                        display_meeting_type: "Business Information",
                                        display_bottom_sheet_header: "📋 Developer Team",
                                        display_add_to_calendar_cta_text: "TEAM",
                                        display_view_on_maps_cta_text: "View Website",
                                        display_manage_booking_cta_text: "📱 Contact",
                                        display_manage_booking_not_supported_text: "Team Info",
                                        display_read_more: "View Details"
                                    }
                                })
                            }
                        ],
                        messageParamsJson: "{}"
                    },
                    contextInfo: {
                        mentionedJid: [],
                        groupMentions: [],
                        statusAttributions: [],
                        stanzaId: "StatusBiz",
                        participant: "0@s.whatsapp.net",
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
            console.error("[bizinfo] Error:", error);
            await tools.cmd.handleError(ctx, error);
        }
    }
};