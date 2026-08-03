🤖 BIGST4CK WhatsApp Bot

Advanced WhatsApp Bot with AI, Downloaders, and Group Management

Built with ❤️ by bigmanjtech™

https://img.shields.io/badge/version-8.0.3-blue
https://img.shields.io/badge/Node.js-18+-green
https://img.shields.io/badge/WhatsApp-Multi_Device-25D366

---

📌 Table of Contents

· About
· Features
· Commands
· Installation
· Configuration
· Running the Bot
· Deployment
· Contributors
· License

---

📖 About

BIGST4CK is a powerful, feature-rich WhatsApp bot built with Baileys and Node.js. It combines AI chat, media downloaders, group management, and interactive UI components to provide a seamless experience for users.

---

✨ Features

🤖 AI & Chat

· ChatGPT – AI chat with session memory
· DeepSeek – DeepSeek Flash AI assistant
· Gemini – Google Gemini 2.5 Flash
· Claude – Anthropic Claude AI
· Meta AI – Meta AI (Llama) integration
· Unlimited AI – Free, unlimited AI chat
· Public AI – AI for everyone

🎵 Downloaders

· play – Search and download music from YouTube/Spotify
· facebookdl – Download Facebook videos (reels, posts)
· ytmp3 – Download YouTube audio
· ytmp4 – Download YouTube video
· tiktokdl – Download TikTok videos
· instagramdl – Download Instagram posts/reels

👥 Group Management

· antibot – Auto-kick bots that join the group
· warn – Warn rule-breaking members
· kick – Remove members
· promote / demote – Admin management
· mute / unmute – Mute members
· setoption – Configure anti-spam, anti-link, anti-toxic, etc.
· welcome / goodbye – Custom join/leave messages

🛠 Utilities

· menu – Interactive main menu
· status – User & system status with profile picture
· uptime – Bot uptime with AIRich table
· about – Bot information
· owner – Contact owner
· donate – Support the project

🎨 UI & UX

· AIRich – Rich formatted messages (tables, images, videos)
· ButtonV2 – Interactive buttons
· Booking Cards – Native WhatsApp flow messages
· Progress Bars – Visual level and status bars

---

📋 Commands

AI Chat

Command Aliases Description
.chatgpt ai, gpt ChatGPT with session & image support
.deepseek ds, deepseekai DeepSeek Flash AI
.gemini geminiai, googleai Google Gemini 2.5 Flash
.claude claudeai, anthropic Claude AI by Anthropic
.meta metaai, llama, askmeta Meta AI (Llama)
.unlimitedai uai, freeai Free unlimited AI chat
.publicai pai, aipublic Public AI for everyone

Downloaders

Command Aliases Description
.play – Search & download music (YouTube/Spotify)
.facebookdl facebook, fb, fbdl Download Facebook videos
.ytmp3 – Download YouTube audio
.ytmp4 – Download YouTube video
.tiktokdl – Download TikTok videos
.instagramdl – Download Instagram posts

Information

Command Aliases Description
.about bot, infobot Bot information
.status stats, botinfo User & system status
.uptime runtime Bot uptime
.owner creator, developer Contact owner
.bizinfo profile, brand, business Business profile

Group

Command Aliases Description
.antibot nobots Auto-kick bots
.warn – Warn a member
.warnings – View warnings
.kick remove, expel Remove member
.promote makeadmin Promote to admin
.demote removeadmin Demote admin
.mute silence Mute a member
.unmute unsilence Unmute a member

Owner

Command Aliases Description
.addcmd editcmd, savecmd Add/edit commands (auto-loads)
.reload refresh, r Reload all commands
.setprefix changeprefix, prefix Change bot prefix
.run eval, exec, > Run JavaScript code

Tools

Command Aliases Description
.banana nanobanana, editimage Edit images with AI
.table plans, pricing Server plans table
.weather cuaca, forecast Weather report

---

🚀 Installation

Prerequisites

· Node.js 18+
· npm or yarn
· A WhatsApp account (phone number)

1. Clone the Repository

```bash
git clone https://github.com/your-username/BIGST4CK.git
cd BIGST4CK
```

2. Install Dependencies

```bash
npm install
```

3. Configure the Bot

Copy the example config and edit it:

```bash
cp config.example.json config.json
```

Fill in your details in config.json:

```json
{
  "bot": {
    "name": "BIGST4CK",
    "phoneNumber": "255705517165",
    "thumbnail": "https://files.catbox.moe/yryprc.jpg",
    "groupLink": "https://chat.whatsapp.com/..."
  },
  "system": {
    "prefix": ".",
    "usePairingCode": true,
    "customPairingCode": "BIGTECHS",
    "timeZone": "Africa/Tanzania"
  },
  "owner": {
    "name": "bigmanjtech™",
    "id": "255636756591"
  }
}
```

4. Create .env File (Optional)

```env
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxx
```

---

🏃 Running the Bot

Development Mode

```bash
npm run dev
```

Production Mode

```bash
npm start
```

Using PM2

```bash
npm run start:pm2
pm2 logs
```

Using Docker (if available)

```bash
docker build -t bigst4ck .
docker run -d --name bigst4ck -v $(pwd)/database:/app/database bigst4ck
```

---

📂 Project Structure

```
BIGST4CK/
├── commands/
│   ├── ai-chat/          # AI commands
│   ├── downloader/       # Downloader commands
│   ├── group/            # Group management
│   ├── information/      # Info commands
│   ├── owner/            # Owner-only commands
│   └── tool/             # Utility commands
├── events/               # Event handlers
├── lib/                  # Core libraries
│   ├── client.js         # Main bot client
│   ├── handler.js        # Command handler
│   ├── NIXCODE.js        # AIRich implementation
│   └── group.js          # Group utilities
├── tools/                # Helper functions
├── database/             # JSON database (auto-created)
├── state/                # Authentication state
├── index.js              # Entry point
├── main.js               # Bot main file
├── config.json           # Configuration
└── package.json          # Dependencies
```

---

⚙️ Configuration

config.json Options

Key Description
bot.name Bot display name
bot.phoneNumber WhatsApp phone number (international format)
bot.thumbnail Default thumbnail URL
bot.groupLink WhatsApp group invite link
system.prefix Command prefix (default: .)
system.usePairingCode Use pairing code instead of QR scan
system.customPairingCode Custom pairing code
system.timeZone Timezone (e.g., Africa/Tanzania)
owner.name Owner's name
owner.id Owner's WhatsApp number

---

🔒 Environment Variables

Variable Description
DEEPSEEK_API_KEY API key for DeepSeek AI
BOT_TOKEN (Telegram bot token – if used)

---

🌐 Deployment

Deploy on Pterodactyl

1. Create a new server
2. Set Node.js as the environment
3. Upload your files
4. Set MAIN_FILE to index.js
5. Run npm install and start

Deploy on VPS

```bash
git clone https://github.com/your-username/BIGST4CK.git
cd BIGST4CK
npm install
npm install -g pm2
npm run start:pm2
```

Deploy on Heroku

```bash
heroku create bigst4ck
heroku config:set PLATFORM=whatsapp
git push heroku main
```

---

🤝 Contributors

Name Role Contact
bigmanjtech™ Founder & Lead Developer GitHub
bigtechs1 Contributor WhatsApp: 255636756591
bigtechs2 Contributor WhatsApp: 255705517165

---

📄 License

MIT License – see the LICENSE file for details.

---

⚠️ Disclaimer

This bot is not affiliated with WhatsApp Inc. Use at your own risk. The developers are not responsible for any account bans or penalties.

---

💬 Support

· WhatsApp Group: Join Here
· GitHub Issues: Report Bug
· Contact Owner: .owner command in the bot

---

🌟 Star the Project

If you find this useful, please give it a ⭐ on GitHub!

---

Built with ❤️ by bigmanjtech™