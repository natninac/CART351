
const list = document.getElementById("entries");

fetch("/entries")
  .then((res) => res.json())
  .then((entries) => {
    const full = entries.filter((e) => e.typing.words > 0);
    for (const e of full) {
      const section = document.createElement("section");
      section.className = "entry";
      const h = document.createElement("h2");
      h.textContent = `${entryName(e)} · ${new Date(e.time * 1000).toLocaleString()}`;
      const body = document.createElement("div");
      renderReport(e, body);
      section.append(h, body);
      list.appendChild(section);
    }
  });
