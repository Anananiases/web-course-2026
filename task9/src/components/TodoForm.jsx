import { useState } from 'react'

function TodoForm({ onAdd }) {
  const [text, setText] = useState('')
  const [completed, setCompleted] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const trimmed = text.trim()

    if (trimmed.length === 0) {
      setError('Введите текст задачи')
      return
    }
    if (trimmed.length > 200) {
      setError('Текст задачи не должен превышать 200 символов')
      return
    }

    setError('')
    onAdd(trimmed, completed)
    setText('')
    setCompleted(false)
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        placeholder="Что нужно сделать?"
        onChange={(e) => setText(e.target.value)}
      />
      <select
        value={completed ? 'done' : 'active'}
        onChange={(e) => setCompleted(e.target.value === 'done')}
      >
        <option value="active">Не выполнена</option>
        <option value="done">Выполнена</option>
      </select>
      <button type="submit">Добавить</button>
      {error && <span className="form-error">{error}</span>}
    </form>
  )
}

export default TodoForm