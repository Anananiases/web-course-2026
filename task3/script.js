// 1. Состояние
let todos = [];          // { id, text, completed }
let nextId = 1;
let currentFilter = 'all'; // 'all' | 'active' | 'completed'

// 2. Ссылки на DOM
const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const counter = document.getElementById('counter');
const filters = document.getElementById('filters');

// 3. Рендер
function render() {
  // фильтруем массив по текущему фильтру
  const visible = todos.filter(todo => {
    if (currentFilter === 'active') return !todo.completed;
    if (currentFilter === 'completed') return todo.completed;
    return true;
  });

  // очищаем список
  list.innerHTML = '';

  // map — для построения DOM-элементов из массива
  visible.map(todo => {
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.dataset.id = todo.id;

    // чекбокс
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => toggleTodo(todo.id));

    // текст
    const span = document.createElement('span');
    span.className = 'text' + (todo.completed ? ' completed' : '');
    span.textContent = todo.text;

    // кнопка удаления
    const del = document.createElement('button');
    del.type = 'button';
    del.className = 'delete';
    del.textContent = 'Удалить';
    del.addEventListener('click', () => deleteTodo(todo.id));

    li.append(checkbox, span, del);
    list.append(li);
  });

  // счётчик
  const remaining = todos.filter(t => !t.completed).length;
  const done = todos.length - remaining;
  counter.textContent = `Осталось: ${remaining}, Выполнено: ${done}`;

  // подсветка активного фильтра
  [...filters.children].forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === currentFilter);
  });
}

// 4. Действия
function addTodo(text) {
  text = text.trim();
  if (!text) {
    alert('Введите текст задачи');
    return;
  }
  todos.push({ id: nextId++, text, completed: false });
  render();
}

function toggleTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (todo) todo.completed = !todo.completed;
  render();
}

function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  render();
}

// 5. Обработчики
form.addEventListener('submit', (e) => {
  e.preventDefault();          // отменяем перезагрузку
  addTodo(input.value);
  input.value = '';
  input.focus();
});

filters.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  currentFilter = btn.dataset.filter;
  render();
});

// 6. Первый рендер
render();