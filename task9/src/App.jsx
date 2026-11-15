import { useState } from 'react'
import TodoForm from './components/TodoForm.jsx'
import Filters from './components/Filters.jsx'
import Stats from './components/Stats.jsx'
import TodoList from './components/TodoList.jsx'
import SortSelect from './components/SortSelect.jsx'

let nextId = 1

function App() {
  const [todos, setTodos] = useState([])
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('new-first')

  function addTodo(text, completed) {
    const newTodo = { id: nextId++, text, completed, createdAt: Date.now() }
    setTodos((prev) => [...prev, newTodo])
  }

  function toggleTodo(id) {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  function deleteTodo(id) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const sortedTodos = [...filteredTodos].sort((a, b) => {
    switch (sortBy) {
      case 'old-first':
        return a.createdAt - b.createdAt
      case 'alpha-asc':
        return a.text.localeCompare(b.text, 'ru')
      case 'alpha-desc':
        return b.text.localeCompare(a.text, 'ru')
      case 'new-first':
      default:
        return b.createdAt - a.createdAt
    }
  })

  const total = todos.length
  const completedCount = todos.filter((t) => t.completed).length
  const activeCount = total - completedCount

  return (
    <main>
      <h1>Todo-list</h1>
      <TodoForm onAdd={addTodo} />
      <Stats total={total} active={activeCount} completed={completedCount} />
      <Filters value={filter} onChange={setFilter} />
      <SortSelect value={sortBy} onChange={setSortBy} />
      <TodoList
        todos={sortedTodos}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
      />
    </main>
  )
}

export default App