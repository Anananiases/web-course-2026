function Stats({ total, active, completed }) {
  return (
    <div className="stats">
      <span>Всего: <strong>{total}</strong></span>
      <span>Осталось: <strong>{active}</strong></span>
      <span>Выполнено: <strong>{completed}</strong></span>
    </div>
  )
}

export default Stats