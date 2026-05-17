const { useState, useEffect, useCallback } = React;

// ─── Design Tokens ────────────────────────────────────────────
const T = {
  white:  "#ffffff",
  ink:    "#111111",
  inkMid: "#2a2a2a",
  inkSub: "#6b6b6b",
  g100:   "#f5f5f5",
  g200:   "#e8e8e8",
  g300:   "#cccccc",
  blue:   "#2E5F8A",
  blueL:  "#dce8f3",
  blueD:  "#1a4a72",
};

// ─── Questions ────────────────────────────────────────────────
const QUESTIONS = {
  "課題解決型": [
    { id:"q1", text:"議論の入り方", q:"このメンバーは議論の最初にどう動いていましたか？", choices:[
      { id:"A", text:"問題の定義・論点整理から始めていた" },
      { id:"B", text:"具体的なアイデア・提案をすぐに出していた" },
      { id:"C", text:"他のメンバーの発言を聞いてから発言していた" },
      { id:"D", text:"最初はあまり発言していなかった" },
    ]},
    { id:"q2", text:"構造化・論理展開", q:"このメンバーの発言は議論をどう動かしていましたか？", choices:[
      { id:"A", text:"議論を整理・分解して前に進める発言が多かった" },
      { id:"B", text:"根拠や数字を使って説得力を持たせていた" },
      { id:"C", text:"アイデアを具体的な打ち手に落とし込んでいた" },
      { id:"D", text:"発言が散漫で議論への貢献が見えにくかった" },
    ]},
    { id:"q3", text:"現実性への意識", q:"このメンバーはアイデアの実現可能性にどう関わっていましたか？", choices:[
      { id:"A", text:"積極的に実現可能性・制約を確認していた" },
      { id:"B", text:"指摘されてから修正・調整していた" },
      { id:"C", text:"実現可能性よりアイデアの発散を優先していた" },
      { id:"D", text:"その観点への言及はほぼなかった" },
    ]},
    { id:"q4", text:"行き詰まった時の動き", q:"議論が膠着した場面で、このメンバーはどう動いていましたか？", choices:[
      { id:"A", text:"新しい切り口・視点を提示して場を動かしていた" },
      { id:"B", text:"問題を小さく分解して議論を再スタートさせていた" },
      { id:"C", text:"周囲に声をかけ意見を引き出していた" },
      { id:"D", text:"特に動きは見られなかった" },
    ]},
    { id:"q5", text:"結論への貢献", q:"チームの結論をまとめる場面で、このメンバーはどう動いていましたか？", choices:[
      { id:"A", text:"意見を統合して結論を言語化しようとしていた" },
      { id:"B", text:"自分の意見を結論に反映させようとしていた" },
      { id:"C", text:"他のメンバーの結論案を補足・支持していた" },
      { id:"D", text:"あまり関与していなかった" },
    ]},
    { id:"q6", text:"全体の関与スタイル", q:"GD全体を通じた関与の仕方を最もよく表しているのはどれですか？", choices:[
      { id:"A", text:"議論をリードする場面が多かった" },
      { id:"B", text:"要所で的確な発言をしていた" },
      { id:"C", text:"サポート・補完役として貢献していた" },
      { id:"D", text:"発言量・関与度ともに少なかった" },
    ]},
  ],
  "抽象・定義型": [
    { id:"q1", text:"定義への入り方", q:"このメンバーはお題の定義・解釈にどう関わっていましたか？", choices:[
      { id:"A", text:"独自の切り口で定義を提示し議論の起点を作っていた" },
      { id:"B", text:"他のメンバーの定義を深掘り・発展させていた" },
      { id:"C", text:"複数の定義を比較・整理しようとしていた" },
      { id:"D", text:"定義の議論にはあまり参加していなかった" },
    ]},
    { id:"q2", text:"抽象と具体のバランス", q:"このメンバーの発言はどちらの傾向がありましたか？", choices:[
      { id:"A", text:"抽象的な概念を具体例に落とし込むのが上手だった" },
      { id:"B", text:"具体例から本質的な意味を抽象化して引き出していた" },
      { id:"C", text:"抽象・具体の行き来が自然でバランスが良かった" },
      { id:"D", text:"どちらかに偏っていて議論が広がりにくかった" },
    ]},
    { id:"q3", text:"異なる意見との向き合い方", q:"自分と異なる意見が出たとき、このメンバーはどう動いていましたか？", choices:[
      { id:"A", text:"相手の良い点を認めつつ自分の意見を伝えていた" },
      { id:"B", text:"相手の意見を取り入れて自分の考えをアップデートしていた" },
      { id:"C", text:"自分の意見を維持しながらも相手を尊重していた" },
      { id:"D", text:"自分の意見を押し通す場面が目立った" },
    ]},
    { id:"q4", text:"発言の独自性", q:"このメンバーの発言は議論にどんな影響を与えていましたか？", choices:[
      { id:"A", text:"他の人が気づいていない視点を提供していた" },
      { id:"B", text:"既出の意見を整理・深める発言が多かった" },
      { id:"C", text:"議論の方向性を確認・軌道修正していた" },
      { id:"D", text:"既出の意見の繰り返しが多かった" },
    ]},
    { id:"q5", text:"少数意見・沈黙への対応", q:"発言の少ないメンバーや少数意見に対して、どう動いていましたか？", choices:[
      { id:"A", text:"積極的に話を振ったり意見を聞き出していた" },
      { id:"B", text:"自然な流れで発言しやすい雰囲気を作っていた" },
      { id:"C", text:"特に意識した動きは見られなかった" },
      { id:"D", text:"自分の発言に集中していた" },
    ]},
    { id:"q6", text:"議論の着地への関与", q:"発散しがちな議論をまとめる場面で、このメンバーはどう動いていましたか？", choices:[
      { id:"A", text:"共通点を見つけてチームの結論を言語化しようとしていた" },
      { id:"B", text:"論点を絞って議論の収束を促していた" },
      { id:"C", text:"まとめようとしている人をサポートしていた" },
      { id:"D", text:"発散したまま特に関与しなかった" },
    ]},
  ],
};

const AXES = [
  { key:"involvement", label:"関与度",  sub:"Involvement" },
  { key:"thinking",    label:"思考力",  sub:"Thinking" },
  { key:"flexibility", label:"柔軟性",  sub:"Flexibility" },
  { key:"inclusion",   label:"包摂力",  sub:"Inclusion" },
  { key:"delivery",    label:"発言力",  sub:"Delivery" },
];

const SCORE_MAP = {
  A:{ involvement:2, thinking:2, flexibility:1, inclusion:1, delivery:2 },
  B:{ involvement:1, thinking:2, flexibility:1, inclusion:0, delivery:2 },
  C:{ involvement:1, thinking:1, flexibility:2, inclusion:2, delivery:1 },
  D:{ involvement:0, thinking:0, flexibility:0, inclusion:0, delivery:0 },
};

function computeAxes(answersPerMember) {
  // answersPerMember: array of {q1:A, q2:B, ...} objects from multiple evaluators
  if (!answersPerMember.length) return null;
  const totals = { involvement:0, thinking:0, flexibility:0, inclusion:0, delivery:0 };
  let count = 0;
  answersPerMember.forEach(ans => {
    Object.values(ans).forEach(a => {
      Object.keys(totals).forEach(k => { totals[k] += (SCORE_MAP[a]?.[k] ?? 0); });
      count++;
    });
  });
  const qCount = Object.keys(answersPerMember[0]).length || 6;
  const max = answersPerMember.length * qCount * 2;
  return Object.fromEntries(
    Object.keys(totals).map(k => [k, 1 + (totals[k] / max) * 4])
  );
}

function classifyType(axes) {
  if (!axes) return { involvementType:"—", thinkingType:"—" };
  const invType = axes.involvement >= 3.5 ? "牽引型"
    : axes.inclusion >= 3.5 ? "支援型"
    : axes.involvement >= 2.5 ? "論客型" : "観察型";
  const thiType = axes.thinking >= 3.5 ? "構造化型"
    : axes.flexibility >= 3.5 ? "統合型"
    : axes.inclusion >= 3 ? "共感型" : "発想型";
  return { involvementType:invType, thinkingType:thiType };
}

function buildAxisComparison(rows) {
  const valid = rows.filter(r => r.axes);
  if (!valid.length) return { total:0, averages:{}, byName:{} };

  const averages = Object.fromEntries(AXES.map(a => {
    const total = valid.reduce((sum, r) => sum + r.axes[a.key], 0);
    return [a.key, total / valid.length];
  }));

  const byName = {};
  valid.forEach(row => {
    byName[row.name] = Object.fromEntries(AXES.map(a => {
      const score = row.axes[a.key];
      const rank = 1 + valid.filter(other => other.axes[a.key] > score).length;
      return [a.key, {
        average: averages[a.key],
        diff: score - averages[a.key],
        rank,
        total: valid.length,
      }];
    }));
  });
  return { total:valid.length, averages, byName };
}

// ─── Shared Storage ───────────────────────────────────────────
const SB = window.OPEN_GD_CONFIG || {};
const useSupabase = () => Boolean(SB.SUPABASE_URL && SB.SUPABASE_ANON_KEY);
const AUTH_KEY = "open_gd_admin_auth";

function getAdminAuth() {
  try { return JSON.parse(window.localStorage.getItem(AUTH_KEY) || "null"); }
  catch { return null; }
}

function setAdminAuth(auth) {
  if (auth) window.localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
  else window.localStorage.removeItem(AUTH_KEY);
}

async function sbRequest(path, options={}) {
  const base = SB.SUPABASE_URL.replace(/\/$/, "");
  const token = getAdminAuth()?.access_token || SB.SUPABASE_ANON_KEY;
  const res = await fetch(`${base}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SB.SUPABASE_ANON_KEY,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  if (!res.ok) throw new Error(await res.text());
  if (res.status === 204) return null;
  return res.json();
}

async function adminSignIn(email, password) {
  const base = SB.SUPABASE_URL.replace(/\/$/, "");
  const res = await fetch(`${base}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      apikey: SB.SUPABASE_ANON_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("login failed");
  const data = await res.json();
  const allowed = SB.ADMIN_EMAILS || [];
  if (allowed.length && !allowed.includes(data.user?.email)) throw new Error("not allowed");
  setAdminAuth({
    access_token: data.access_token,
    expires_at: Math.floor(Date.now() / 1000) + data.expires_in,
    email: data.user?.email,
  });
  return data.user;
}

function hasValidAdminAuth() {
  const auth = getAdminAuth();
  return Boolean(auth?.access_token && auth.expires_at > Math.floor(Date.now() / 1000) + 60);
}

async function stGet(key) {
  try {
    if (useSupabase()) {
      const rows = await sbRequest(
        `app_storage?key=eq.${encodeURIComponent(key)}&select=value&limit=1`
      );
      return rows?.[0]?.value ?? null;
    }
    if (window.storage?.get) {
      const r = await window.storage.get(key, true);
      return r ? JSON.parse(r.value) : null;
    }
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  }
  catch (err) {
    console.warn("OPEN GD storage read failed", err);
    return null;
  }
}
async function stSet(key, val) {
  try {
    if (useSupabase()) {
      await sbRequest("app_storage?on_conflict=key", {
        method: "POST",
        headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify({
          key,
          value: val,
          updated_at: new Date().toISOString(),
        }),
      });
      return true;
    }
    const raw = JSON.stringify(val);
    if (window.storage?.set) await window.storage.set(key, raw, true);
    else window.localStorage.setItem(key, raw);
    return true;
  }
  catch (err) {
    console.warn("OPEN GD storage write failed", err);
    return false;
  }
}

function uid() { return Math.random().toString(36).slice(2,8).toUpperCase(); }

// ─── CSS ─────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;800&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Noto Sans JP',Meiryo,sans-serif;background:${T.g100};color:${T.ink};}
  button,input,select,textarea{font-family:'Noto Sans JP',Meiryo,sans-serif;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
  @keyframes reveal{from{opacity:0;transform:scale(.97)}to{opacity:1;transform:scale(1)}}
  .fu{animation:fadeUp .3s ease both}
  .rv{animation:reveal .4s cubic-bezier(.22,1,.36,1) both}
  input:focus,select:focus,textarea:focus{outline:none;border-color:${T.blue}!important;}
`;

// ─── Atoms ───────────────────────────────────────────────────
const Tag = ({ children, blue, small }) => (
  <span style={{
    display:"inline-block", padding: small?"1px 6px":"2px 9px",
    borderRadius:2, fontSize: small?8:9, fontWeight:700, letterSpacing:"0.05em",
    background: blue ? T.blueL : T.g100,
    color: blue ? T.blue : T.inkSub,
    border:`1px solid ${blue ? T.blue : T.g200}`,
  }}>{children}</span>
);

const Btn = ({ children, onClick, variant="primary", disabled, full, small, style:sx={}, sx:legacySx={} }) => {
  const s = {
    primary:{ background:T.blue, color:T.white, border:`1px solid ${T.blue}` },
    ghost:  { background:T.white, color:T.inkMid, border:`1px solid ${T.g200}` },
    danger: { background:T.white, color:"#b05050", border:"1px solid #e8c0c0" },
  }[variant];
  return (
    <button onClick={onClick} disabled={disabled} style={{
      ...s, borderRadius:2, padding: small?"6px 14px":"10px 22px",
      fontSize: small?11:13, fontWeight:700,
      cursor: disabled?"not-allowed":"pointer",
      opacity: disabled?0.4:1, width: full?"100%":"auto",
      transition:"all 0.15s", letterSpacing:"0.03em", ...sx, ...legacySx,
    }}>{children}</button>
  );
};

const Card = ({ children, style:sx={}, accent }) => (
  <div style={{
    background:T.white, border:`1px solid ${T.g200}`,
    borderTop: accent ? `3px solid ${T.blue}` : undefined,
    borderRadius:2, ...sx,
  }}>{children}</div>
);

const SLabel = ({ children }) => (
  <p style={{ fontSize:9, fontWeight:700, letterSpacing:"0.12em",
    color:T.blue, fontFamily:"'Courier New',monospace" }}>{children}</p>
);

const Divider = ({ my=16 }) => (
  <div style={{ height:1, background:T.g200, margin:`${my}px 0` }} />
);

const Input = ({ value, onChange, placeholder, type="text", onKeyDown, style:sx={} }) => (
  <input type={type} value={value} onChange={e=>onChange(e.target.value)}
    placeholder={placeholder} onKeyDown={onKeyDown}
    style={{ width:"100%", border:`1.5px solid ${T.g200}`, borderRadius:2,
      padding:"9px 12px", fontSize:13, color:T.ink,
      background:T.g100, transition:"border-color 0.15s", ...sx }} />
);

const FieldLabel = ({ children }) => (
  <p style={{ fontSize:10, fontWeight:700, color:T.inkSub,
    letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:5 }}>{children}</p>
);

// ─── Nav ─────────────────────────────────────────────────────
const Nav = ({ mode, setMode }) => (
  <div style={{ background:T.white, borderBottom:`1px solid ${T.g200}`,
    position:"sticky", top:0, zIndex:100 }}>
    <div style={{ maxWidth:880, margin:"0 auto", padding:"0 24px",
      display:"flex", alignItems:"center", justifyContent:"space-between", height:50 }}>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ width:3, height:18, background:T.blue }} />
        <span style={{ fontFamily:"'Courier New',monospace", fontSize:12,
          fontWeight:700, color:T.inkMid, letterSpacing:"0.1em" }}>OPEN GD</span>
      </div>
      <div style={{ display:"flex", gap:4 }}>
        {[["student","学生"],["admin","管理者"]].map(([m,l])=>(
          <button key={m} onClick={()=>setMode(m)} style={{
            background: mode===m?T.blue:"none",
            color: mode===m?T.white:T.inkSub,
            border:"none", borderRadius:2, padding:"5px 14px",
            fontSize:10, fontWeight:700, cursor:"pointer",
            transition:"all 0.15s", letterSpacing:"0.05em",
          }}>{l}</button>
        ))}
      </div>
    </div>
  </div>
);

const wrap = (children, maxW=520) => (
  <div style={{ maxWidth:maxW, margin:"0 auto", padding:"40px 20px 80px" }}>{children}</div>
);

// ═══════════════════════════════════════════════════════════════
// STUDENT SIDE
// ═══════════════════════════════════════════════════════════════
function StudentApp() {
  // phases: login | eval | myresult
  const [phase, setPhase] = useState("login");
  const [codeInput, setCodeInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [session, setSession] = useState(null);   // loaded session object
  const [myName, setMyName] = useState("");

  // eval state
  const [targetIndex, setTargetIndex] = useState(0); // which teammate
  const [qIndex, setQIndex] = useState(0);
  const [allAnswers, setAllAnswers] = useState({}); // { memberName: {q1:A,...} }
  const [selected, setSelected] = useState(null);
  const [submittedMembers, setSubmittedMembers] = useState({}); // {name: true}
  const [loading, setLoading] = useState(false);

  // result state
  const [myAxes, setMyAxes] = useState(null);
  const [myTypes, setMyTypes] = useState(null);
  const [peerAnswersOnMe, setPeerAnswersOnMe] = useState([]);
  const [myComparison, setMyComparison] = useState(null);

  const targets = session ? session.members.filter(m => m !== myName) : [];
  const currentTarget = targets[targetIndex];
  const questions = session ? QUESTIONS[session.gdType] : [];
  const currentQ = questions[qIndex];
  const doneCount = Object.keys(submittedMembers).length;
  const allDone = targets.length > 0 && doneCount === targets.length;

  const handleLogin = async () => {
    if (!codeInput.trim() || !nameInput.trim()) {
      setLoginError("セッションコードと名前を入力してください"); return;
    }
    setLoading(true);
    const sess = await stGet(`session:${codeInput.trim().toUpperCase()}`);
    if (!sess) { setLoginError("セッションが見つかりません。コードを確認してください。"); setLoading(false); return; }
    if (!sess.members.includes(nameInput.trim())) {
      setLoginError("この名前はセッションに登録されていません。"); setLoading(false); return;
    }
    // Check if already submitted all
    const existing = await stGet(`submitted:${sess.code}:${nameInput.trim()}`);
    if (existing) {
      setSubmittedMembers(existing);
      if (Object.keys(existing).length === sess.members.filter(m=>m!==nameInput.trim()).length) {
        // go straight to result
        await loadMyResult(sess, nameInput.trim());
        setSession(sess); setMyName(nameInput.trim());
        setLoading(false); return;
      }
    }
    setSession(sess);
    setMyName(nameInput.trim());
    setLoginError("");
    setLoading(false);
    setPhase("eval");
  };

  const loadMyResult = async (sess, name) => {
    const raw = await stGet(`evals:${sess.code}:${name}`) || [];
    const axes = raw.length ? computeAxes(raw) : null;
    const types = axes ? classifyType(axes) : null;
    const rows = [];
    for (const member of sess.members) {
      const evals = await stGet(`evals:${sess.code}:${member}`) || [];
      rows.push({ name:member, axes: evals.length ? computeAxes(evals) : null });
    }
    const comparison = buildAxisComparison(rows);
    setMyAxes(axes);
    setMyTypes(types);
    setPeerAnswersOnMe(raw);
    setMyComparison(comparison.byName[name] || null);
    setPhase("myresult");
  };

  const handleAnswer = (c) => setSelected(c);

  const handleNext = async () => {
    if (!selected) return;
    const newQ = { ...( (allAnswers[currentTarget])||{} ), [currentQ.id]: selected };
    const newAllAnswers = { ...allAnswers, [currentTarget]: newQ };
    setAllAnswers(newAllAnswers);
    setSelected(null);

    if (qIndex < questions.length - 1) {
      setQIndex(qIndex + 1);
    } else {
      // submitted all qs for this target
      setLoading(true);
      // append to evals for target
      const key = `evals:${session.code}:${currentTarget}`;
      const existing = await stGet(key) || [];
      // deduplicate by evaluator name (in case of re-submit)
      const filtered = existing.filter(e => e._by !== myName);
      await stSet(key, [...filtered, { ...newQ, _by: myName }]);

      const newSub = { ...submittedMembers, [currentTarget]: true };
      setSubmittedMembers(newSub);
      await stSet(`submitted:${session.code}:${myName}`, newSub);

      const remaining = targets.filter(t => !newSub[t]);
      if (remaining.length > 0) {
        setTargetIndex(targets.indexOf(remaining[0]));
        setQIndex(0);
        setLoading(false);
      } else {
        // all done — load my result
        await loadMyResult(session, myName);
        setLoading(false);
      }
    }
  };

  // ── LOGIN ──
  if (phase === "login") return wrap(
    <div className="fu">
      <Card style={{ padding:"36px 32px" }}>
        <SLabel>OPEN GD / STUDENT</SLabel>
        <h1 style={{ fontSize:22, fontWeight:800, marginBottom:6, marginTop:6 }}>ログイン</h1>
        <p style={{ fontSize:11, color:T.inkSub, marginBottom:24, lineHeight:1.7 }}>
          運営から配布されたセッションコードと、登録された氏名を入力してください。<br/>
          評価は匿名で処理されます。
        </p>
        <div style={{ marginBottom:14 }}>
          <FieldLabel>セッションコード</FieldLabel>
          <Input value={codeInput} onChange={v=>setCodeInput(v.toUpperCase())}
            placeholder="例：AB12CD"
            style={{ fontFamily:"'Courier New',monospace", fontSize:18, fontWeight:700,
              letterSpacing:"0.2em", textAlign:"center" }}
            onKeyDown={e=>e.key==="Enter"&&handleLogin()} />
        </div>
        <div style={{ marginBottom:20 }}>
          <FieldLabel>あなたの名前（登録された氏名）</FieldLabel>
          <Input value={nameInput} onChange={setNameInput} placeholder="田中 一郎"
            onKeyDown={e=>e.key==="Enter"&&handleLogin()} />
        </div>
        {loginError && (
          <div style={{ background:"#fef2f2", border:"1px solid #fecaca",
            borderRadius:2, padding:"10px 14px", marginBottom:14 }}>
            <p style={{ fontSize:11, color:"#b05050" }}>⚠ {loginError}</p>
          </div>
        )}
        <Btn onClick={handleLogin} full disabled={loading}>
          {loading ? "確認中…" : "開始する →"}
        </Btn>
      </Card>
    </div>
  );

  // ── EVAL ──
  if (phase === "eval") {
    const progress = ((qIndex + targetIndex * questions.length) /
      (targets.length * questions.length)) * 100;

    return wrap(
      <div className="fu" key={`${targetIndex}-${qIndex}`}>
        {/* Session info bar */}
        <div style={{ background:T.blueL, border:`1px solid ${T.blue}`,
          borderRadius:2, padding:"10px 16px", marginBottom:20,
          display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
          <div>
            <SLabel>SESSION {session.code}</SLabel>
            <p style={{ fontSize:11, color:T.blue, marginTop:2, fontWeight:700 }}>
              {session.gdType}　「{session.topic}」
            </p>
          </div>
          <p style={{ fontSize:11, color:T.blue, fontWeight:700 }}>
            {myName}
          </p>
        </div>

        {/* Progress */}
        <div style={{ marginBottom:20 }}>
          <div style={{ display:"flex", justifyContent:"space-between",
            alignItems:"baseline", marginBottom:6 }}>
            <p style={{ fontSize:10, fontWeight:700, color:T.inkSub }}>
              評価中：<span style={{ color:T.ink }}>{currentTarget}</span>
              <span style={{ color:T.inkSub, marginLeft:8 }}>（{targetIndex+1}/{targets.length}人目）</span>
            </p>
            <p style={{ fontFamily:"'Courier New',monospace", fontSize:10, color:T.inkSub }}>
              Q{qIndex+1} / {questions.length}
            </p>
          </div>
          <div style={{ height:4, background:T.g200, borderRadius:2 }}>
            <div style={{ height:"100%", width:`${progress}%`, background:T.blue,
              borderRadius:2, transition:"width 0.4s ease" }} />
          </div>
          {/* Member chips */}
          <div style={{ display:"flex", gap:6, marginTop:10, flexWrap:"wrap" }}>
            {targets.map(t => (
              <span key={t} style={{
                fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:2,
                background: submittedMembers[t] ? T.blueL
                  : t===currentTarget ? T.blue : T.g100,
                color: submittedMembers[t] ? T.blue
                  : t===currentTarget ? T.white : T.inkSub,
                border:`1px solid ${submittedMembers[t] ? T.blue
                  : t===currentTarget ? T.blue : T.g200}`,
              }}>
                {submittedMembers[t] ? "✓ " : t===currentTarget ? "→ " : ""}{t}
              </span>
            ))}
          </div>
        </div>

        {/* Question card */}
        <Card style={{ padding:"24px 24px" }}>
          <p style={{ fontSize:11, color:T.inkSub, fontWeight:700, marginBottom:6 }}>
            {currentQ.text}
          </p>
          <p style={{ fontSize:15, fontWeight:800, color:T.ink, marginBottom:20, lineHeight:1.55 }}>
            {currentQ.q}
          </p>
          {currentQ.choices.map(c => (
            <div key={c.id} onClick={() => !loading && handleAnswer(c.id)}
              style={{
                display:"flex", alignItems:"center", gap:12,
                border:`1.5px solid ${selected===c.id ? T.blue : T.g200}`,
                background: selected===c.id ? T.blueL : T.g100,
                borderRadius:2, padding:"13px 16px", marginBottom:9,
                cursor: loading ? "not-allowed" : "pointer",
                transition:"all 0.12s",
              }}>
              <div style={{ width:20, height:20, borderRadius:2, flexShrink:0,
                border:`2px solid ${selected===c.id ? T.blue : T.g300}`,
                background: selected===c.id ? T.blue : T.white,
                display:"flex", alignItems:"center", justifyContent:"center" }}>
                {selected===c.id && <span style={{ color:T.white, fontSize:10, fontWeight:900 }}>✓</span>}
              </div>
              <span style={{ fontFamily:"'Courier New',monospace", fontSize:10,
                fontWeight:700, color: selected===c.id ? T.blue : T.g300, minWidth:12 }}>{c.id}</span>
              <span style={{ fontSize:12, color: selected===c.id ? T.blue : T.inkMid,
                fontWeight: selected===c.id ? 700 : 400, lineHeight:1.5 }}>{c.text}</span>
            </div>
          ))}
          <div style={{ marginTop:20 }}>
            <Btn onClick={handleNext} disabled={!selected || loading} full>
              {loading ? "保存中…"
                : qIndex < questions.length-1 ? "次の設問へ →"
                : targetIndex < targets.length-1 ? "次のメンバーへ →"
                : "送信して自分の評価を見る →"}
            </Btn>
          </div>
        </Card>
      </div>
    );
  }

  // ── MY RESULT ──
  if (phase === "myresult") return wrap(
    <div className="rv">
      {/* Banner */}
      <div style={{ background:T.blue, borderRadius:2, padding:"24px 28px",
        marginBottom:16, color:T.white }}>
        <SLabel>YOUR RESULT</SLabel>
        <h2 style={{ fontSize:20, fontWeight:800, margin:"6px 0 4px" }}>
          {myName}さんへの評価
        </h2>
        <p style={{ fontSize:11, opacity:0.75, lineHeight:1.6 }}>
          チームメンバーからの匿名評価を集計しました。<br/>
          誰がどの点数をつけたかは公開されません。
        </p>
      </div>

      {myAxes ? (
        <>
          {/* Type */}
          <Card style={{ padding:"18px 22px", marginBottom:12 }}>
            <SLabel>タイプ判定</SLabel>
            <div style={{ display:"flex", gap:10, marginTop:10, flexWrap:"wrap" }}>
              <div style={{ flex:1, minWidth:120, background:T.blueL,
                border:`1px solid ${T.blue}`, borderRadius:2, padding:"12px 14px" }}>
                <p style={{ fontSize:9, color:T.blue, fontWeight:700, marginBottom:3 }}>関与スタイル</p>
                <p style={{ fontSize:17, fontWeight:800, color:T.blue }}>{myTypes.involvementType}</p>
              </div>
              <div style={{ flex:1, minWidth:120, background:T.g100,
                border:`1px solid ${T.g200}`, borderRadius:2, padding:"12px 14px" }}>
                <p style={{ fontSize:9, color:T.inkSub, fontWeight:700, marginBottom:3 }}>思考アプローチ</p>
                <p style={{ fontSize:17, fontWeight:800, color:T.inkMid }}>{myTypes.thinkingType}</p>
              </div>
            </div>
          </Card>

          {/* Axes */}
          <Card style={{ padding:"18px 22px", marginBottom:12 }}>
            <SLabel>5軸スコア</SLabel>
            <div style={{ marginTop:12 }}>
              {AXES.map(a => (
                <div key={a.key} style={{ marginBottom:12 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                    <span style={{ fontSize:11, fontWeight:700, color:T.inkMid }}>{a.label}</span>
                    <span style={{ fontFamily:"'Courier New',monospace", fontSize:12,
                      fontWeight:700, color:T.blue }}>
                      {myAxes[a.key].toFixed(1)}
                      {myComparison?.[a.key] && (
                        <span style={{ color:T.inkSub, fontSize:10, marginLeft:8 }}>
                          {myComparison[a.key].rank}/{myComparison[a.key].total}位
                        </span>
                      )}
                    </span>
                  </div>
                  <div style={{ height:5, background:T.g200, borderRadius:2 }}>
                    <div style={{ height:"100%", borderRadius:2,
                      width:`${((myAxes[a.key]-1)/4)*100}%`,
                      background:T.blue, transition:"width 1s ease" }} />
                  </div>
                  {myComparison?.[a.key] && (
                    <p style={{ fontSize:10, color:T.inkSub, marginTop:4 }}>
                      平均 {myComparison[a.key].average.toFixed(1)}　
                      平均差 {myComparison[a.key].diff >= 0 ? "+" : ""}{myComparison[a.key].diff.toFixed(1)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Per-question breakdown */}
          {peerAnswersOnMe.length > 0 && (
            <Card style={{ padding:"18px 22px", marginBottom:12 }}>
              <SLabel>設問別・回答分布</SLabel>
              <p style={{ fontSize:10, color:T.inkSub, margin:"6px 0 16px" }}>
                評価者{peerAnswersOnMe.length}名の回答分布（匿名）
              </p>
              {questions.map((q, qi) => {
                const counts = { A:0, B:0, C:0, D:0 };
                peerAnswersOnMe.forEach(e => { if(e[q.id]) counts[e[q.id]]++; });
                const total = peerAnswersOnMe.length;
                const topChoice = Object.entries(counts).sort((a,b)=>b[1]-a[1])[0][0];
                return (
                  <div key={q.id} style={{ marginBottom:qi<questions.length-1?16:0,
                    paddingBottom:qi<questions.length-1?16:0,
                    borderBottom:qi<questions.length-1?`1px solid ${T.g200}`:"none" }}>
                    <p style={{ fontSize:10, fontWeight:700, color:T.inkSub, marginBottom:8 }}>
                      Q{qi+1}　{q.text}
                    </p>
                    <div style={{ display:"flex", gap:6 }}>
                      {["A","B","C","D"].map(ch => (
                        <div key={ch} style={{ flex:1, textAlign:"center" }}>
                          <div style={{ height:36, background:T.g100, borderRadius:2,
                            overflow:"hidden", display:"flex", alignItems:"flex-end" }}>
                            <div style={{
                              width:"100%",
                              height: total ? `${(counts[ch]/total)*100}%` : "0%",
                              background: ch===topChoice ? T.blue : T.g300,
                              borderRadius:2, transition:"height 0.6s ease",
                              minHeight: counts[ch]>0 ? 4 : 0,
                            }} />
                          </div>
                          <p style={{ fontSize:9, marginTop:3, fontFamily:"'Courier New',monospace",
                            fontWeight:700, color: ch===topChoice ? T.blue : T.inkSub }}>
                            {ch}({counts[ch]})
                          </p>
                        </div>
                      ))}
                    </div>
                    <p style={{ fontSize:10, color:T.blue, marginTop:6, fontWeight:600 }}>
                      最多：{q.choices.find(c=>c.id===topChoice)?.text}
                    </p>
                  </div>
                );
              })}
            </Card>
          )}

          <div style={{ background:T.g100, border:`1px solid ${T.g200}`,
            borderRadius:2, padding:"12px 16px", marginBottom:16 }}>
            <p style={{ fontSize:11, color:T.inkSub, lineHeight:1.7 }}>
              🔒 このスコアはあなただけに表示されています。企業へのスカウト活用には、別途同意設定が必要です。
            </p>
          </div>
        </>
      ) : (
        <Card style={{ padding:"28px", textAlign:"center" }}>
          <p style={{ fontSize:14, color:T.inkSub, lineHeight:1.7 }}>
            まだあなたへの評価が届いていません。<br/>
            チームメンバーの評価が揃い次第、ここに表示されます。
          </p>
        </Card>
      )}

      <Btn onClick={()=>{setPhase("login");setCodeInput("");setNameInput("");
        setAllAnswers({});setSubmittedMembers({});setTargetIndex(0);setQIndex(0);setMyComparison(null);}}
        full variant="ghost" sx={{ marginTop:8 }}>
        トップに戻る
      </Btn>
    </div>,
    560
  );

  return null;
}

// ═══════════════════════════════════════════════════════════════
// ADMIN SIDE
// ═══════════════════════════════════════════════════════════════
function AdminApp() {
  const [auth, setAuth] = useState(hasValidAdminAuth());
  const [emailInput, setEmailInput] = useState("");
  const [passInput, setPassInput] = useState("");
  const [passError, setPassError] = useState("");

  // views: dashboard | create | session | report
  const [view, setView] = useState("dashboard");
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [reportTab, setReportTab] = useState("overview");
  const [loading, setLoading] = useState(false);

  // create form
  const [newTopic, setNewTopic] = useState("");
  const [newGdType, setNewGdType] = useState("課題解決型");
  const [newMembers, setNewMembers] = useState("");
  const [createError, setCreateError] = useState("");

  const loadSessions = useCallback(async () => {
    const list = await stGet("admin:sessions") || [];
    setSessions(list);
  }, []);

  useEffect(() => { if (auth) loadSessions(); }, [auth, loadSessions]);

  const handleLogin = async () => {
    if (!useSupabase()) {
      setPassError("Supabase接続が設定されていません");
      return;
    }
    if (!emailInput.trim() || !passInput) {
      setPassError("メールアドレスとパスワードを入力してください");
      return;
    }
    setLoading(true);
    try {
      await adminSignIn(emailInput.trim(), passInput);
      setAuth(true);
      setPassError("");
    } catch {
      setPassError("ログインできません。管理者アカウントを確認してください。");
    } finally {
      setLoading(false);
    }
  };

  const createSession = async () => {
    if (!newTopic.trim()) { setCreateError("お題を入力してください"); return; }
    const members = newMembers.split(/[\n,、]/).map(m=>m.trim()).filter(Boolean);
    if (members.length < 2) { setCreateError("メンバーを2名以上入力してください"); return; }
    setLoading(true);
    const code = uid();
    const sess = {
      code, topic: newTopic.trim(), gdType: newGdType,
      members, createdAt: new Date().toISOString(), status:"active",
    };
    await stSet(`session:${code}`, sess);
    const list = await stGet("admin:sessions") || [];
    await stSet("admin:sessions", [sess, ...list]);
    setSessions([sess, ...list]);
    setNewTopic(""); setNewMembers(""); setCreateError("");
    setLoading(false);
    setView("dashboard");
  };

  const loadSessionDetail = async (sess) => {
    setLoading(true);
    const enriched = { ...sess, studentData: [] };
    for (const m of sess.members) {
      const evals = await stGet(`evals:${sess.code}:${m}`) || [];
      const submitted = await stGet(`submitted:${sess.code}:${m}`) || {};
      const axes = evals.length ? computeAxes(evals) : null;
      const types = axes ? classifyType(axes) : null;
      const otherMembers = sess.members.filter(x=>x!==m);
      const evalsDone = otherMembers.filter(o => submitted[o]).length;
      enriched.studentData.push({
        name:m, evals, submitted, axes, ...types,
        evalsDone, evalsTotal: otherMembers.length,
      });
    }
    const comparison = buildAxisComparison(enriched.studentData);
    enriched.axisComparison = comparison;
    enriched.studentData = enriched.studentData.map(s => ({
      ...s,
      comparison: comparison.byName[s.name] || null,
    }));
    setSelectedSession(enriched);
    setLoading(false);
    setView("session");
  };

  const exportCSV = (student, sess) => {
    if (!student.axes) return;
    const esc = (v) => `"${String(v ?? "").replaceAll('"', '""')}"`;
    const rows = [
      ["セッション","GDタイプ","お題","氏名","関与タイプ","思考タイプ",
       ...AXES.flatMap(a=>[a.label, `${a.label}平均`, `${a.label}順位`]),"評価者数"],
      [sess.code, sess.gdType, sess.topic, student.name,
       student.involvementType||"—", student.thinkingType||"—",
       ...AXES.flatMap(a=>[
        (student.axes?.[a.key]||0).toFixed(2),
        student.comparison?.[a.key]?.average?.toFixed(2) || "",
        student.comparison?.[a.key]
          ? `${student.comparison[a.key].rank}/${student.comparison[a.key].total}`
          : "",
       ]),
       student.evals.length],
    ];
    const csv = "\uFEFF" + rows.map(r=>r.map(esc).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv],{type:"text/csv"}));
    a.download = `${student.name}_${sess.code}.csv`; a.click();
  };

  const exportAllCSV = (sess) => {
    const esc = (v) => `"${String(v ?? "").replaceAll('"', '""')}"`;
    const rows = [
      ["セッション","GDタイプ","お題","氏名","関与タイプ","思考タイプ",
       ...AXES.flatMap(a=>[a.label, `${a.label}平均`, `${a.label}順位`]),"評価者数"],
      ...(sess.studentData||[]).map(s=>[
        sess.code, sess.gdType, sess.topic, s.name,
        s.involvementType||"—", s.thinkingType||"—",
        ...AXES.flatMap(a=>[
          (s.axes?.[a.key]||0).toFixed(2),
          s.comparison?.[a.key]?.average?.toFixed(2) || "",
          s.comparison?.[a.key]
            ? `${s.comparison[a.key].rank}/${s.comparison[a.key].total}`
            : "",
        ]),
        s.evals.length,
      ]),
    ];
    const csv = "\uFEFF" + rows.map(r=>r.map(esc).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv],{type:"text/csv"}));
    a.download = `session_${sess.code}.csv`; a.click();
  };

  // ── AUTH ──
  if (!auth) return wrap(
    <Card style={{ padding:"36px 32px" }} className="fu">
      <SLabel>OPEN GD / ADMIN</SLabel>
      <h2 style={{ fontSize:20, fontWeight:800, margin:"6px 0 20px" }}>管理者ログイン</h2>
      <div style={{ marginBottom:14 }}>
        <FieldLabel>メールアドレス</FieldLabel>
        <Input type="email" value={emailInput} onChange={setEmailInput}
          placeholder="admin@example.com" onKeyDown={e=>e.key==="Enter"&&handleLogin()} />
      </div>
      <div style={{ marginBottom:16 }}>
        <FieldLabel>パスワード</FieldLabel>
        <Input type="password" value={passInput} onChange={setPassInput}
          placeholder="••••••••" onKeyDown={e=>e.key==="Enter"&&handleLogin()} />
        {passError && <p style={{ color:"#b05050", fontSize:11, marginTop:6 }}>⚠ {passError}</p>}
      </div>
      <Btn onClick={handleLogin} full disabled={loading}>
        {loading ? "確認中…" : "ログイン"}
      </Btn>
    </Card>,
    400
  );

  const pw = (children, maxW=880) => (
    <div style={{ maxWidth:maxW, margin:"0 auto", padding:"32px 24px 80px" }}>{children}</div>
  );

  // ── CREATE SESSION ──
  if (view === "create") return pw(
    <div className="fu">
      <button onClick={()=>setView("dashboard")} style={{ background:"none", border:"none",
        cursor:"pointer", color:T.blue, fontSize:11, fontWeight:700,
        letterSpacing:"0.06em", marginBottom:20, padding:0 }}>
        ← ダッシュボードに戻る
      </button>
      <Card style={{ padding:"28px 32px", maxWidth:560 }} accent>
        <SLabel>NEW SESSION</SLabel>
        <h2 style={{ fontSize:18, fontWeight:800, margin:"6px 0 24px" }}>セッション作成</h2>

        <div style={{ marginBottom:14 }}>
          <FieldLabel>GDタイプ</FieldLabel>
          <select value={newGdType} onChange={e=>setNewGdType(e.target.value)}
            style={{ width:"100%", border:`1.5px solid ${T.g200}`, borderRadius:2,
              padding:"9px 12px", fontSize:13, background:T.g100, color:T.ink }}>
            {Object.keys(QUESTIONS).map(t=><option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div style={{ marginBottom:14 }}>
          <FieldLabel>お題</FieldLabel>
          <Input value={newTopic} onChange={setNewTopic}
            placeholder="例：地方スーパーの売上回復策を提案せよ" />
        </div>

        <div style={{ marginBottom:20 }}>
          <FieldLabel>メンバー（1行1名、またはカンマ区切り）</FieldLabel>
          <textarea value={newMembers} onChange={e=>setNewMembers(e.target.value)}
            placeholder={"田中 一郎\n佐藤 花子\n鈴木 健太\n山田 葵"}
            style={{ width:"100%", border:`1.5px solid ${T.g200}`, borderRadius:2,
              padding:"9px 12px", fontSize:13, background:T.g100, color:T.ink,
              minHeight:120, resize:"vertical" }} />
          <p style={{ fontSize:10, color:T.inkSub, marginTop:4 }}>
            ※ ここに入力した名前がログイン時の認証に使用されます
          </p>
        </div>

        {createError && (
          <div style={{ background:"#fef2f2", border:"1px solid #fecaca",
            borderRadius:2, padding:"10px 14px", marginBottom:14 }}>
            <p style={{ fontSize:11, color:"#b05050" }}>⚠ {createError}</p>
          </div>
        )}
        <Btn onClick={createSession} full disabled={loading}>
          {loading ? "作成中…" : "セッションを作成する"}
        </Btn>
      </Card>
    </div>
  );

  // ── SESSION DETAIL ──
  if (view === "session" && selectedSession) {
    const sess = selectedSession;

    // individual student report
    if (selectedStudent) {
      const s = selectedStudent;
      const questions = QUESTIONS[sess.gdType];
      return pw(
        <div className="fu">
          <button onClick={()=>setSelectedStudent(null)} style={{ background:"none", border:"none",
            cursor:"pointer", color:T.blue, fontSize:11, fontWeight:700,
            letterSpacing:"0.06em", marginBottom:20, padding:0 }}>
            ← セッションに戻る
          </button>

          <Card style={{ padding:"22px 28px", marginBottom:16 }} accent>
            <div style={{ display:"flex", justifyContent:"space-between",
              flexWrap:"wrap", gap:12 }}>
              <div>
                <SLabel>SESSION {sess.code} / STUDENT REPORT</SLabel>
                <h1 style={{ fontSize:20, fontWeight:800, margin:"4px 0 2px" }}>{s.name}</h1>
                <p style={{ fontSize:11, color:T.inkSub }}>
                  評価者数：{s.evals.length}名　　GD：{sess.gdType}　「{sess.topic}」
                </p>
              </div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"flex-start" }}>
                {s.axes && <><Tag blue>{s.involvementType}</Tag><Tag>{s.thinkingType}</Tag></>}
                <Btn onClick={()=>exportCSV(s,sess)} variant="ghost" small>CSV出力</Btn>
              </div>
            </div>
          </Card>

          {/* Tabs */}
          <div style={{ display:"flex", borderBottom:`2px solid ${T.g200}`, marginBottom:20 }}>
            {[["overview","概要"],["answers","設問回答"]].map(([id,l])=>(
              <button key={id} onClick={()=>setReportTab(id)} style={{
                background:"none", border:"none", cursor:"pointer",
                padding:"9px 18px", fontSize:11, fontWeight:700,
                color: reportTab===id?T.blue:T.inkSub,
                borderBottom: reportTab===id?`2px solid ${T.blue}`:"2px solid transparent",
                marginBottom:-2, transition:"all 0.15s",
              }}>{l}</button>
            ))}
          </div>

          {reportTab === "overview" && (
            s.axes ? (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:16 }}>
                {/* Scores */}
                <Card style={{ padding:"18px 22px" }}>
                  <SLabel>軸別スコア</SLabel>
                  <div style={{ marginTop:12 }}>
                    {AXES.map(a=>(
                      <div key={a.key} style={{ marginBottom:12 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                          <span style={{ fontSize:11, fontWeight:700, color:T.inkMid }}>{a.label}</span>
                          <span style={{ fontFamily:"'Courier New',monospace",
                            fontSize:12, fontWeight:700, color:T.blue }}>
                            {s.axes[a.key].toFixed(1)}
                            {s.comparison?.[a.key] && (
                              <span style={{ color:T.inkSub, fontSize:10, marginLeft:8 }}>
                                {s.comparison[a.key].rank}/{s.comparison[a.key].total}位
                              </span>
                            )}
                          </span>
                        </div>
                        <div style={{ height:4, background:T.g200, borderRadius:2 }}>
                          <div style={{ height:"100%", borderRadius:2, background:T.blue,
                            width:`${((s.axes[a.key]-1)/4)*100}%`,
                            transition:"width 0.8s ease" }} />
                        </div>
                        {s.comparison?.[a.key] && (
                          <p style={{ fontSize:10, color:T.inkSub, marginTop:4 }}>
                            平均 {s.comparison[a.key].average.toFixed(1)}　
                            平均差 {s.comparison[a.key].diff >= 0 ? "+" : ""}{s.comparison[a.key].diff.toFixed(1)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Types */}
                <Card style={{ padding:"18px 22px" }}>
                  <SLabel>タイプ判定</SLabel>
                  <div style={{ marginTop:12, display:"flex", flexDirection:"column", gap:10 }}>
                    {[
                      {label:"関与スタイル", value:s.involvementType, blue:true},
                      {label:"思考アプローチ", value:s.thinkingType, blue:false},
                    ].map(t=>(
                      <div key={t.label} style={{ padding:"12px 14px", borderRadius:2,
                        background:t.blue?T.blueL:T.g100,
                        border:`1px solid ${t.blue?T.blue:T.g200}` }}>
                        <p style={{ fontSize:9, fontWeight:700, marginBottom:3,
                          color:t.blue?T.blue:T.inkSub, letterSpacing:"0.06em" }}>{t.label}</p>
                        <p style={{ fontSize:16, fontWeight:800,
                          color:t.blue?T.blue:T.inkMid }}>{t.value}</p>
                      </div>
                    ))}
                    {/* Interview tip */}
                    <div style={{ padding:"10px 14px", borderRadius:2,
                      background:T.g100, border:`1px solid ${T.g200}` }}>
                      <p style={{ fontSize:9, fontWeight:700, color:T.inkSub,
                        letterSpacing:"0.06em", marginBottom:4 }}>面接活用メモ</p>
                      <p style={{ fontSize:10, color:T.inkMid, lineHeight:1.65 }}>
                        {s.involvementType==="牽引型"
                          ? "「チームが停滞した時にどう動いたか」を具体的に深掘りすると判断軸が見えやすい。"
                          : s.involvementType==="支援型"
                          ? "「自分が発言を控えた場面はあったか」と問うと自己認識の深さが分かる。"
                          : "「その発言をしたタイミングをどう選んだか」で思考プロセスを引き出せる。"}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            ) : (
              <Card style={{ padding:"28px", textAlign:"center" }}>
                <p style={{ fontSize:13, color:T.inkSub }}>まだ評価データがありません</p>
              </Card>
            )
          )}

          {reportTab === "answers" && (
            <Card style={{ padding:"22px 28px" }}>
              <SLabel>設問別　回答分布</SLabel>
              <p style={{ fontSize:10, color:T.inkSub, margin:"6px 0 20px" }}>
                評価者{s.evals.length}名の回答（匿名集計）
              </p>
              {s.evals.length === 0 ? (
                <p style={{ color:T.inkSub, fontSize:12 }}>データなし</p>
              ) : questions.map((q,qi) => {
                const counts = {A:0,B:0,C:0,D:0};
                s.evals.forEach(e=>{ if(e[q.id]) counts[e[q.id]]++; });
                const total = s.evals.length;
                const top = Object.entries(counts).sort((a,b)=>b[1]-a[1])[0][0];
                return (
                  <div key={q.id} style={{ marginBottom:qi<questions.length-1?20:0,
                    paddingBottom:qi<questions.length-1?20:0,
                    borderBottom:qi<questions.length-1?`1px solid ${T.g200}`:"none" }}>
                    <p style={{ fontSize:10, fontWeight:700, color:T.inkSub, marginBottom:8 }}>
                      Q{qi+1}　{q.text}
                    </p>
                    <div style={{ display:"flex", gap:8, marginBottom:8 }}>
                      {["A","B","C","D"].map(ch=>(
                        <div key={ch} style={{ flex:1, textAlign:"center" }}>
                          <div style={{ height:40, background:T.g100, borderRadius:2,
                            overflow:"hidden", display:"flex", alignItems:"flex-end" }}>
                            <div style={{ width:"100%",
                              height:total?`${(counts[ch]/total)*100}%`:"0%",
                              background:ch===top?T.blue:T.g300, borderRadius:2,
                              minHeight:counts[ch]>0?4:0,
                              transition:"height 0.6s ease" }} />
                          </div>
                          <p style={{ fontSize:9, marginTop:3,
                            fontFamily:"'Courier New',monospace", fontWeight:700,
                            color:ch===top?T.blue:T.inkSub }}>{ch}({counts[ch]})</p>
                        </div>
                      ))}
                    </div>
                    <p style={{ fontSize:11, color:T.blue, fontWeight:600 }}>
                      最多回答：{q.choices.find(c=>c.id===top)?.text}
                    </p>
                  </div>
                );
              })}
            </Card>
          )}
        </div>
      );
    }

    // session overview
    return pw(
      <div className="fu">
        <button onClick={()=>setView("dashboard")} style={{ background:"none", border:"none",
          cursor:"pointer", color:T.blue, fontSize:11, fontWeight:700,
          letterSpacing:"0.06em", marginBottom:20, padding:0 }}>
          ← ダッシュボードに戻る
        </button>

        <Card style={{ padding:"22px 28px", marginBottom:20 }} accent>
          <div style={{ display:"flex", justifyContent:"space-between",
            flexWrap:"wrap", gap:12 }}>
            <div>
              <SLabel>SESSION</SLabel>
              <div style={{ display:"flex", alignItems:"baseline", gap:14, margin:"4px 0 4px" }}>
                <span style={{ fontFamily:"'Courier New',monospace", fontSize:26,
                  fontWeight:700, color:T.blue, letterSpacing:"0.12em" }}>{sess.code}</span>
                <Tag blue>{sess.gdType}</Tag>
              </div>
              <p style={{ fontSize:13, color:T.inkMid, fontWeight:600 }}>「{sess.topic}」</p>
              <p style={{ fontSize:10, color:T.inkSub, marginTop:4 }}>
                作成日：{sess.createdAt?.slice(0,10)}　　メンバー：{sess.members.length}名
              </p>
            </div>
            <Btn onClick={()=>exportAllCSV(sess)} variant="ghost" small>全件CSV出力</Btn>
          </div>
          {/* Code display */}
          <div style={{ marginTop:16, padding:"12px 16px", background:T.blueL,
            border:`1px solid ${T.blue}`, borderRadius:2 }}>
            <p style={{ fontSize:10, color:T.blue, fontWeight:700, marginBottom:4 }}>
              学生への共有コード
            </p>
            <p style={{ fontFamily:"'Courier New',monospace", fontSize:22, fontWeight:700,
              color:T.blue, letterSpacing:"0.2em" }}>{sess.code}</p>
            <p style={{ fontSize:10, color:T.blueD, marginTop:2 }}>
              このコードをチャットやスクリーンで学生に共有してください
            </p>
          </div>
        </Card>

        {/* Member list */}
        <h2 style={{ fontSize:14, fontWeight:800, color:T.ink, marginBottom:12 }}>
          メンバー別進捗・レポート
        </h2>
        {loading ? (
          <p style={{ color:T.inkSub, fontSize:12 }}>読み込み中…</p>
        ) : sess.studentData.map(s => (
          <div key={s.name} onClick={()=>{ setSelectedStudent(s); setReportTab("overview"); }}
            style={{ background:T.white, border:`1px solid ${T.g200}`,
              borderLeft:`3px solid ${s.evals.length>0?T.blue:T.g300}`,
              borderRadius:2, padding:"16px 20px", marginBottom:10,
              cursor:"pointer", transition:"box-shadow 0.15s" }}
            onMouseEnter={e=>e.currentTarget.style.boxShadow=`0 4px 14px rgba(46,95,138,0.08)`}
            onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
            <div style={{ display:"flex", justifyContent:"space-between",
              alignItems:"center", flexWrap:"wrap", gap:10 }}>
              <div>
                <h3 style={{ fontSize:15, fontWeight:800, color:T.ink }}>{s.name}</h3>
                <p style={{ fontSize:10, color:T.inkSub, marginTop:2 }}>
                  自分の評価提出：{s.evalsDone}/{s.evalsTotal}名完了　　
                  受け取った評価：{s.evals.length}件
                </p>
              </div>
              <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                {s.axes
                  ? <><Tag blue>{s.involvementType}</Tag><Tag>{s.thinkingType}</Tag></>
                  : <Tag>未集計</Tag>}
                {s.evals.length > 0 && (
                  <span style={{ fontSize:10, color:T.blue, fontWeight:700 }}>
                    レポートを見る →
                  </span>
                )}
              </div>
            </div>
            {s.axes && (
              <div style={{ display:"flex", gap:16, marginTop:12, paddingTop:10,
                borderTop:`1px solid ${T.g200}`, flexWrap:"wrap" }}>
                {AXES.map(a=>(
                  <div key={a.key}>
                    <p style={{ fontSize:9, color:T.inkSub }}>{a.label}</p>
                    <p style={{ fontFamily:"'Courier New',monospace", fontSize:12,
                      fontWeight:700, color:T.blue }}>{s.axes[a.key].toFixed(1)}</p>
                    {s.comparison?.[a.key] && (
                      <p style={{ fontSize:9, color:T.inkSub }}>
                        {s.comparison[a.key].rank}/{s.comparison[a.key].total}位
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  // ── DASHBOARD ──
  return pw(
    <div className="fu">
      <div style={{ display:"flex", justifyContent:"space-between",
        alignItems:"flex-start", marginBottom:24, flexWrap:"wrap", gap:12 }}>
        <div>
          <SLabel>OPEN GD / ADMIN</SLabel>
          <h1 style={{ fontSize:20, fontWeight:800, marginTop:4 }}>ダッシュボード</h1>
        </div>
        <Btn onClick={()=>setView("create")}>+ セッション作成</Btn>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:12, marginBottom:24 }}>
        {[
          ["セッション数", sessions.length],
          ["総参加者数", sessions.reduce((s,a)=>s+a.members.length,0)],
          ["アクティブ", sessions.filter(s=>s.status==="active").length],
        ].map(([k,v])=>(
          <Card key={k} style={{ padding:"14px 18px" }}>
            <p style={{ fontSize:9, color:T.inkSub, fontWeight:700,
              letterSpacing:"0.08em", marginBottom:4 }}>{k}</p>
            <p style={{ fontFamily:"'Courier New',monospace", fontSize:20,
              fontWeight:700, color:T.ink }}>{v}</p>
          </Card>
        ))}
      </div>

      {/* Session list */}
      <h2 style={{ fontSize:13, fontWeight:800, color:T.ink, marginBottom:12 }}>セッション一覧</h2>
      {sessions.length === 0 ? (
        <Card style={{ padding:"40px", textAlign:"center" }}>
          <p style={{ fontSize:13, color:T.inkSub, marginBottom:16 }}>セッションがまだありません</p>
          <Btn onClick={()=>setView("create")}>最初のセッションを作成する</Btn>
        </Card>
      ) : sessions.map(sess=>(
        <div key={sess.code} onClick={()=>loadSessionDetail(sess)}
          style={{ background:T.white, border:`1px solid ${T.g200}`,
            borderLeft:`3px solid ${T.blue}`, borderRadius:2, padding:"16px 20px",
            marginBottom:10, cursor:"pointer", transition:"box-shadow 0.15s" }}
          onMouseEnter={e=>e.currentTarget.style.boxShadow=`0 4px 14px rgba(46,95,138,0.08)`}
          onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
          <div style={{ display:"flex", justifyContent:"space-between",
            alignItems:"center", flexWrap:"wrap", gap:10 }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:3 }}>
                <span style={{ fontFamily:"'Courier New',monospace", fontSize:13,
                  fontWeight:700, color:T.blue, letterSpacing:"0.1em" }}>{sess.code}</span>
                <Tag blue>{sess.gdType}</Tag>
              </div>
              <p style={{ fontSize:13, fontWeight:600, color:T.inkMid }}>「{sess.topic}」</p>
              <p style={{ fontSize:10, color:T.inkSub, marginTop:3 }}>
                {sess.members.length}名　{sess.createdAt?.slice(0,10)}
              </p>
            </div>
            <span style={{ fontSize:10, color:T.blue, fontWeight:700 }}>詳細を見る →</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────
function App() {
  const [mode, setMode] = useState("student");
  return (
    <>
      <style>{css}</style>
      <Nav mode={mode} setMode={setMode} />
      <div style={{ minHeight:"calc(100vh - 50px)" }}>
        {mode === "student" ? <StudentApp /> : <AdminApp />}
      </div>
    </>
  );
}

window.OpenGDApp = App;
