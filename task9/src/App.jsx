import { useCallback, useEffect, useMemo, useState } from 'react'
import TodoForm from './components/TodoForm.jsx'
import Filters from './components/Filters.jsx'
import Stats from './components/Stats.jsx'
import TodoList from './components/TodoList.jsx'
import SortSelect from './components/SortSelect.jsx'

const STORAGE_KEY = 'todo-react-items'

function loadTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function App() {
  const [todos, setTodos] = useState(loadTodos)
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('new-first')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  const addTodo = useCallback((text, completed) => {
    setTodos((prev) => {
      const maxId = prev.reduce((max, t) => Math.max(max, t.id), 0)
      const newTodo = {
        id: maxId + 1,
        text,
        completed,
        createdAt: Date.now(),
      }
      return [...prev, newTodo]
    })
  }, [])

  const toggleTodo = useCallback((id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }, [])

  const deleteTodo = useCallback((id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }, [])

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      if (filter === 'active') return !todo.completed
      if (filter === 'completed') return todo.completed
      return true
    })
  }, [todos, filter])

  const sortedTodos = useMemo(() => {
    return [...filteredTodos].sort((a, b) => {
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
  }, [filteredTodos, sortBy])

  const stats = useMemo(() => {
    const total = todos.length
    const completed = todos.filter((t) => t.completed).length
    return { total, completed, active: total - completed }
  }, [todos])

  return (
    <main>
      <h1>Todo-list</h1>
      <TodoForm onAdd={addTodo} />
      <Stats
        total={stats.total}
        active={stats.active}
        completed={stats.completed}
      />
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