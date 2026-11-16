// the writer's name; entries saved before names were added show as anonymous
function entryName(d) {
  return d.name || "anonymous";
}


function reportLines(d) {
  const t = d.typing;
  const lang = d.language;
  const types = lang.word_types
    .slice(0, 4)
    .map(([k, v]) => `${v} ${k.toLowerCase()}${v > 1 ? "s" : ""}`);

  const lines = [
    `wrote for ${Math.round(t.duration / 1000)}s (${Math.round(t.active / 1000)}s actively typing), at ${d.hour}:00.`,
    `${t.words} words, ${t.keystrokes} keystrokes, about ${t.wpm} words per minute.`,
    `mouse travelled ${d.mouse.distance}px and clicked ${d.mouse.clicks} times.`,
    `pressed backspace ${d.deletions} times.`,
    d.deleted.length ? `erased: ${d.deleted.map((x) => `"${x}"`).join(", ")}.` : "",
    d.breaks.length
      ? `took ${d.breaks.length} break(s): ` +
        d.breaks.map((b) => `${b.length}s ${breakPlace(b)} (${b.type})`).join(", ") + "."
      : "didn't take any breaks.",
    ...d.hesitations.map((h) => `hesitated ${(h.pause / 1000).toFixed(1)}s before "${h.word}".`),
    types.length ? `mostly: ${types.join(", ")}.` : "",
    lang.emotion_words.length
      ? "emotional words: " +
        lang.emotion_words.map((w) => `"${w.words}" (${w.polarity > 0 ? "+" : ""}${w.polarity})`).join(", ") + "."
      : "no strongly emotional words.",
    `overall this entry reads as ${lang.overall} (polarity ${lang.polarity}, subjectivity ${lang.subjectivity}).`,
  ].filter(Boolean);
  return lines;
}

// writes those sentences as <p> lines into a container element.
function renderReport(d, el) {
  el.replaceChildren();
  for (const line of reportLines(d)) {
    const p = document.createElement("p");
    p.textContent = line;
    el.appendChild(p);
  }
}

function breakPlace(b) {
  if (b.after === undefined) return `at ${b.at}s`; // entries saved before this change
  if (b.after && b.before) return `between "${b.after}" and "${b.before}"`;
  if (b.before) return `before "${b.before}"`;
  if (b.after) return `after "${b.after}"`;
  return "";
}
