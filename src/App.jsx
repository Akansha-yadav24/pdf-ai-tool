import { useState, useRef, useCallback } from "react";

const QUICK_PROMPTS = [
  { label: "📌 5 Key Points", prompt: "Extract exactly 5 key points from this document. Format as a numbered list with a bold title and 2-sentence explanation for each point." },
  { label: "📝 Summary", prompt: "Write a clear, concise executive summary of this document in 3-4 paragraphs covering the main purpose, key findings, and conclusions." },
  { label: "🎯 Main Arguments", prompt: "What are the main arguments or claims made in this document? List them clearly with supporting evidence from the text." },
  { label: "📊 Key Statistics", prompt: "Extract all important numbers, statistics, percentages, and data points mentioned in this document. Present them in a clear list." },
  { label: "💡 Insights & Implications", prompt: "What are the most important insights and real-world implications from this document? What should readers take action on?" },
  { label: "❓ Generate Quiz", prompt: "Generate 5 comprehension questions about this document with their answers. This helps test understanding of the content." },
];

const S = {
  bg: { minHeight: "100vh", background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)", fontFamily: "'Georgia','Times New Roman',serif", display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 16px" },
  title: { fontSize: "2.8rem", fontWeight: "900", letterSpacing: "-1px", background: "linear-gradient(90deg,#a78bfa,#60a5fa,#34d399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "6px" },
  card: { background: "rgba(255,255,255,0.06)", backdropFilter: "blur(12px)", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.1)", padding: "28px 32px" },
  input: { width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(167,139,250,0.3)", borderRadius: "10px", padding: "12px 16px", color: "#e5e7eb", fontSize: "0.93rem", fontFamily: "monospace", outline: "none", boxSizing: "border-box" },
  btnPrimary: { background: "linear-gradient(135deg,#7c3aed,#4f46e5)", border: "none", borderRadius: "10px", color: "white", padding: "12px 28px", cursor: "pointer", fontWeight: "700", fontSize: "0.95rem", width: "100%" },
  label: { color: "#9ca3af", fontSize: "0.82rem", marginBottom: "8px", display: "block", letterSpacing: "0.05em", textTransform: "uppercase" },
};

export default function PDFQAAgent() {
  const [savedKey, setSavedKey] = useState("");
  const [keyInput, setKeyInput] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [keyError, setKeyError] = useState("");
  const [validating, setValidating] = useState(false);
  const [pdfBase64, setPdfBase64] = useState(null);
  const [fileName, setFileName] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef();
  const chatEndRef = useRef();

  const validateKey = async () => {
    const k = keyInput.trim();
    if (!k.startsWith("sk-ant-")) { setKeyError("Key should start with 'sk-ant-'. Check and try again."); return; }
    setValidating(true); setKeyError("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": k, "anthropic-version": "2023-06-01" },
        body: JSON.stringify({ model: "claude-haiku-4-5-20251001", max_tokens: 10, messages: [{ role: "user", content: "hi" }] }),
      });
      if (res.status === 401) { setKeyError("Invalid API key. Please double-check it."); }
      else { setSavedKey(k); }
    } catch { setKeyError("Could not connect. Check your internet and try again."); }
    finally { setValidating(false); }
  };

  const readPDF = (file) => {
    if (file.type !== "application/pdf") { setError("Please upload a PDF file."); return; }
    setError(""); setFileName(file.name); setMessages([]);
    const reader = new FileReader();
    reader.onload = (e) => setPdfBase64(e.target.result.split(",")[1]);
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault(); setDragging(false);
    if (e.dataTransfer.files[0]) readPDF(e.dataTransfer.files[0]);
  }, []);

  const sendMessage = async (customPrompt) => {
    const userText = customPrompt || input.trim();
    if (!userText || !pdfBase64 || loading) return;
    setInput(""); setLoading(true); setError("");
    setMessages((p) => [...p, { role: "user", text: userText }]);
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": savedKey, "anthropic-version": "2023-06-01" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1500,
          system: "You are an expert document analyst and study assistant. Answer questions about the provided PDF accurately and helpfully. Format responses clearly with markdown. When helping students, explain concepts simply and clearly.",
          messages: [{ role: "user", content: [{ type: "document", source: { type: "base64", media_type: "application/pdf", data: pdfBase64 } }, { type: "text", text: userText }] }],
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      setMessages((p) => [...p, { role: "assistant", text: data.content?.map(b => b.text || "").join("") || "No response." }]);
    } catch (err) { setError("Error: " + (err.message || "Something went wrong.")); }
    finally { setLoading(false); setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100); }
  };

  const formatText = (text) => text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/^### (.*$)/gm, "<h3 style='font-size:1rem;font-weight:700;margin:12px 0 4px;color:#c4b5fd'>$1</h3>")
    .replace(/^## (.*$)/gm, "<h2 style='font-size:1.1rem;font-weight:700;margin:14px 0 6px;color:#c4b5fd'>$1</h2>")
    .replace(/^\d+\. (.*$)/gm, "<div style='display:flex;gap:8px;margin:6px 0'><span style='color:#a78bfa;font-weight:700;min-width:18px'>•</span><span>$1</span></div>")
    .replace(/^[-•] (.*$)/gm, "<div style='display:flex;gap:8px;margin:4px 0'><span style='color:#a78bfa'>▸</span><span>$1</span></div>")
    .replace(/\n\n/g, "<br/><br/>").replace(/\n/g, "<br/>");

  // ── SCREEN 1: API Key Setup ───────────────────────────────────────────────
  if (!savedKey) return (
    <div style={S.bg}>
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div style={S.title}>PDF Intelligence</div>
        <div style={{ color: "#a78bfa", fontSize: "0.85rem", fontWeight: "600", marginBottom: "6px", letterSpacing: "0.1em", textTransform: "uppercase" }}>🎓 Free AI Study Tool for Students</div>
        <div style={{ color: "#9ca3af", fontSize: "0.88rem" }}>Upload any textbook, paper or notes — get instant answers</div>
      </div>

      <div style={{ width: "100%", maxWidth: "520px", display: "flex", flexDirection: "column", gap: "20px" }}>

        {/* Features strip */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
          {["📖 Textbooks", "📄 Research Papers", "📝 Case Studies", "🗒️ Lecture Notes"].map(f => (
            <div key={f} style={{ background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.25)", borderRadius: "50px", padding: "5px 14px", color: "#c4b5fd", fontSize: "0.78rem", fontWeight: "500" }}>{f}</div>
          ))}
        </div>

        {/* How to get key */}
        <div style={{ ...S.card, borderColor: "rgba(167,139,250,0.25)" }}>
          <div style={{ color: "#a78bfa", fontWeight: "700", fontSize: "1rem", marginBottom: "16px" }}>🔑 Get Your FREE API Key (2 min)</div>
          {[
            ["1", "Go to ", "console.anthropic.com", "https://console.anthropic.com"],
            ["2", "Sign up free — you get $5 free credits (~500 uses)", "", null],
            ["3", "Go to API Keys → click Create Key", "", null],
            ["4", "Copy & paste your key below", "", null],
          ].map(([n, a, b, href]) => (
            <div key={n} style={{ display: "flex", gap: "12px", alignItems: "flex-start", marginBottom: "10px" }}>
              <div style={{ background: "rgba(167,139,250,0.2)", color: "#a78bfa", borderRadius: "50%", width: "26px", height: "26px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: "700", flexShrink: 0 }}>{n}</div>
              <div style={{ color: "#d1d5db", fontSize: "0.9rem", lineHeight: "1.5", paddingTop: "3px" }}>
                {a}{href ? <a href={href} target="_blank" rel="noreferrer" style={{ color: "#60a5fa", textDecoration: "underline" }}>{b}</a> : <strong style={{ color: "#e5e7eb" }}>{b}</strong>}
              </div>
            </div>
          ))}
        </div>

        {/* Key Input */}
        <div style={S.card}>
          <label style={S.label}>Your Anthropic API Key</label>
          <div style={{ position: "relative" }}>
            <input type={showKey ? "text" : "password"} placeholder="sk-ant-api03-..." value={keyInput}
              onChange={e => { setKeyInput(e.target.value); setKeyError(""); }}
              onKeyDown={e => e.key === "Enter" && validateKey()}
              style={{ ...S.input, paddingRight: "52px" }} />
            <button onClick={() => setShowKey(s => !s)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#6b7280", cursor: "pointer", fontSize: "1.1rem" }}>
              {showKey ? "🙈" : "👁️"}
            </button>
          </div>
          {keyError && <div style={{ color: "#f87171", fontSize: "0.83rem", marginTop: "8px" }}>⚠️ {keyError}</div>}
          <div style={{ color: "#4b5563", fontSize: "0.78rem", margin: "10px 0 16px", lineHeight: "1.6" }}>
            🔒 Your key stays in your browser only — never stored anywhere<br/>
            💡 $5 free credits = your entire semester covered
          </div>
          <button onClick={validateKey} disabled={validating || !keyInput.trim()}
            style={{ ...S.btnPrimary, opacity: validating || !keyInput.trim() ? 0.5 : 1, cursor: validating || !keyInput.trim() ? "not-allowed" : "pointer" }}>
            {validating ? "Validating..." : "Start Studying Free →"}
          </button>
        </div>

        <div style={{ textAlign: "center", color: "#4b5563", fontSize: "0.8rem", lineHeight: "1.8" }}>
          No subscription · No credit card · No login needed<br/>
          <span style={{ color: "#374151" }}>Just your API key — one time setup, use forever</span>
        </div>
      </div>
      <style>{`* { box-sizing: border-box; } ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-thumb { background: rgba(167,139,250,0.3); border-radius: 3px; }`}</style>
    </div>
  );

  // ── SCREEN 2: Main App ────────────────────────────────────────────────────
  return (
    <div style={S.bg}>
      <div style={{ width: "100%", maxWidth: "820px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <div style={{ ...S.title, fontSize: "2rem" }}>PDF Intelligence</div>
          <div style={{ color: "#6b7280", fontSize: "0.82rem" }}>🎓 Your free AI study buddy — ready to help</div>
        </div>
        <button onClick={() => { setSavedKey(""); setPdfBase64(null); setMessages([]); }}
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#9ca3af", padding: "8px 14px", cursor: "pointer", fontSize: "0.8rem" }}>
          🔑 Change Key
        </button>
      </div>

      <div style={{ width: "100%", maxWidth: "820px", display: "flex", flexDirection: "column", gap: "16px" }}>
        {!pdfBase64 ? (
          <div onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={handleDrop} onClick={() => fileRef.current.click()}
            style={{ border: dragging ? "2px solid #a78bfa" : "2px dashed rgba(167,139,250,0.35)", borderRadius: "20px", padding: "60px 32px", textAlign: "center", cursor: "pointer", background: dragging ? "rgba(167,139,250,0.08)" : "rgba(255,255,255,0.03)", backdropFilter: "blur(10px)", transition: "all 0.2s" }}>
            <div style={{ fontSize: "3.5rem", marginBottom: "14px" }}>📚</div>
            <div style={{ color: "#e5e7eb", fontSize: "1.1rem", fontWeight: "600", marginBottom: "6px" }}>Drop your PDF here</div>
            <div style={{ color: "#6b7280", fontSize: "0.85rem", marginBottom: "6px" }}>Textbook · Research Paper · Case Study · Lecture Notes</div>
            <div style={{ color: "#4b5563", fontSize: "0.8rem", marginBottom: "22px" }}>or click to browse</div>
            <div style={{ display: "inline-block", padding: "10px 28px", background: "linear-gradient(135deg,#7c3aed,#4f46e5)", borderRadius: "50px", color: "white", fontWeight: "600" }}>Choose PDF File</div>
            <input ref={fileRef} type="file" accept=".pdf" style={{ display: "none" }} onChange={e => { if (e.target.files[0]) readPDF(e.target.files[0]); }} />
          </div>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.06)", backdropFilter: "blur(10px)", borderRadius: "14px", padding: "14px 20px", border: "1px solid rgba(167,139,250,0.3)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "1.8rem" }}>📑</span>
                <div>
                  <div style={{ color: "#e5e7eb", fontWeight: "600", fontSize: "0.95rem" }}>{fileName}</div>
                  <div style={{ color: "#6b7280", fontSize: "0.78rem" }}>Ready · Ask me anything about this document</div>
                </div>
              </div>
              <button onClick={() => { setPdfBase64(null); setFileName(""); setMessages([]); }}
                style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171", borderRadius: "8px", padding: "6px 14px", cursor: "pointer", fontSize: "0.8rem", fontWeight: "600" }}>✕ Remove</button>
            </div>

            <div>
              <div style={{ color: "#6b7280", fontSize: "0.78rem", marginBottom: "10px", letterSpacing: "0.08em", textTransform: "uppercase" }}>Quick Study Actions</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {QUICK_PROMPTS.map(qp => (
                  <button key={qp.label} onClick={() => sendMessage(qp.prompt)} disabled={loading}
                    style={{ padding: "8px 16px", borderRadius: "50px", fontSize: "0.82rem", fontWeight: "500", background: "rgba(255,255,255,0.07)", color: "#d1d5db", border: "1px solid rgba(255,255,255,0.12)", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.5 : 1 }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(167,139,250,0.2)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}>
                    {qp.label}
                  </button>
                ))}
              </div>
            </div>

            {messages.length > 0 && (
              <div style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(10px)", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.08)", padding: "20px", maxHeight: "480px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px" }}>
                {messages.map((msg, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
                    <div style={{ maxWidth: "88%", padding: "12px 18px", borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", background: msg.role === "user" ? "linear-gradient(135deg,#7c3aed,#4f46e5)" : "rgba(255,255,255,0.08)", color: "#e5e7eb", fontSize: "0.92rem", lineHeight: "1.65", border: msg.role === "assistant" ? "1px solid rgba(255,255,255,0.1)" : "none" }}>
                      {msg.role === "user" ? msg.text : <div dangerouslySetInnerHTML={{ __html: formatText(msg.text) }} />}
                    </div>
                    <div style={{ color: "#4b5563", fontSize: "0.7rem", marginTop: "4px", padding: "0 4px" }}>{msg.role === "user" ? "You" : "AI Study Buddy 🎓"}</div>
                  </div>
                ))}
                {loading && (
                  <div style={{ display: "flex" }}>
                    <div style={{ padding: "12px 20px", borderRadius: "18px 18px 18px 4px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}>
                      <div style={{ display: "flex", gap: "5px" }}>
                        {[0,1,2].map(i => <div key={i} style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#a78bfa", animation: "pulse 1.2s ease-in-out infinite", animationDelay: `${i*0.2}s` }} />)}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            )}

            {error && <div style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "12px", padding: "12px 16px", color: "#f87171", fontSize: "0.88rem" }}>⚠️ {error}</div>}

            <div style={{ display: "flex", gap: "10px", alignItems: "flex-end", background: "rgba(255,255,255,0.06)", backdropFilter: "blur(10px)", borderRadius: "16px", padding: "12px 14px", border: "1px solid rgba(255,255,255,0.1)" }}>
              <textarea value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Ask anything... e.g. 'Explain chapter 3 in simple words'" rows={1}
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#e5e7eb", fontSize: "0.93rem", resize: "none", fontFamily: "inherit", lineHeight: "1.6", maxHeight: "120px" }} />
              <button onClick={() => sendMessage()} disabled={loading || !input.trim()}
                style={{ background: loading || !input.trim() ? "rgba(99,102,241,0.3)" : "linear-gradient(135deg,#7c3aed,#4f46e5)", border: "none", borderRadius: "10px", color: "white", padding: "10px 20px", cursor: loading || !input.trim() ? "not-allowed" : "pointer", fontWeight: "700", fontSize: "0.9rem", whiteSpace: "nowrap" }}>
                {loading ? "..." : "Ask →"}
              </button>
            </div>
          </>
        )}
        <div style={{ textAlign: "center", color: "#374151", fontSize: "0.76rem" }}>🔒 Your PDF & key never leave your browser · Built with Claude AI</div>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:0.3;transform:scale(0.8)}50%{opacity:1;transform:scale(1)}} *{box-sizing:border-box} ::-webkit-scrollbar{width:6px} ::-webkit-scrollbar-thumb{background:rgba(167,139,250,0.3);border-radius:3px}`}</style>
    </div>
  );
}
