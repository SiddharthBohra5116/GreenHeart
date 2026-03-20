'use client'

import { useState, useEffect } from 'react'

export default function AdminCharities() {
  const [charities, setCharities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showForm, setShowForm] = useState(false)

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: 'environment',
    image_url: ''
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
    <div className="p-8 space-y-10">

      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <p className="text-emerald-400 text-xs uppercase tracking-widest mb-2">
            Management
          </p>
          <h1 className="text-5xl font-extrabold tracking-tight">
            Charities
          </h1>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-br from-emerald-900 to-emerald-700 text-white
                     px-6 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition"
        >
          + Add Charity
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-400 px-6 py-3 rounded-xl">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500 text-emerald-400 px-6 py-3 rounded-xl">
          {success}
        </div>
      )}

      {/* Stats Bento */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-4 bg-white/5 backdrop-blur-xl p-6 rounded-2xl border">
          <p className="text-sm text-gray-400">Total Charities</p>
          <h2 className="text-4xl font-bold mt-2">{charities.length}</h2>
        </div>

        <div className="col-span-12 md:col-span-8 bg-white/5 backdrop-blur-xl p-6 rounded-2xl border">
          <h3 className="text-xl font-semibold mb-2">Impact</h3>
          <p className="text-gray-400">
            Manage and track all charity partners in one place.
          </p>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleAdd}
          className="bg-white/5 backdrop-blur-xl border p-6 rounded-2xl space-y-4">

          <h2 className="text-2xl font-semibold">Add Charity</h2>

          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="bg-black/30 border p-3 rounded-xl outline-none"
              required
            />

            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="bg-black/30 border p-3 rounded-xl"
            >
              <option value="environment">Environment</option>
              <option value="health">Health</option>
              <option value="youth">Youth</option>
              <option value="community">Community</option>
            </select>
          </div>

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full bg-black/30 border p-3 rounded-xl"
          />

          <div className="flex gap-4">
            <button className="bg-emerald-600 px-6 py-2 rounded-xl font-bold">
              Save
            </button>
            <button type="button"
              onClick={() => setShowForm(false)}
              className="border px-6 py-2 rounded-xl">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden border">

        <table className="w-full text-sm">
          <thead className="bg-white/10 text-gray-400 text-xs uppercase">
            <tr>
              <th className="px-6 py-4 text-left">Charity</th>
              <th className="px-6 py-4 text-left">Category</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-center">Featured</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/10">
            {charities.map((c) => (
              <tr key={c.id} className="hover:bg-white/5 transition">

                {/* Name */}
                <td className="px-6 py-4 flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-700 rounded-full" />
                  <div>
                    <p className="font-semibold">{c.name}</p>
                  </div>
                </td>

                {/* Category */}
                <td className="px-6 py-4 capitalize text-emerald-400">
                  {c.category}
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 text-xs rounded-full font-bold ${
                    c.is_active
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {c.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>

                {/* Featured */}
                <td className="px-6 py-4 text-center text-yellow-400">
                  {c.is_featured ? '★' : '—'}
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>

        {loading && (
          <div className="text-center py-10 text-gray-400">Loading...</div>
        )}

        {!loading && charities.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            No charities found
          </div>
        )}
      </div>
    </div>
  )
}