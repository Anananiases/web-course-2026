function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li className={`todo-item${todo.completed ? ' completed' : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        aria-label={`Отметить задачу "${todo.text}"`}
      />
      <span className="todo-item__text">{todo.text}</span>
      <button
        type="button"
        className="todo-item__delete"
        onClick={() => onDelete(todo.id)}
      >
        Удалить
      </button>
    </li>
  )
}

export default TodoItem