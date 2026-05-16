import { useState, useRef, useEffect } from "react";

const COLORS = {
  forest: "#1B4332",
  emerald: "#2D6A4F",
  mint: "#52B788",
  lime: "#95D5B2",
  cream: "#F8F4E8",
  gold: "#E9C46A",
  amber: "#F4A261",
  rust: "#E76F51",
  charcoal: "#2D3436",
  slate: "#636E72",
  pale: "#F1F8F4",
};

const QUESTIONS = [
  {
    id: "q1",
    category: "Personality",
    icon: "🧠",
    text: "When you face a difficult problem, how do you usually approach it?",
    options: [
      { label: "I analyze it logically step by step", tags: ["analytical", "STEM"] },
      { label: "I brainstorm creative solutions", tags: ["creative", "arts"] },
      { label: "I talk to others and gather opinions", tags: ["social", "humanities"] },
      { label: "I research thoroughly before acting", tags: ["research", "academic"] },
    ],
  },
  {
    id: "q2",
    category: "Interests",
    icon: "❤️",
    text: "Which activity sounds most exciting to you?",
    options: [
      { label: "Building an app or website", tags: ["tech", "engineering"] },
      { label: "Helping a sick person recover", tags: ["medicine", "care"] },
      { label: "Running a business and making money", tags: ["business", "entrepreneurship"] },
      { label: "Writing stories or creating art", tags: ["creative", "arts"] },
    ],
  },
  {
    id: "q3",
    category: "Strengths",
    icon: "💪",
    text: "Which subjects do you enjoy or excel at the most?",
    options: [
      { label: "Mathematics & Physics", tags: ["STEM", "engineering", "tech"] },
      { label: "Biology & Chemistry", tags: ["medicine", "science"] },
      { label: "Literature, Government & CRS/IRS", tags: ["humanities", "law"] },
      { label: "Economics, Commerce & Accounting", tags: ["business", "finance"] },
    ],
  },
  {
    id: "q4",
    category: "Work Style",
    icon: "🏗️",
    text: "What kind of work environment appeals to you most?",
    options: [
      { label: "Laboratory or research facility", tags: ["research", "science"] },
      { label: "Office or corporate setting", tags: ["business", "finance"] },
      { label: "Outdoors or field work", tags: ["agriculture", "engineering"] },
      { label: "Hospital, clinic, or helping people directly", tags: ["medicine", "social"] },
    ],
  },
  {
    id: "q5",
    category: "Values",
    icon: "🌍",
    text: "What impact do you want your career to have on Nigeria?",
    options: [
      { label: "Advance technology and innovation", tags: ["tech", "engineering"] },
      { label: "Improve healthcare and save lives", tags: ["medicine", "care"] },
      { label: "Create jobs and grow the economy", tags: ["business", "entrepreneurship"] },
      { label: "Educate, govern, or shape society", tags: ["humanities", "law", "public service"] },
    ],
  },
  {
    id: "q6",
    category: "Skills",
    icon: "🛠️",
    text: "People who know you would say you're naturally good at:",
    options: [
      { label: "Solving complex puzzles & calculations", tags: ["analytical", "STEM"] },
      { label: "Communicating and persuading people", tags: ["social", "law", "business"] },
      { label: "Drawing, designing, or creating things", tags: ["creative", "arts"] },
      { label: "Organizing, planning & leading others", tags: ["management", "business"] },
    ],
  },
  {
    id: "q7",
    category: "Ambition",
    icon: "🚀",
    text: "In 15 years, where do you see yourself?",
    options: [
      { label: "Leading a tech company or startup", tags: ["tech", "entrepreneurship"] },
      { label: "Practicing medicine or running a hospital", tags: ["medicine"] },
      { label: "Working in government or diplomacy", tags: ["law", "public service", "humanities"] },
      { label: "Running a successful business empire", tags: ["business", "finance"] },
    ],
  },
  {
    id: "q8",
    category: "Learning",
    icon: "📚",
    text: "How do you prefer to learn new things?",
    options: [
      { label: "Hands-on experiments and practice", tags: ["science", "engineering"] },
      { label: "Reading books and doing research", tags: ["academic", "humanities"] },
      { label: "Watching tutorials and visual content", tags: ["tech", "creative"] },
      { label: "Group discussions and debates", tags: ["social", "law", "business"] },
    ],
  },
];

const PROGRESS_STEPS = ["Welcome", "Questions", "Analysis", "Results"];

function ProgressBar({ step }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginBottom: "2rem" }}>
      {PROGRESS_STEPS.map((label, i) => (
        <div key={label} style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: i <= step ? COLORS.forest : "#ddd",
              color: i <= step ? "#fff" : "#999",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 600,
              transition: "all 0.3s",
            }}>{i < step ? "✓" : i + 1}</div>
            <span style={{ fontSize: 11, color: i <= step ? COLORS.forest : "#aaa", fontWeight: i === step ? 600 : 400, whiteSpace: "nowrap" }}>{label}</span>
          </div>
          {i < PROGRESS_STEPS.length - 1 && (
            <div style={{ width: 60, height: 2, background: i < step ? COLORS.forest : "#ddd", margin: "0 4px", marginBottom: 18, transition: "all 0.3s" }} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function CareerGuidancePlatform() {
  const [screen, setScreen] = useState("welcome"); // welcome | quiz | analyzing | results
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [analysisStep, setAnalysisStep] = useState(0);
  const resultRef = useRef(null);

  const stepIndex = screen === "welcome" ? 0 : screen === "quiz" ? 1 : screen === "analyzing" ? 2 : 3;
  const isError = screen === "error";

  useEffect(() => {
    if (screen === "analyzing") {
      const steps = ["Scanning your personality profile...", "Mapping strengths to career clusters...", "Consulting Nigerian university data...", "Generating your personalised roadmap..."];
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setAnalysisStep(i);
        if (i >= steps.length) clearInterval(interval);
      }, 900);
      return () => clearInterval(interval);
    }
  }, [screen]);

  useEffect(() => {
    if (screen === "results" && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [screen, result]);

  function handleOptionSelect(option) {
    if (selectedOption) return;
    setSelectedOption(option);
    const qIndex = currentQ;
    const newAnswer = { question: QUESTIONS[qIndex].text, answer: option.label, tags: option.tags };
    setTimeout(() => {
      setSelectedOption(null);
      if (qIndex < QUESTIONS.length - 1) {
        setAnswers(prev => [...prev, newAnswer]);
        setCurrentQ(qIndex + 1);
      } else {
        setAnswers(prev => {
          const newAnswers = [...prev, newAnswer];
          analyzeWithClaude(newAnswers);
          return newAnswers;
        });
        setScreen("analyzing");
      }
    }, 350);
  }

  async function analyzeWithClaude(allAnswers) {
    try {
      const tagFrequency = {};
      allAnswers.forEach(a => a.tags.forEach(t => { tagFrequency[t] = (tagFrequency[t] || 0) + 1; }));
      const topTags = Object.entries(tagFrequency).sort((a, b) => b[1] - a[1]).slice(0, 5).map(e => e[0]);

      const prompt = `You are an expert Nigerian career counselor helping a high school student. Analyze their quiz responses and provide comprehensive career guidance tailored to Nigeria's job market, universities, and educational system.

Student Name: ${studentName}
Class: ${studentClass}
Quiz Responses:
${allAnswers.map((a, i) => `Q${i + 1}: ${a.question}\nAnswer: ${a.answer}`).join("\n\n")}
Dominant Interest Tags: ${topTags.join(", ")}

Respond ONLY with a valid JSON object (no markdown, no backticks) using exactly this structure:
{
  "summary": "2-3 sentences about the student's profile and strengths",
  "topCareers": [
    {
      "title": "Career Title",
      "emoji": "emoji",
      "description": "Why this suits them (2 sentences)",
      "nigerianContext": "Opportunities and outlook in Nigeria specifically",
      "salaryRange": "₦X,000 - ₦Y,000 per month (entry level)",
      "growthProspect": "High/Medium/Growing"
    }
  ],
  "subjectChoices": {
    "sciences": ["list of science subjects to take if applicable"],
    "arts": ["list if applicable"],
    "commercials": ["list if applicable"],
    "recommended": "Sciences/Arts/Commercials/Mixed",
    "rationale": "Why these subjects fit their goals"
  },
  "universities": [
    {
      "name": "University Name",
      "location": "City, State",
      "type": "Federal/State/Private",
      "whyRecommended": "Specific reason for this student",
      "topPrograms": ["Program 1", "Program 2"],
      "jambCutoff": "approximate JAMB cutoff score"
    }
  ],
  "actionPlan": [
    "Immediate action step 1",
    "Action step 2",
    "Action step 3",
    "Action step 4"
  ],
  "motivationalMessage": "An inspiring, personalized closing message for this Nigerian student"
}

Include 3 top careers, 4-5 universities (mix of federal, state, and private if relevant), and make everything specific to Nigeria. Return ONLY the JSON, nothing else.`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
         },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      const text = data.content.map(c => c.text || "").join("");
      const jsonStart = text.indexOf("{");
      const jsonEnd = text.lastIndexOf("}");
      if (jsonStart === -1 || jsonEnd === -1) throw new Error("No JSON in response");
      const parsed = JSON.parse(text.slice(jsonStart, jsonEnd + 1));
      setResult(parsed);
      setScreen("results");
    } catch (err) {
      setError("Analysis failed. Please check your connection and try again.");
      setScreen("error");
    }
  }

  function restart() {
    setScreen("welcome");
    setCurrentQ(0);
    setAnswers([]);
    setStudentName("");
    setStudentClass("");
    setResult(null);
    setError(null);
    setSelectedOption(null);
    setAnalysisStep(0);
  }

  const analysisMessages = [
    "Scanning your personality profile...",
    "Mapping strengths to career clusters...",
    "Consulting Nigerian university data...",
    "Generating your personalised roadmap...",
  ];

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(135deg, ${COLORS.pale} 0%, #fff 50%, ${COLORS.pale} 100%)`, fontFamily: "'Georgia', serif" }}>
      {/* Header */}
      <div style={{ background: COLORS.forest, color: "#fff", padding: "1rem 2rem", display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ fontSize: 32 }}>🎓</div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.3px" }}>PathFinder Nigeria</div>
          <div style={{ fontSize: 12, color: COLORS.lime, fontFamily: "sans-serif", letterSpacing: "0.5px" }}>AI Career Guidance for Nigerian Students</div>
        </div>
        {screen !== "welcome" && (
          <button onClick={restart} style={{ marginLeft: "auto", background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 6, padding: "6px 14px", cursor: "pointer", fontSize: 13, fontFamily: "sans-serif" }}>
            ↺ Start Over
          </button>
        )}
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "2rem 1.5rem" }}>
        <ProgressBar step={stepIndex} />

        {/* WELCOME */}
        {screen === "welcome" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 64, marginBottom: 12 }}>🌟</div>
            <h1 style={{ fontSize: 32, color: COLORS.forest, fontWeight: 700, margin: "0 0 12px" }}>Discover Your Future Career</h1>
            <p style={{ fontSize: 17, color: COLORS.slate, fontFamily: "sans-serif", lineHeight: 1.7, marginBottom: "2rem", maxWidth: 520, margin: "0 auto 2rem" }}>
              Answer 8 questions about your interests and strengths, and our AI will recommend the best career paths, university courses, and subject choices for you — tailored for Nigeria.
            </p>

            <div style={{ background: "#fff", borderRadius: 16, border: `1px solid ${COLORS.lime}`, padding: "2rem", marginBottom: "2rem", textAlign: "left", boxShadow: "0 4px 20px rgba(27,67,50,0.08)" }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: COLORS.forest, marginBottom: "1.5rem", fontFamily: "sans-serif" }}>Before we begin, tell us about yourself:</div>

              <div style={{ marginBottom: "1.2rem" }}>
                <label style={{ display: "block", fontSize: 13, color: COLORS.slate, fontFamily: "sans-serif", marginBottom: 6, fontWeight: 500 }}>Your First Name</label>
                <input
                  value={studentName}
                  onChange={e => setStudentName(e.target.value)}
                  placeholder="e.g. Chidi, Amaka, Tunde..."
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1.5px solid ${studentName ? COLORS.mint : "#ddd"}`, fontSize: 15, fontFamily: "sans-serif", outline: "none", boxSizing: "border-box", transition: "border 0.2s" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, color: COLORS.slate, fontFamily: "sans-serif", marginBottom: 6, fontWeight: 500 }}>Your Class / Year</label>
                <select
                  value={studentClass}
                  onChange={e => setStudentClass(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1.5px solid ${studentClass ? COLORS.mint : "#ddd"}`, fontSize: 15, fontFamily: "sans-serif", outline: "none", background: "#fff", boxSizing: "border-box" }}
                >
                  <option value="">Select your class...</option>
                  <option value="JSS3">JSS 3</option>
                  <option value="SS1">SS 1</option>
                  <option value="SS2">SS 2</option>
                  <option value="SS3">SS 3 (Final Year)</option>
                </select>
              </div>
            </div>

            {error && (
              <div style={{ background: "#fff3f3", border: "1px solid #ffaaaa", borderRadius: 8, padding: "12px 16px", marginBottom: "1.5rem", color: "#cc0000", fontSize: 14, fontFamily: "sans-serif" }}>
                ⚠️ {error}
              </div>
            )}

            <button
              onClick={() => { if (studentName && studentClass) setScreen("quiz"); }}
              disabled={!studentName || !studentClass}
              style={{
                background: studentName && studentClass ? COLORS.forest : "#ccc",
                color: "#fff", border: "none", borderRadius: 12, padding: "16px 48px",
                fontSize: 17, fontWeight: 600, cursor: studentName && studentClass ? "pointer" : "not-allowed",
                fontFamily: "sans-serif", transition: "all 0.2s", letterSpacing: "-0.2px",
                boxShadow: studentName && studentClass ? "0 4px 16px rgba(27,67,50,0.3)" : "none"
              }}
            >
              Begin My Career Journey →
            </button>

            <div style={{ display: "flex", gap: 24, justifyContent: "center", marginTop: "2.5rem", flexWrap: "wrap" }}>
              {[["⏱️", "5 Minutes", "Quick & easy"], ["🤖", "AI-Powered", "Personalised analysis"], ["🇳🇬", "Nigeria-Focused", "Local universities & jobs"]].map(([icon, title, sub]) => (
                <div key={title} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 24 }}>{icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.forest, fontFamily: "sans-serif" }}>{title}</div>
                  <div style={{ fontSize: 11, color: COLORS.slate, fontFamily: "sans-serif" }}>{sub}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* QUIZ */}
        {screen === "quiz" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <span style={{ fontSize: 13, color: COLORS.slate, fontFamily: "sans-serif" }}>Question {currentQ + 1} of {QUESTIONS.length}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.forest, fontFamily: "sans-serif", background: COLORS.pale, padding: "4px 12px", borderRadius: 20, border: `1px solid ${COLORS.lime}` }}>
                {QUESTIONS[currentQ].icon} {QUESTIONS[currentQ].category}
              </span>
            </div>

            <div style={{ height: 4, background: "#e8f5e9", borderRadius: 2, marginBottom: "2rem", overflow: "hidden" }}>
              <div style={{ height: "100%", background: COLORS.mint, borderRadius: 2, width: `${((currentQ + 1) / QUESTIONS.length) * 100}%`, transition: "width 0.4s ease" }} />
            </div>

            <div style={{ background: "#fff", borderRadius: 16, border: `1px solid ${COLORS.lime}`, padding: "2rem", marginBottom: "1.5rem", boxShadow: "0 4px 20px rgba(27,67,50,0.08)" }}>
              <h2 style={{ fontSize: 22, color: COLORS.charcoal, fontWeight: 700, margin: "0 0 2rem", lineHeight: 1.4 }}>
                {QUESTIONS[currentQ].text}
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {QUESTIONS[currentQ].options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleOptionSelect(option)}
                    style={{
                      background: selectedOption === option ? COLORS.forest : "#fff",
                      color: selectedOption === option ? "#fff" : COLORS.charcoal,
                      border: `2px solid ${selectedOption === option ? COLORS.forest : COLORS.lime}`,
                      borderRadius: 10, padding: "14px 20px", textAlign: "left",
                      cursor: "pointer", fontSize: 15, fontFamily: "sans-serif",
                      transition: "all 0.2s", lineHeight: 1.4,
                    }}
                    onMouseEnter={e => { if (selectedOption !== option) { e.currentTarget.style.background = COLORS.pale; e.currentTarget.style.borderColor = COLORS.mint; } }}
                    onMouseLeave={e => { if (selectedOption !== option) { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = COLORS.lime; } }}
                  >
                    <span style={{ fontSize: 13, color: selectedOption === option ? "rgba(255,255,255,0.7)" : COLORS.slate, marginRight: 8 }}>{String.fromCharCode(65 + i)}.</span>
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ textAlign: "center", color: COLORS.slate, fontSize: 13, fontFamily: "sans-serif" }}>
              👤 {studentName} · {studentClass}
            </div>
          </div>
        )}

        {/* ERROR */}
        {isError && (
          <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>⚠️</div>
            <h2 style={{ fontSize: 22, color: "#c0392b", fontWeight: 700, marginBottom: 12 }}>Analysis Failed</h2>
            <p style={{ color: COLORS.slate, fontFamily: "sans-serif", marginBottom: "2rem", lineHeight: 1.6 }}>{error}</p>
            <button onClick={restart} style={{ background: COLORS.forest, color: "#fff", border: "none", borderRadius: 10, padding: "12px 32px", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "sans-serif" }}>
              🔄 Start Over
            </button>
          </div>
        )}

        {/* ANALYZING */}
        {screen === "analyzing" && (
          <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
            <div style={{ fontSize: 64, marginBottom: "1.5rem", animation: "pulse 1.5s infinite" }}>🔍</div>
            <h2 style={{ fontSize: 26, color: COLORS.forest, fontWeight: 700, marginBottom: "1rem" }}>Analysing Your Profile, {studentName}...</h2>
            <p style={{ color: COLORS.slate, fontFamily: "sans-serif", marginBottom: "2.5rem" }}>Our AI is working on your personalised career report</p>

            <div style={{ background: "#fff", borderRadius: 16, border: `1px solid ${COLORS.lime}`, padding: "2rem", maxWidth: 440, margin: "0 auto", boxShadow: "0 4px 20px rgba(27,67,50,0.08)" }}>
              {analysisMessages.map((msg, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 0", borderBottom: i < 3 ? `1px solid ${COLORS.pale}` : "none", opacity: i <= analysisStep ? 1 : 0.3, transition: "opacity 0.5s" }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: i <= analysisStep ? COLORS.forest : "#ddd", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff", flexShrink: 0, transition: "all 0.4s" }}>
                    {i < analysisStep ? "✓" : i === analysisStep ? "⋯" : "○"}
                  </div>
                  <span style={{ fontSize: 14, fontFamily: "sans-serif", color: i <= analysisStep ? COLORS.charcoal : COLORS.slate }}>{msg}</span>
                </div>
              ))}
            </div>

            <style>{`@keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.1)} }`}</style>
          </div>
        )}

        {/* RESULTS */}
        {screen === "results" && result && (
          <div ref={resultRef}>
            {/* Hero */}
            <div style={{ background: COLORS.forest, color: "#fff", borderRadius: 20, padding: "2.5rem 2rem", marginBottom: "2rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -20, right: -20, fontSize: 120, opacity: 0.07 }}>🎯</div>
              <div style={{ fontSize: 48, marginBottom: 8 }}>🎉</div>
              <h1 style={{ fontSize: 28, margin: "0 0 8px", fontWeight: 700 }}>Your Career Report, {studentName}!</h1>
              <p style={{ fontSize: 15, color: COLORS.lime, fontFamily: "sans-serif", margin: 0, lineHeight: 1.6, maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
                {result.summary}
              </p>
            </div>

            {/* Top Careers */}
            <SectionTitle icon="🚀" title="Your Top Career Matches" />
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: "2rem" }}>
              {result.topCareers?.map((career, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: 16, border: `1px solid ${COLORS.lime}`, padding: "1.5rem", boxShadow: "0 2px 12px rgba(27,67,50,0.06)" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 12 }}>
                    <div style={{ fontSize: 32 }}>{career.emoji}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                        <h3 style={{ fontSize: 18, color: COLORS.forest, fontWeight: 700, margin: 0 }}>{career.title}</h3>
                        <span style={{ background: career.growthProspect === "High" ? "#e8f5e9" : career.growthProspect === "Growing" ? "#fff8e1" : "#f3f4f6", color: career.growthProspect === "High" ? "#2e7d32" : career.growthProspect === "Growing" ? "#f57f17" : "#555", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, fontFamily: "sans-serif" }}>
                          {career.growthProspect} Growth
                        </span>
                        {i === 0 && <span style={{ background: COLORS.gold, color: COLORS.forest, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, fontFamily: "sans-serif" }}>⭐ Best Match</span>}
                      </div>
                      <p style={{ fontSize: 14, color: COLORS.slate, fontFamily: "sans-serif", margin: "6px 0 0", lineHeight: 1.6 }}>{career.description}</p>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <div style={{ background: COLORS.pale, borderRadius: 10, padding: "10px 14px" }}>
                      <div style={{ fontSize: 11, color: COLORS.slate, fontFamily: "sans-serif", marginBottom: 3, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>🇳🇬 In Nigeria</div>
                      <div style={{ fontSize: 13, color: COLORS.charcoal, fontFamily: "sans-serif", lineHeight: 1.5 }}>{career.nigerianContext}</div>
                    </div>
                    <div style={{ background: COLORS.pale, borderRadius: 10, padding: "10px 14px" }}>
                      <div style={{ fontSize: 11, color: COLORS.slate, fontFamily: "sans-serif", marginBottom: 3, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>💰 Salary Range</div>
                      <div style={{ fontSize: 13, color: COLORS.charcoal, fontFamily: "sans-serif", fontWeight: 600 }}>{career.salaryRange}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Subject Choices */}
            <SectionTitle icon="📖" title="Recommended Subject Choices" />
            <div style={{ background: "#fff", borderRadius: 16, border: `1px solid ${COLORS.lime}`, padding: "1.5rem", marginBottom: "2rem", boxShadow: "0 2px 12px rgba(27,67,50,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
                <span style={{ background: COLORS.forest, color: "#fff", borderRadius: 8, padding: "6px 16px", fontFamily: "sans-serif", fontSize: 15, fontWeight: 700 }}>
                  ✅ {result.subjectChoices?.recommended} Track
                </span>
              </div>
              <p style={{ fontSize: 14, color: COLORS.slate, fontFamily: "sans-serif", lineHeight: 1.6, marginBottom: "1.2rem" }}>{result.subjectChoices?.rationale}</p>
              {[["Sciences", result.subjectChoices?.sciences], ["Arts", result.subjectChoices?.arts], ["Commercials", result.subjectChoices?.commercials]].map(([name, subjects]) =>
                subjects && subjects.length > 0 ? (
                  <div key={name} style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.slate, fontFamily: "sans-serif", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>{name}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {subjects.map(s => (
                        <span key={s} style={{ background: COLORS.pale, border: `1px solid ${COLORS.lime}`, color: COLORS.forest, borderRadius: 20, padding: "4px 14px", fontSize: 13, fontFamily: "sans-serif", fontWeight: 500 }}>{s}</span>
                      ))}
                    </div>
                  </div>
                ) : null
              )}
            </div>

            {/* Universities */}
            <SectionTitle icon="🏛️" title="Recommended Universities" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 14, marginBottom: "2rem" }}>
              {result.universities?.map((uni, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: 14, border: `1px solid ${COLORS.lime}`, padding: "1.2rem", boxShadow: "0 2px 10px rgba(27,67,50,0.05)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <h4 style={{ fontSize: 15, color: COLORS.forest, fontWeight: 700, margin: 0, lineHeight: 1.3 }}>{uni.name}</h4>
                    <span style={{ fontSize: 10, background: uni.type === "Federal" ? "#e3f2fd" : uni.type === "State" ? "#f3e5f5" : "#fff8e1", color: uni.type === "Federal" ? "#1565c0" : uni.type === "State" ? "#6a1b9a" : "#e65100", borderRadius: 6, padding: "3px 8px", fontFamily: "sans-serif", fontWeight: 600, whiteSpace: "nowrap", marginLeft: 8 }}>{uni.type}</span>
                  </div>
                  <div style={{ fontSize: 12, color: COLORS.slate, fontFamily: "sans-serif", marginBottom: 8 }}>📍 {uni.location}</div>
                  <div style={{ fontSize: 13, color: COLORS.charcoal, fontFamily: "sans-serif", lineHeight: 1.5, marginBottom: 10 }}>{uni.whyRecommended}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                    {uni.topPrograms?.map(p => (
                      <span key={p} style={{ background: COLORS.pale, color: COLORS.emerald, fontSize: 11, borderRadius: 6, padding: "3px 10px", fontFamily: "sans-serif", fontWeight: 500 }}>{p}</span>
                    ))}
                  </div>
                  <div style={{ fontSize: 12, color: COLORS.slate, fontFamily: "sans-serif" }}>🎯 JAMB Cut-off: <strong style={{ color: COLORS.forest }}>{uni.jambCutoff}</strong></div>
                </div>
              ))}
            </div>

            {/* Action Plan */}
            <SectionTitle icon="📋" title="Your Action Plan" />
            <div style={{ background: "#fff", borderRadius: 16, border: `1px solid ${COLORS.lime}`, padding: "1.5rem", marginBottom: "2rem", boxShadow: "0 2px 12px rgba(27,67,50,0.06)" }}>
              {result.actionPlan?.map((step, i) => (
                <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "10px 0", borderBottom: i < result.actionPlan.length - 1 ? `1px solid ${COLORS.pale}` : "none" }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: COLORS.forest, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0, fontFamily: "sans-serif" }}>{i + 1}</div>
                  <p style={{ fontSize: 14, color: COLORS.charcoal, fontFamily: "sans-serif", margin: 0, lineHeight: 1.6, paddingTop: 4 }}>{step}</p>
                </div>
              ))}
            </div>

            {/* Motivation */}
            <div style={{ background: `linear-gradient(135deg, ${COLORS.forest} 0%, ${COLORS.emerald} 100%)`, borderRadius: 20, padding: "2rem", textAlign: "center", marginBottom: "2rem", color: "#fff" }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>💚</div>
              <p style={{ fontSize: 16, lineHeight: 1.7, fontFamily: "sans-serif", margin: "0 0 1.5rem", maxWidth: 520, marginLeft: "auto", marginRight: "auto", color: COLORS.lime }}>{result.motivationalMessage}</p>
              <button
                onClick={restart}
                style={{ background: "#fff", color: COLORS.forest, border: "none", borderRadius: 10, padding: "12px 32px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "sans-serif" }}
              >
                🔄 Retake Assessment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SectionTitle({ icon, title }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
      <span style={{ fontSize: 22 }}>{icon}</span>
      <h2 style={{ fontSize: 20, color: COLORS.forest, fontWeight: 700, margin: 0 }}>{title}</h2>
    </div>
  );
}