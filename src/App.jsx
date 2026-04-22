import { useState } from 'react'

export default function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Read a book', done: false, priority: 'normal' },
    { id: 2, text: 'Go for a walk', done: true, priority: 'low' },
    { id: 3, text: 'Write some code', done: false, priority: 'high' },
  ])

  const [input, setInput] = useState('')
  const [priority, setPriority] = useState('normal')
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
        priority,
      },
    ])

    setInput('')
    setPriority('normal')
  }

  const toggleTodo = (id) =>
    setTodos(todos.map((t) =>
      t.id === id ? { ...t, done: !t.done } : t
    ))

  const deleteTodo = (id) =>
    setTodos(todos.filter((t) => t.id !== id))

  const changePriority = (id, newPriority) =>
    setTodos(todos.map((t) =>
      t.id === id ? { ...t, priority: newPriority } : t
    ))

  const visible = todos.filter((t) =>
    filter === 'active'
      ? !t.done
      : filter === 'completed'
      ? t.done
      : true
  )

  const remaining = todos.filter((t) => !t.done).length

  const tabClass = (name) =>
    `px-3 py-1 rounded-md text-sm font-medium transition ${
      filter === name
        ? 'bg-indigo-600 text-white'
        : 'text-slate-600 hover:bg-slate-200'
    }`

  const priorityColor = (p) => {
    if (p === 'high') return 'text-red-500 font-semibold'
    if (p === 'low') return 'text-green-500 font-medium'
    return 'text-slate-500'
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-start justify-center py-16 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Todo List</h1>

        {/* Input */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
            placeholder="What needs doing?"
            className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="px-2 py-2 border border-slate-300 rounded-md"
          >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
          </select>

          <button
            onClick={addTodo}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition"
          >
            Add
          </button>
        </div>

        {/* Filters */}
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

        {/* List */}
        <ul className="space-y-2">
          {visible.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center gap-3 px-3 py-2 rounded-md border border-slate-200 hover:bg-slate-50"
            >
              <button
                onClick={() => toggleTodo(todo.id)}
                className={`flex-1 text-left ${
                  todo.done
                    ? 'line-through text-slate-400'
                    : 'text-slate-800'
                }`}
              >
                {todo.text}
              </button>

              {/* Priority always visible + editable */}
              <select
                value={todo.priority}
                onChange={(e) =>
                  changePriority(todo.id, e.target.value)
                }
                className={`text-sm border rounded px-1 py-0.5 ${priorityColor(
                  todo.priority
                )}`}
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>

              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-slate-400 hover:text-red-500 text-lg font-bold px-2"
                aria-label="Delete todo"
              >
                ×
              </button>
            </li>
          ))}

          {visible.length === 0 && (
            <li className="text-center text-slate-400 py-4 text-sm">
              Nothing here.
            </li>
          )}
        </ul>

        <div className="mt-4 text-sm text-slate-500">
          {remaining} {remaining === 1 ? 'item' : 'items'} left
        </div>
      </div>
    </div>
  )
}