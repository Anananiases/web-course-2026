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