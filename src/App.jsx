import { useState } from 'react'

export default function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Read a book', done: false, dueDate: '', priority: 'medium' },
    { id: 2, text: 'Go for a walk', done: true, dueDate: '', priority: 'low' },
    { id: 3, text: 'Write some code', done: false, dueDate: '', priority: 'high' },
  ])

  const [input, setInput] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState('medium')
  const [filter, setFilter] = useState('all')

  const addTodo = () => {
    const text = input.trim()
    if (!text) return

    setTodos([
      ...todos,
      {
        id: Date.now(),
        text,
        done: false,
        dueDate: dueDate || '',
        priority,
      },
    ])

    setInput('')
    setDueDate('')
    setPriority('medium')
  }

  const toggleTodo = (id) =>
    setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))

  const deleteTodo = (id) => setTodos(todos.filter((t) => t.id !== id))

  // Priority ranking (high → medium → low)
  const priorityRank = {
    high: 3,
    medium: 2,
    low: 1,
  }

  const visible = todos.filter((t) =>
    filter === 'active' ? !t.done : filter === 'completed' ? t.done : true,
  )

  // Sort: priority first, then due date
  const sorted = [...visible].sort((a, b) => {
    const priorityDiff =
      priorityRank[b.priority] - priorityRank[a.priority]
    if (priorityDiff !== 0) return priorityDiff

    if (!a.dueDate) return 1
    if (!b.dueDate) return -1

    return new Date(a.dueDate) - new Date(b.dueDate)
  })

  const remaining = todos.filter((t) => !t.done).length

  const tabClass = (name) =>
    `px-3 py-1 rounded-md text-sm font-medium transition ${
      filter === name
        ? 'bg-indigo-600 text-white'
        : 'text-slate-600 hover:bg-slate-200'
    }`

  return (
    <div className="min-h-screen bg-slate-100 flex items-start justify-center py-16 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Todo List</h1>

        {/* INPUTS */}
        <div className="flex flex-col gap-2 mb-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
            placeholder="What needs doing?"
            className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* PRIORITY */}
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-md"
          >
            <option value="high">High priority</option>
            <option value="medium">Normal priority</option>
            <option value="low">Low priority</option>
          </select>

          {/* DUE DATE */}
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-md"
          />

          <button
            onClick={addTodo}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition"
          >
            Add
          </button>
        </div>

        {/* FILTERS */}
        <div className="flex gap-2 mb-4">
          <button onClick={() => setFilter('all')} className={tabClass('all')}>
            All
          </button>
          <button onClick={() => setFilter('active')} className={tabClass('active')}>
            Active
          </button>
          <button onClick={() => setFilter('completed')} className={tabClass('completed')}>
            Completed
          </button>
        </div>

        {/* LIST */}
        <ul className="space-y-2">
          {sorted.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center gap-3 px-3 py-2 rounded-md border border-slate-200 hover:bg-slate-50"
            >
              <button
                onClick={() => toggleTodo(todo.id)}
                className={`flex-1 text-left ${
                  todo.done ? 'line-through text-slate-400' : 'text-slate-800'
                }`}
              >
                {todo.text}

                {/* PRIORITY BADGE */}
                <span
                  className={`ml-2 text-xs px-2 py-0.5 rounded-full font-medium ${
                    todo.priority === 'high'
                      ? 'bg-red-100 text-red-600'
                      : todo.priority === 'medium'
                      ? 'bg-slate-200 text-slate-700'
                      : 'bg-green-100 text-green-600'
                  }`}
                >
                  {todo.priority === 'high'
                    ? 'High'
                    : todo.priority === 'medium'
                    ? 'Normal'
                    : 'Low'}
                </span>

                {/* DUE DATE */}
                {todo.dueDate && (
                  <span className="ml-2 text-xs text-slate-500">
                    (due: {todo.dueDate})
                  </span>
                )}
              </button>

              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-slate-400 hover:text-red-500 text-lg font-bold px-2"
                aria-label="Delete todo"
              >
                ×
              </button>
            </li>
          ))}

          {sorted.length === 0 && (
            <li className="text-center text-slate-400 py-4 text-sm">
              Nothing here.
            </li>
          )}
        </ul>

        {/* FOOTER */}
        <div className="mt-4 text-sm text-slate-500">
          {remaining} {remaining === 1 ? 'item' : 'items'} left
        </div>
      </div>
    </div>
  )
}