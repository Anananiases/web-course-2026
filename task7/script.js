const API_URL = "https://jsonplaceholder.typicode.com/posts";
const PAGE_SIZE = 10;
const TOTAL_POSTS = 100;

const state = {
  posts: [],
  page: 0,
  loading: false,
  hasMore: true,
  searchQuery: "",
};

const postsEl = document.getElementById("posts");
const loaderEl = document.getElementById("loader");
const endMessageEl = document.getElementById("end-message");
const errorMessageEl = document.getElementById("error-message");
const searchEl = document.getElementById("search");

async function loadNextPage() {
  if (state.loading || !state.hasMore) return;

  state.loading = true;
  showLoader(true);
  hideError();

  const start = state.page * PAGE_SIZE;

  try {
    const response = await fetch(
      `${API_URL}?_start=${start}&_limit=${PAGE_SIZE}`
    );

    if (!response.ok) {
      throw new Error(`Ошибка сервера: ${response.status}`);
    }

    const data = await response.json();

    if (data.length === 0) {
      state.hasMore = false;
    } else {
      state.posts.push(...data);
      state.page += 1;
      if (state.posts.length >= TOTAL_POSTS) {
        state.hasMore = false;
      }
    }

    render();
  } catch (err) {
    showError(`Не удалось загрузить посты: ${err.message}`);
  } finally {
    state.loading = false;
    showLoader(false);
  }
}

function showLoader(isVisible) {
  loaderEl.classList.toggle("hidden", !isVisible);
}

function showError(message) {
  errorMessageEl.textContent = message;
  errorMessageEl.classList.remove("hidden");
}

function hideError() {
  errorMessageEl.classList.add("hidden");
  errorMessageEl.textContent = "";
}

function render() {
  const filtered = filterPosts(state.posts, state.searchQuery);

  postsEl.innerHTML = filtered
    .map((post) => createPostCard(post))
    .join("");

  const finished = !state.hasMore && filtered.length > 0;
  endMessageEl.classList.toggle("hidden", !finished);
}

function createPostCard(post) {
  return `
    <article class="post-card">
      <span class="meta">Автор #${post.userId} · Пост #${post.id}</span>
      <h2>${escapeHtml(post.title)}</h2>
      <p>${escapeHtml(post.body)}</p>
    </article>
  `;
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}