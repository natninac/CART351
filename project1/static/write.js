const ta = document.getElementById("entry");
const nameInput = document.getElementById("name");
const btn = document.getElementById("submit");
const report = document.getElementById("report");
const BREAK_MS = 3000; // 3 seconds = one break
const pageStart = performance.now();

//where the mouse went
const mouse = { path: [], distance: 0, clicks: 0 };
let lastMouse = null;
let lastSample = 0;

document.addEventListener("mousemove", (e) => {
  if (lastMouse) mouse.distance += Math.hypot(e.clientX - lastMouse.x, e.clientY - lastMouse.y);
  lastMouse = { x: e.clientX, y: e.clientY };

  const now = performance.now();
  if (now - lastSample > 100) {
    // position as 0..1 of the window, so it works on any screen size
    mouse.path.push([
      +(e.clientX / innerWidth).toFixed(3),
      +(e.clientY / innerHeight).toFixed(3),
      Math.round(now - pageStart),
    ]);
    lastSample = now;
  }
});
document.addEventListener("click", () => mouse.clicks++);

//typing time
let start = null;
let last = null;
let keystrokes = 0;
let buffer = "";
let bufferPause = 0;
let words = []; //each word + how long paused before starting it
//deleted text
let deletedRuns = [];
let deleting = false;
let deletions = 0;

//breaks
let breaks = [];
let leftPage = false;
let pendingBreak = null; //a pending break, next word hasnt been typed yet

window.addEventListener("blur", () => (leftPage = true));
document.addEventListener("visibilitychange", () => {
  if (document.hidden) leftPage = true;
});

ta.addEventListener("keydown", (e) => {
  const now = performance.now();
  if (start === null) start = now;
  const gap = last === null ? 0 : now - last;

  if (gap >= BREAK_MS) {
  
    const typedSoFar = ta.value.slice(0, ta.selectionStart).trim().split(/\s+/);
    const midWord = buffer !== "";
    pendingBreak = {
      after: typedSoFar[typedSoFar.length - (midWord ? 2 : 1)] || "",
      wordStarted: midWord, 
      before: "",
      length: +(gap / 1000).toFixed(1),
      type: leftPage ? "left the page" : "paused",
    };
    breaks.push(pendingBreak);
  }
  leftPage = false;
  last = now;
  keystrokes++;

  if (e.key === "Backspace") {
    deletions++;
    // what is about to be erased: the selection, or the one character before the cursor
    const s = ta.selectionStart;
    const end = ta.selectionEnd;
    const chunk = s !== end ? ta.value.slice(s, end) : ta.value.slice(Math.max(0, s - 1), s);
    //consecutive backspaces build up one deleted run "t", "at", "hat" -> "hat"
    if (deleting) deletedRuns[deletedRuns.length - 1] = chunk + deletedRuns[deletedRuns.length - 1];
    else deletedRuns.push(chunk);
    deleting = true;
    buffer = buffer.slice(0, -1);
    return;
  }
  deleting = false;

  if (e.key === " " || e.key === "Enter") {
    if (buffer) words.push({ word: buffer, pause: bufferPause });
    finishBreak();
    buffer = "";
    return;
  }
  if (e.key.length === 1) {
    if (!buffer) bufferPause = gap;
    if (pendingBreak) pendingBreak.wordStarted = true;
    buffer += e.key;
  }
});



// save once the word after a break is complete
function finishBreak() {
  if (!pendingBreak || !pendingBreak.wordStarted) return;
  delete pendingBreak.wordStarted;
  const typedSoFar = ta.value.slice(0, ta.selectionStart).trim().split(/\s+/);
  pendingBreak.before = typedSoFar[typedSoFar.length - 1] || "";
  pendingBreak = null;
}
btn.addEventListener("click", async () => {
  if (buffer) words.push({ word: buffer, pause: bufferPause });
  finishBreak();
  if (pendingBreak) delete pendingBreak.wordStarted; // break doesnt count if at the end
  buffer = "";
  const duration = start !== null ? last - start : 0;
  const breakTime = breaks.reduce((s, b) => s + b.length * 1000, 0);
  const active = duration - breakTime;
  const wordCount = ta.value.trim().split(/\s+/).filter(Boolean).length;

  const res = await fetch("/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: nameInput.value.trim(),
      text: ta.value,
      hour: new Date().getHours(),
      words,
      breaks,
      deleted: deletedRuns.map((d) => d.trim()).filter(Boolean),
      deletions,
      mouse: { ...mouse, distance: Math.round(mouse.distance) },
      typing: {
        duration: Math.round(duration),
        active: Math.round(active),
        keystrokes,
        characters: ta.value.length,
        words: wordCount,
        wpm: active > 0 ? Math.round(wordCount / (active / 60000)) : 0,
      },
    }),
  });

  showReport(await res.json());
});

function showReport(d) {
  renderReport(d, report);
  // name above report
  const h = document.createElement("h2");
  h.textContent = entryName(d);
  report.prepend(h);
  report.hidden = false;
}
