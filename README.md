# 📚 PDF Intelligence — Free AI Study Tool for Students

> Upload any PDF · Ask anything · Powered by Claude AI · 100% Free

![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB?style=flat&logo=react)
![Powered by Claude](https://img.shields.io/badge/Powered%20by-Claude%20AI-7C3AED?style=flat)
![Deploy on Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=flat&logo=vercel)
![Free to Use](https://img.shields.io/badge/Cost-Free%20to%20Start-22C55E?style=flat)

---

## 🎯 What Is This?

**PDF Intelligence** is a free, open-source AI workflow built specifically for students.

Upload any PDF — textbook, research paper, case study, or lecture notes — and get instant AI-powered answers. No monthly subscription. No login. No data stored.

Unlike tools like ChatGPT Plus ($20/month) or Adobe Acrobat AI ($15/month), this uses your own Anthropic API key with **$5 free credits** that cover your entire semester.

---

## ✨ Features

| Feature | Description |
|---|---|
| 📌 5 Key Points | Extracts the most important points in seconds |
| 📝 Instant Summary | Executive-style overview of any document |
| 🎯 Main Arguments | Key claims with supporting evidence |
| 📊 Key Statistics | All numbers, data & percentages pulled out |
| 💡 Insights & Implications | Actionable takeaways from any paper |
| ❓ Generate Quiz | 5 practice Q&A for exam prep |
| 💬 Free Chat | Ask anything in your own words |
| 📱 Cross-device | Works on mobile, tablet & desktop |
| 🔒 Private | Your PDF & key never leave your browser |

---

## 🎓 Perfect For Students

- 📖 **Exam Revision** — summarize 100-page textbook chapters instantly
- 📝 **Assignments** — extract arguments & stats from research papers
- 📚 **Literature Reviews** — process multiple papers quickly
- 🏛️ **Case Studies** — break down complex business or legal documents
- 🗒️ **Lecture Notes** — turn dense PDFs into easy summaries
- ✅ **Practice Tests** — auto-generate quiz questions before exams

---

## 💰 Cost Breakdown

| Item | Cost | Notes |
|---|---|---|
| Anthropic Free Credits | **$5 (free signup)** | ~500 PDF sessions |
| Vercel Hosting | **$0 forever** | Free plan is enough |
| GitHub | **$0 forever** | Free for public repos |
| After free credits | ~$0.003/question | Pay-as-you-go, no subscription |

> 💡 $5 free credits = roughly your entire semester covered

---

## 🚀 Setup in 5 Minutes

### Step 1 — Get Your Free API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up free — you get **$5 free credits** automatically
3. Go to **API Keys → Create Key**
4. Copy the key (starts with `sk-ant-api03-...`)

---

### Step 2 — Deploy on Vercel

1. Fork or clone this repo
2. Go to [vercel.com](https://vercel.com) → sign up with GitHub
3. Click **Add New Project** → select this repo
4. Make sure these settings are correct:

```
Framework Preset:   Create React App
Build Command:      npm run build
Output Directory:   build
Install Command:    npm install
```

5. Click **Deploy** → get your live URL in ~1 minute 🎉

---

### Step 3 — Use It

1. Open your Vercel URL
2. Enter your Anthropic API key (one-time setup)
3. Upload any PDF
4. Click a Quick Action or type your own question

---

## 📁 Project Structure

```
pdf-ai-tool/
├── src/
│   ├── App.jsx          ← Main app with full UI & API logic
│   └── index.js         ← React entry point
├── public/
│   └── index.html       ← Page title & meta tags
├── package.json         ← Dependencies & scripts
├── vercel.json          ← Vercel deploy config
└── README.md            ← This file
```

---

## ⚙️ How It Works

```
User uploads PDF
      ↓
PDF converted to Base64 in browser
      ↓
Sent directly to Anthropic API with user's question
      ↓
Claude AI reads the document & generates answer
      ↓
Answer displayed in chat UI
```

> 🔒 Nothing is stored. No database. No backend. No tracking. Everything happens in your browser.

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 |
| Styling | Inline CSS (zero dependencies) |
| AI Model | Claude Sonnet (Anthropic API) |
| Hosting | Vercel (free) |
| Auth | User's own API key — no backend needed |

---

## 🔗 Useful Links

- 🔑 [Get free Anthropic API key](https://console.anthropic.com)
- 🚀 [Deploy on Vercel](https://vercel.com)
- 📖 [Anthropic API docs](https://docs.anthropic.com)
- 💻 [React docs](https://react.dev)

---

## 🙌 Share With Your College Friends

If this helped you, share it in your college WhatsApp groups, Discord servers, or Instagram. Every student deserves free AI tools.

---

<p align="center">Built with ❤️ for students by Codingdidi |  Akansha Yadav |  · Powered by Claude AI · Free forever</p>
