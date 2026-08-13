const axios = require("axios");

module.exports = {
    name: "weather",
    aliases: ["cuaca", "forecast"],
    category: "tool",
    code: async (ctx) => {
        try {
            const args = ctx.args;
            if (!args.length) {
                return await ctx.reply(
                    `❌ *Usage:* ${ctx.used.prefix}weather <city>\n` +
                    `Example: ${ctx.used.prefix}weather London`
                );
            }

            const city = args.join(" ");
            const userAgent = "Mozilla/5.0 (compatible; MyBot/1.0)";

            const geoUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`;
            const geoRes = await axios.get(geoUrl, {
                headers: { 'User-Agent': userAgent },
                timeout: 10000
            });

            if (!geoRes.data || geoRes.data.length === 0) {
                return await ctx.reply("❌ City not found. Please check the spelling.");
            }

            const { lat, lon, display_name } = geoRes.data[0];

            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`;
            const weatherRes = await axios.get(weatherUrl, { timeout: 10000 });
            const current = weatherRes.data.current_weather;

            const condition = getWeatherDescription(current.weathercode);
            const iconCode = getIcon(current.weathercode);
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

            const weatherDetails =
                `🌍 *${display_name}*\n\n` +
                `🌡️ *Temperature:* ${current.temperature}°C\n` +
                `💨 *Wind Speed:* ${current.windspeed} km/h\n` +
                `🧭 *Wind Direction:* ${current.winddirection}°\n` +
                `☁️ *Condition:* ${condition}`;

            const bookingDescription = `🌤️ *Weather Report*\n\n${weatherDetails}`;

            const ownerNumber = config?.owner?.id || "255636756591";
            const phoneFormatted = ownerNumber.replace(/[^0-9]/g, '');
            const groupLink = config?.bot?.groupLink || "https://chat.whatsapp.com/JgHII0iCl42JD2mGoJSwji";
            const footer = config?.msg?.footer || "© BIGST4CK by bigmanjtech™";

            await ctx.core.relayMessage(ctx._msg.key.remoteJid, {
                interactiveMessage: {
                    header: {
                        title: "🌤️ Weather Report",
                        hasMediaAttachment: false
                    },
                    body: {
                        text: "🔍 *Tap the button below to view full weather details.*"
                    },
                    footer: {
                        text: footer
                    },
                    nativeFlowMessage: {
                        buttons: [{
                            name: "booking_confirmation",
                            buttonParamsJson: JSON.stringify({
                                start_datetime: new Date().toISOString(),
                                end_datetime: new Date(Date.now() + 600000).toISOString(),
                                location: "BIGTECHS",
                                booking_url: groupLink,
                                phone_number: phoneFormatted,
                                booking_management_url: `https://wa.me/${phoneFormatted}`,
                                description: bookingDescription,
                                email: "",
                                display_text: "🌡️ View Weather Details",
                                display_content: {
                                    display_language: "en",
                                    display_meeting_type: "Weather Information",
                                    display_bottom_sheet_header: "🌡️ Weather Details",
                                    display_add_to_calendar_cta_text: "WEATHER",
                                    display_view_on_maps_cta_text: "View Location",
                                    display_manage_booking_cta_text: "📱 dev",
                                    display_manage_booking_not_supported_text: "Weather Info",
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
            console.error("[weather] Error:", error);
            let msg = "❌ Failed to get weather data.\n";
            if (error.code === "ECONNABORTED") {
                msg = "❌ Request timed out – please try again.";
            } else if (error.response?.status === 404) {
                msg = "❌ City not found. Please check the spelling.";
            } else {
                msg += "The weather API is temporarily unavailable. Please try again later.";
            }
            await ctx.reply(msg);
        }
    }
};

function getWeatherDescription(code) {
    const map = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Depositing rime fog",
        51: "Light drizzle",
        53: "Moderate drizzle",
        55: "Dense drizzle",
        61: "Slight rain",
        63: "Moderate rain",
        65: "Heavy rain",
        71: "Slight snow fall",
        73: "Moderate snow fall",
        75: "Heavy snow fall",
        80: "Slight rain showers",
        81: "Moderate rain showers",
        82: "Violent rain showers",
        95: "Thunderstorm",
        96: "Thunderstorm with slight hail",
        99: "Thunderstorm with heavy hail"
    };
    return map[code] || "Unknown";
}

function getIcon(code) {
    const map = {
        0: "01d",
        1: "02d",
        2: "03d",
        3: "04d",
        45: "50d",
        48: "50d",
        51: "09d",
        53: "09d",
        55: "09d",
        61: "10d",
        63: "10d",
        65: "10d",
        71: "13d",
        73: "13d",
        75: "13d",
        80: "09d",
        81: "09d",
        82: "09d",
        95: "11d",
        96: "11d",
        99: "11d"
    };
    return map[code] || "01d";
}