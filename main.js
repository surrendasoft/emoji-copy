import { EMOJIS } from "./emojis.js";

const searchInput = document.getElementById("search-input");
const emojiGrid = document.getElementById("emoji-grid");
const emptyState = document.getElementById("empty-state");
const resultCount = document.getElementById("result-count");
const toast = document.getElementById("toast");

function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.hidden = true;
  }, 2000);
}

async function copyEmoji(emoji) {
  await navigator.clipboard.writeText(emoji);
  showToast(`${emoji} copied — paste away!`);
}

function matchesQuery(entry, query) {
  if (!query) return true;

  if (entry.emoji.includes(query)) return true;

  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const haystack = entry.keywords.join(" ");

  return terms.every((term) => haystack.includes(term));
}

function createTile(entry) {
  const tile = document.createElement("button");
  tile.type = "button";
  tile.className = "emoji-tile";
  tile.title = entry.keywords.slice(0, 3).join(", ");
  tile.innerHTML = `<span class="emoji">${entry.emoji}</span>`;

  tile.addEventListener("click", () => {
    copyEmoji(entry.emoji).catch(() => showToast("Copy failed — try again."));
  });

  return tile;
}

function renderGrid(query = "") {
  const trimmed = query.trim();
  const results = EMOJIS.filter((entry) => matchesQuery(entry, trimmed));

  emojiGrid.replaceChildren(...results.map(createTile));
  emptyState.hidden = results.length > 0;
  resultCount.textContent = trimmed
    ? `${results.length} result${results.length === 1 ? "" : "s"}`
    : `${EMOJIS.length} emojis`;
}

searchInput.addEventListener("input", (e) => {
  renderGrid(e.target.value);
});

renderGrid();
searchInput.focus();
