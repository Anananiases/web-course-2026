import { useState } from 'react'
import TodoForm from './components/TodoForm.jsx'
import Filters from './components/Filters.jsx'
import Stats from './components/Stats.jsx'
import TodoList from './components/TodoList.jsx'

let nextId = 1

function App() {
  const [todos, setTodos] = useState([])
  const [filter, setFilter] = useState('all')

  function addTodo(text, completed) {
    const newTodo = { id: nextId++, text, completed }
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

  const total = todos.length
  const completedCount = todos.filter((t) => t.completed).length
  const activeCount = total - completedCount

  return (
    <main>
      <h1>Todo-list</h1>
      <TodoForm onAdd={addTodo} />
      <Stats total={total} active={activeCount} completed={completedCount} />
      <Filters value={filter} onChange={setFilter} />
      <TodoList
        todos={filteredTodos}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
      />
    </main>
  )
}

export default App