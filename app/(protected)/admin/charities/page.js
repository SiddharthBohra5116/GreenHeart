'use client'

import { useState, useEffect } from 'react'

export default function AdminCharities() {
  const [charities, setCharities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: '', description: '', category: 'environment', image_url: ''
  })

  const fetchCharities = async () => {
    const res = await fetch('/api/admin/charities')
    const data = await res.json()
    setCharities(data.charities || [])
    setLoading(false)
  }

  useEffect(() => { fetchCharities() }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    setError('')
    const res = await fetch('/api/admin/charities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (res.ok) {
      setSuccess('Charity added!')
      setShowForm(false)
      setForm({ name: '', description: '', category: 'environment', image_url: '' })
      fetchCharities()
    } else {
      setError(data.error)
    }
  }

  const handleDelete = async (id) => {
    setError('')
    const res = await fetch(`/api/admin/charities?id=${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (res.ok) {
      setSuccess('Charity removed')
      fetchCharities()
    } else {
      setError(data.error)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[#c9a84c] text-xs tracking-[3px] uppercase mb-2">Management</p>
          <h1 className="font-playfair text-5xl">Charities</h1>
          <div className="w-12 h-0.5 bg-[#c9a84c] mt-3"></div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#c9a84c] text-[#0a0f0a] px-6 py-3 font-bold tracking-widest
                     uppercase text-sm hover:bg-[#b8943d] transition-colors mt-4"
        >
          + Add Charity
        </button>
      </div>

      {error && (
        <div className="border border-red-900 bg-red-900/20 px-6 py-4 text-red-400 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="border border-emerald-900 bg-emerald-900/20 px-6 py-4
                        text-emerald-400 text-sm">
          {success}
        </div>
      )}

      {/* Add Form */}
      {showForm && (
        <form onSubmit={handleAdd} className="border border-[#c9a84c] p-8 space-y-4">
          <h2 className="font-playfair text-2xl mb-4">Add New Charity</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[#4a5a4e] uppercase tracking-wider block mb-2">
                Name
              </label>
              <input
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                required
                className="w-full bg-[#0f2d1a] border border-[#1a4a2e] text-[#f0ece0]
                           px-4 py-3 outline-none focus:border-[#c9a84c] transition-colors"
                placeholder="Charity name"
              />
            </div>
            <div>
              <label className="text-xs text-[#4a5a4e] uppercase tracking-wider block mb-2">
                Category
              </label>
              <select
                value={form.category}
                onChange={e => setForm({...form, category: e.target.value})}
                className="w-full bg-[#0f2d1a] border border-[#1a4a2e] text-[#f0ece0]
                           px-4 py-3 outline-none focus:border-[#c9a84c]"
              >
                <option value="environment">Environment</option>
                <option value="health">Health</option>
                <option value="youth">Youth</option>
                <option value="community">Community</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-[#4a5a4e] uppercase tracking-wider block mb-2">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
              rows={3}
              className="w-full bg-[#0f2d1a] border border-[#1a4a2e] text-[#f0ece0]
                         px-4 py-3 outline-none focus:border-[#c9a84c] transition-colors"
              placeholder="Brief description"
            />
          </div>
          <div className="flex gap-4">
            <button type="submit"
              className="bg-[#c9a84c] text-[#0a0f0a] px-8 py-3 font-bold
                         tracking-widest uppercase text-sm hover:bg-[#b8943d] transition-colors">
              Save Charity
            </button>
            <button type="button" onClick={() => setShowForm(false)}
              className="border border-[#1a4a2e] text-[#4a5a4e] px-8 py-3 text-sm
                         font-bold tracking-widest uppercase hover:border-red-900
                         hover:text-red-400 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Charities Table */}
      <div className="border border-[#1a4a2e] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1a4a2e] bg-[#0f2d1a]">
              {['Name', 'Category', 'Status', 'Featured', 'Actions'].map(h => (
                <th key={h}
                  className="text-left px-4 py-3 text-xs text-[#4a5a4e]
                             uppercase tracking-wider font-bold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a4a2e]">
            {charities.map(c => (
              <tr key={c.id} className="hover:bg-[#0f2d1a] transition-colors">
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3 text-[#7a9e7e] capitalize">{c.category}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-bold uppercase px-2 py-1 ${
                    c.is_active
                      ? 'bg-emerald-900/30 text-emerald-400'
                      : 'bg-red-900/30 text-red-400'
                  }`}>
                    {c.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 text-[#c9a84c]">
                  {c.is_featured ? '★ Featured' : '—'}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="text-xs text-red-400 hover:text-red-300 border border-red-900
                               px-3 py-1 hover:border-red-400 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && (
          <div className="text-center py-12 text-[#4a5a4e]">Loading...</div>
        )}
      </div>
    </div>
  )
}