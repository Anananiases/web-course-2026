const OPTIONS = [
  { value: 'new-first', label: 'Сначала новые' },
  { value: 'old-first', label: 'Сначала старые' },
  { value: 'alpha-asc', label: 'По алфавиту (А→Я)' },
  { value: 'alpha-desc', label: 'По алфавиту (Я→А)' },
]

function SortSelect({ value, onChange }) {
  return (
    <div className="sort">
      <label htmlFor="sort-select">Сортировка:</label>
      <select
        id="sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default SortSelect