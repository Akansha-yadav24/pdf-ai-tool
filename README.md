📚 PDF Intelligence
Free AI Study Tool for Students
Upload any PDF · Ask anything · Powered by Claude AI · 100% Free
🛠️	Built With	React · Claude AI API · Anthropic
🎓	Target Users	Students — any level, any subject
💰	Cost	$5 free credits (~500 PDF sessions)
⚡	Setup Time	5 minutes — one time only
🔒	Privacy	Your PDF & key never leave your browser
🌐	Access	Any device — phone, laptop, tablet


📖 What Is This?
PDF Intelligence is a free, open-source AI workflow built specifically for students. Upload any PDF — textbook, research paper, case study, or lecture notes — and get instant AI-powered answers without paying for any subscription.

Unlike tools like ChatGPT Plus ($20/month) or Adobe Acrobat AI ($15/month), this tool uses your own Anthropic API key with $5 free credits that cover your entire semester.


✨ Features
•	📌  5 Key Points — extracts the most important points in seconds
•	📝  Instant Summary — executive-style overview of any document
•	🎯  Main Arguments — identifies key claims with supporting evidence
•	📊  Key Statistics — pulls out all numbers, data, and percentages
•	💡  Insights & Implications — actionable takeaways from any paper
•	❓  Generate Quiz — creates 5 practice Q&A for exam prep
•	💬  Free Chat — ask anything in your own words
•	📱  Works on mobile, tablet, and desktop
•	🔒  Your data stays in your browser — never stored on any server


📁 Project Structure
pdf-ai-tool/
├── src/
│   ├── App.jsx          ← Main app with full UI & API logic
│   └── index.js         ← React entry point
├── public/
│   └── index.html       ← Page title & meta tags
├── package.json         ← Dependencies & scripts
├── vercel.json          ← Vercel deploy config
└── README.docx          ← This file


🚀 Setup & Deployment
Step 1 — Get Your Free API Key
1	Go to console.anthropic.com and sign up for free
2	You automatically receive $5 free credits (~500 PDF sessions)
3	Navigate to API Keys → click Create Key
4	Copy the key — it starts with  sk-ant-api03-...

Step 2 — Upload to GitHub
1	Go to github.com → sign up free if needed
2	Click New Repository → name it pdf-ai-tool → Create
3	Click 'uploading an existing file'
4	Unzip the downloaded project → drag all files into GitHub
5	Click Commit Changes — your code is live on GitHub ✅

Step 3 — Deploy on Vercel
1	Go to vercel.com → sign up with your GitHub account
2	Click Add New Project → select your pdf-ai-tool repository
3	Click Deploy — Vercel auto-detects the React config
4	In ~1 minute you get a live URL like: pdf-ai-tool.vercel.app
5	Optionally rename to: yourname-pdf.vercel.app or study-ai.vercel.app

Step 4 — Share It
•	Put your Vercel URL in your Instagram bio
•	Share in college WhatsApp groups
•	Post the link on LinkedIn
•	Anyone can use it — they just need their own free API key


⚙️ How It Works
The app works entirely in the browser. When a user uploads a PDF, it is converted to Base64 and sent directly to the Anthropic API along with the user's question. The API processes the document and returns an AI-generated answer. Nothing is stored — no database, no server, no tracking.

Each user connects with their own API key, so you as the creator pay nothing for others using your deployed app.


🧰 Tech Stack
Layer	Technology	Purpose
Frontend	React 18	UI framework
Styling	Inline CSS	Zero dependencies
AI Model	Claude Sonnet (Anthropic)	PDF analysis & Q&A
Hosting	Vercel	Free global deployment
Auth	User's own API key	No backend needed


💰 Cost Breakdown
This tool is designed to be as cheap as possible for students:

Item	Cost	Notes
Anthropic free credits	$5 (free signup)	~500 PDF sessions
Vercel hosting	$0 forever	Free plan is sufficient
GitHub	$0 forever	Free for public repos
After free credits	~$0.003/question	Pay-as-you-go, no subscription


🎓 Use Cases for Students
•	Exam Revision — get key points from 100-page textbook chapters instantly
•	Assignment Research — extract arguments and stats from research papers
•	Literature Review — summarize multiple papers quickly
•	Case Study Analysis — break down complex business or legal case studies
•	Lecture Notes — turn dense lecture PDFs into easy-to-read summaries
•	Practice Tests — auto-generate quiz questions before exams
•	Language Learning — simplify academic papers written in complex English


🔗 Useful Links
Get your free Anthropic API key
Deploy on Vercel (free)
Host code on GitHub (free)
Anthropic API documentation


Built with ❤️ for students · Powered by Claude AI · Free forever
