# BIGST4CK 
![BIGST4CK](https://files.catbox.moe/519eum.png)

#  BIGST4CK

**Unique WhatsApp Bot with advanced features**  
Built for fun, entertainment, and automation.

[![Fork](https://img.shields.io/badge/Fork-Repository-2ea44f?style=for-the-badge&logo=github)](https://github.com/bigtechs2/BIGST4CK/fork)
[![Download ZIP](https://img.shields.io/badge/Download-ZIP-2ea44f?style=for-the-badge&logo=github)](https://github.com/bigtechs2/BIGST4CK/archive/refs/heads/main.zip)
[![Contact Owner](https://img.shields.io/badge/Contact_Owner-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://wa.me/255636756591)
[![License](https://img.shields.io/github/license/bigtechs2/BIGST4CK?style=for-the-badge)](https://github.com/bigtechs2/BIGST4CK/blob/main/LICENSE)
[![Version](https://img.shields.io/github/v/release/bigtechs2/BIGST4CK?style=for-the-badge)](https://github.com/bigtechs2/BIGST4CK/releases)
[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/new/template?template=https://github.com/bigtechs2/BIGST4CK)
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/bigtechs2/BIGST4CK)
---

## 📌 Is this bot official?

**Yes and no.**  
This bot is developed and maintained by **bigmanj tech ™** – it is **officially supported** by the author, but it is **not an official WhatsApp product**. It is a community project that uses the WhatsApp Web protocol (via Baileys) to provide an automated assistant. **Use it responsibly** and comply with WhatsApp’s Terms of Service.

> 💡 **Advice from the author:**  
> Always keep your bot updated, avoid spamming, and respect group admins. This bot is free and open‑source – if you like it, consider ⭐ starring the repo and sharing it with friends!

---

## ✨ Features

| Category | Commands / Features |
|----------|----------------------|
| **🤖 AI Chat** | ChatGPT, Gemini, Claude, DeepSeek, Copilot, Perplexity, Qwen, Felo, etc. |
| **🎨 AI Image Generation** | Flux, Gemmy, MagicStudio, LabsGen, Text2Image, DeepGen, NSFW Generator |
| **📥 Media Downloader** | YouTube (audio/video), TikTok, Instagram, Facebook, Twitter, Spotify, Pinterest, MediaFire, Google Drive, Telegram Stickers |
| **🎮 Interactive Games** | Trivia (OpenTDB), Word Game, Family100, Cak Lontong, Tebak Gambar, Asah Otak, Susun Kata, Teka‑teki, etc. |
| **🛠️ Group Management** | Mute/Unmute, Warn/Unwarn, Kick, Promote/Demote, Approve/Reject join requests, Group settings (open/close/lock), Anti‑spam, Anti‑link, Anti‑toxic, Anti‑media, etc. |
| **👤 Profile & Economy** | Coins, XP, Leveling, Leaderboard, AFK, Transfer coins, Claim daily/weekly/monthly rewards, Premium system |
| **🖼️ Rich Interactive Menus** | AIRich product cards, ButtonV2, Carousel, Native Flow, Copy buttons, Suggestion pills |
| **🔧 Utility Tools** | OCR, Screenshot website, Remove background, HD upscale (image/video), Upload to Catbox, URL shortener, Weather, Quran/Bible lookup, Translate, TTS, Fetch URL, Google Image search, Pinterest/Pixiv search, WhatAnime, WhatMusic (Shazam), YouTube summary |
| **👑 Owner Commands** | Broadcast, Ban/Unban, Add/Remove premium, Add/Remove rental, Change bot mode, Restart, Update bot, etc. |
| **📦 Store & Pricing** | Built‑in store with product cards and pricing plans (monthly/yearly) |

---

## 🚀 Deployment Guides

### 1️⃣ Deploy on Pterodactyl Panel (Hosting)
1. Upload all bot files to your `/home/container/` directory.
2. Make sure `package.json` is present.
3. Go to your panel, set **Main File** to `index.js`.
4. Click **Restart** – the panel will install dependencies automatically.
5. When the bot starts, it will show a **pairing code** (configured in `config.json`). Use that code on WhatsApp to connect.

### 2️⃣ Deploy on Bot‑Hosting.net
1. Log in to your Bot‑Hosting.net panel.
2. Create a new server (Node.js environment).
3. Upload the bot files via **Files** or **FTP**.
4. Set **Entry Point** to `index.js`.
5. Click **Start** – the bot will install dependencies and start.
6. Look in the console for the pairing code.

### 3️⃣ Deploy on Replit
1. Fork this repository to your GitHub account.
2. Create a new Replit, choose **Import from GitHub**.
3. Select your forked repo.
4. In the Shell, run `npm install`.
5. Run `npm start` – the bot will start and show the pairing code.

### 4️⃣ Deploy on Heroku
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/your-username/BIGST4CK)
1. Click the button above or create a new Heroku app.
2. Connect your GitHub repository.
3. Set `MAIN_FILE` to `index.js` in the **Config Vars**.
4. Deploy the branch – Heroku will install dependencies automatically.
5. Check the logs for the pairing code.

### 5️⃣ Deploy on Railway
[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/new/template?template=https://github.com/your-username/BIGST4CK)
1. Click the button above or create a new Railway project.
2. Connect your GitHub repository.
3. Railway will detect `package.json` and run `npm install` automatically.
4. Set the **Start Command** to `npm start`.
5. Deploy and check the logs for the pairing code.

### 6️⃣ Deploy on a VPS (Ubuntu/Debian)
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git

# Clone the repository
git clone https://github.com/your-username/BIGST4CK.git
cd BIGST4CK

# Install dependencies
npm install

# Configure (copy example config and edit)
cp config.example.json config.json
nano config.json   # edit with your settings

# Start the bot
npm start
```

### 👥Contributors

· bigmanj tech ™ – Lead Developer & Maintainer

· bigtechs 2– Co-Developer & Tester

· bigtechs 1– Infrastructure & Hosting Support.

---

### 📄 License

This project is licensed under the MIT License – see the LICENSE file for details.


MIT License

Copyright (c) 2026 bigmanj tech 

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


---

### 🏷️ Bot Version

Current Version: v8.0.3

Check the releases page for changelogs and updates.
https://github.com/bigtechs2/BIGST4CK/issues.

---

### 👨‍💻 Owner & Support

· Author: bigmanj tech ™

· GitHub: bigtechs2

· WhatsApp: Click to chat 
  https://wa.me/255636756591 .

---

### 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check the issues page or open a pull request.

---

### ⭐ Show your support

If you like this project, please give it a ⭐ on GitHub – it helps others discover it!

---
powered by bigmanj tech ™ with ♥︎


<p align="center">
  <a href="https://github.com/bigtechs2/BIGST4CK/fork" style="text-decoration: none;">
    <img src="https://img.shields.io/badge/🍴_Fork_Now-2ea44f?style=for-the-badge&logo=github" alt="Fork">
  </a>
  <a href="https://github.com/bigtechs2/BIGST4CK/archive/refs/heads/main.zip" style="text-decoration: none;">
    <img src="https://img.shields.io/badge/📦_Download_ZIP-blue?style=for-the-badge&logo=github" alt="Download">
  </a>
  <a href="https://wa.me/255636756591" style="text-decoration: none;">
    <img src="https://img.shields.io/badge/📱_Contact_Owner-25D366?style=for-the-badge&logo=whatsapp&logoColor=white" alt="Contact">
  </a>
  <a href="https://github.com/bigtechs2/BIGST4CK" style="text-decoration: none;">
    <img src="https://img.shields.io/badge/⭐_Star_Repo-yellow?style=for-the-badge&logo=github" alt="Star">
  </a>
</p>