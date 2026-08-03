![BIGST4CK Bot Demo](https://files.catbox.moe/0hmdof.png)

# 🤖 BIGST4CK WhatsApp Bot

![Version](https://img.shields.io/badge/version-8.0.3-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

**Advanced WhatsApp Bot with AI, Downloaders, and Group Management**

---

## 📌 Table of Contents

- [Features](#features)
- [Commands](#commands)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [Contributors](#contributors)
- [License](#license)
- [Support / Contact](#support--contact)

---

## ✨ Features

- 🤖 **AI Chat** – ChatGPT, DeepSeek, Gemini, Claude, Meta AI
- 🎵 **Downloaders** – YouTube, Spotify, Facebook, TikTok, Instagram
- 👥 **Group Management** – Anti-bot, Warn, Kick, Promote, Demote, Mute
- 🎨 **Rich UI** – AIRich messages, interactive buttons, booking cards
- 📊 **User Status** – Level, coins, badges, uptime tracking
- 🔧 **Custom Commands** – Add/edit commands on-the-fly with `.addcmd`

---

## 📋 Commands

| Category | Commands |
|----------|----------|
| **AI Chat** | `.chatgpt`, `.deepseek`, `.gemini`, `.claude`, `.meta`, `.unlimitedai`, `.publicai` |
| **Downloader** | `.play`, `.facebookdl`, `.ytmp3`, `.ytmp4`, `.tiktokdl`, `.instagramdl` |
| **Group** | `.antibot`, `.warn`, `.kick`, `.promote`, `.demote`, `.mute`, `.setoption` |
| **Information** | `.about`, `.status`, `.uptime`, `.owner`, `.bizinfo` |
| **Owner** | `.addcmd`, `.reload`, `.setprefix`, `.run` |
| **Tools** | `.banana`, `.table`, `.weather`, `.poll` |

> Use `.menu` to open the interactive main menu.

---

## 🚀 Installation

### Prerequisites
- **Node.js** 18+
- **npm** or **yarn**
- A **WhatsApp** account

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/your-username/BIGST4CK.git
cd BIGST4CK

# 2. Install dependencies
npm install

# 3. Copy and configure the example config
cp config.example.json config.json
```

---

## ⚙️ Configuration

Edit `config.json` with your details:

```json
{
  "bot": {
    "name": "BIGST4CK",
    "phoneNumber": "255705517165",
    "thumbnail": "https://files.catbox.moe/yryprc.jpg",
    "groupLink": "https://chat.whatsapp.com/JgHII0iCl42JD2mGoJSwji"
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

| Key | Description |
|-----|-------------|
| `bot.phoneNumber` | Your WhatsApp number (international format) |
| `system.prefix` | Command prefix (default: `.`) |
| `system.usePairingCode` | Use pairing code instead of QR scan |

---

## 🏃 Usage

### Start the Bot

```bash
npm start
```

### Development Mode

```bash
npm run dev
```

### With PM2

```bash
npm run start:pm2
pm2 logs
```

Once running, scan the QR code or use the pairing code to connect your WhatsApp account.

---

## 🖼️ Screenshots

![BIGST4CK Bot Demo](https://files.catbox.moe/0hmdof.png)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 👥 Contributors

| Name | Role |
|------|------|
| **bigmanjtech™** | Founder & Lead Developer |
| **bigtechs1** | Contributor |
| **bigtechs2** | Contributor |

---

## 📄 License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

---

## 💬 Support / Contact

| Name | Contact |
|------|---------|
| **[bigtechs1](https://wa.me/255777580820)** | WhatsApp |
| **[bigtechs2](https://wa.me/255636756591)** | WhatsApp |
| **[bigtechs3](https://wa.me/255705517165)** | WhatsApp |
| **[Join Group](https://chat.whatsapp.com/JgHII0iCl42JD2mGoJSwji)** | WhatsApp Group |
| **[bigmanjtech™](mailto:bigmanj.tech@gmail.com)** | Email |

---

**Built with ❤️ by bigmanjtech™**