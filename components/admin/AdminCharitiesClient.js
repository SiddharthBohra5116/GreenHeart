// components/admin/AdminCharitiesClient.js
'use client'

import { useState } from 'react'

const CATEGORY_COLORS = {
  Environment: 'bg-[#9bf6b2] text-[#00210c]',
  Health:      'bg-blue-100 text-blue-800',
  Youth:       'bg-[#6bfe9c] text-[#00210c]',
  Community:   'bg-amber-100 text-amber-800',
  Sport:       'bg-[#dcedc8] text-[#33691e]',
  Education:   'bg-[#fff9c4] text-[#f57f17]',
}

const CATEGORIES = ['Environment', 'Health', 'Youth', 'Community', 'Sport', 'Education']

const EMPTY_FORM = {
  name: '', description: '', category: 'Environment', image_url: '', is_featured: false,
}

export default function AdminCharitiesClient({ initialCharities = [] }) {
  const [charities, setCharities] = useState(initialCharities)
  const [showForm,  setShowForm]  = useState(false)
  const [editing,   setEditing]   = useState(null) // charity id being edited
  const [error,     setError]     = useState('')
  const [success,   setSuccess]   = useState('')
  const [form,      setForm]      = useState(EMPTY_FORM)

  const fetchCharities = async () => {
    const res  = await fetch('/api/admin/charities')
    const data = await res.json()
    setCharities(data.charities || [])
  }

  const openAdd = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setError('')
    setSuccess('')
    setShowForm(true)
  }

  const openEdit = (c) => {
    setEditing(c.id)
    setForm({
      name:        c.name        || '',
      description: c.description || '',
      category:    c.category    || 'Environment',
      image_url:   c.image_url   || '',
      is_featured: c.is_featured || false,
    })
    setError('')
    setSuccess('')
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const url    = editing ? `/api/admin/charities?id=${editing}` : '/api/admin/charities'
    const method = editing ? 'PATCH' : 'POST'

    const res  = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(form),
    })
    const data = await res.json()

    if (res.ok) {
      setSuccess(editing ? 'Charity updated!' : 'Charity added successfully!')
      setShowForm(false)
      setEditing(null)
      setForm(EMPTY_FORM)
      fetchCharities()
    } else {
      setError(data.error || 'Something went wrong')
    }
  }

  const handleDelete = async (id) => {
    setError('')
    setSuccess('')
    const res  = await fetch(`/api/admin/charities?id=${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (res.ok) {
      setSuccess(data.message || 'Charity removed')
      fetchCharities()
    } else {
      setError(data.error || 'Could not delete')
    }
  }

  const handleToggleFeatured = async (c) => {
    setError('')
    const res = await fetch(`/api/admin/charities?id=${c.id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ ...c, is_featured: !c.is_featured }),
    })
    const data = await res.json()
    if (res.ok) {
      setSuccess(`${c.name} ${!c.is_featured ? 'featured' : 'unfeatured'}`)
      fetchCharities()
    } else {
      setError(data.error || 'Update failed')
    }
  }

  return (
    <div>
      <header className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight text-[#002e0b]
                         leading-none mb-2 font-headline">
            Charity Management
          </h2>
          <p className="text-[#424940] font-medium">
            Add, edit, feature or remove charity partners.
          </p>
        </div>
        <button
          onClick={showForm ? () => { setShowForm(false); setEditing(null) } : openAdd}
          className="px-6 py-3 rounded-full text-white font-semibold shadow-lg
                     hover:scale-105 transition-all flex items-center gap-2 text-sm"
          style={{ background: 'linear-gradient(135deg,#002e0b,#0b4619)' }}>
          <span className="material-symbols-outlined text-lg">
            {showForm ? 'close' : 'add_circle'}
          </span>
          {showForm ? 'Cancel' : 'Add Charity'}
        </button>
      </header>

      {/* ── Alerts ── */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700
                        px-6 py-4 rounded-[1.5rem] text-sm flex items-center gap-3">
          <span className="material-symbols-outlined text-lg">error</span>
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 bg-[#9bf6b2]/30 border border-[#006d37]/30 text-[#006d37]
                        px-6 py-4 rounded-[1.5rem] text-sm flex items-center gap-3">
          <span className="material-symbols-outlined text-lg">check_circle</span>
          {success}
        </div>
      )}

      {/* ── Add / Edit Form ── */}
      {showForm && (
        <form onSubmit={handleSubmit}
          className="bg-white rounded-[2rem] p-8 mb-8 shadow-sm
                     border border-[#006d37]/20">
          <h3 className="font-headline font-extrabold text-[#002e0b] text-2xl mb-6">
            {editing ? 'Edit Charity' : 'Add New Charity'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Name */}
            <div>
              <label className="text-xs font-bold text-[#424940] uppercase
                               tracking-wider block mb-2">
                Name *
              </label>
              <input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
                placeholder="e.g. Plant a Future"
                className="w-full bg-[#f2f4f3] border-none rounded-[1rem]
                           px-4 py-3 outline-none focus:ring-2
                           focus:ring-[#006d37] text-sm text-[#191c1c]
                           placeholder:text-[#72796f]"
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-xs font-bold text-[#424940] uppercase
                               tracking-wider block mb-2">
                Category *
              </label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full bg-[#f2f4f3] border-none rounded-[1rem]
                           px-4 py-3 outline-none focus:ring-2
                           focus:ring-[#006d37] text-sm text-[#191c1c]">
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="text-xs font-bold text-[#424940] uppercase
                             tracking-wider block mb-2">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={3}
              placeholder="Brief description of the charity's mission"
              className="w-full bg-[#f2f4f3] border-none rounded-[1rem]
                         px-4 py-3 outline-none focus:ring-2
                         focus:ring-[#006d37] text-sm text-[#191c1c]
                         placeholder:text-[#72796f] resize-none"
            />
          </div>

          {/* Image URL — PRD §11 "manage content and media" */}
          <div className="mb-4">
            <label className="text-xs font-bold text-[#424940] uppercase
                             tracking-wider block mb-2">
              Image URL
            </label>
            <input
              type="url"
              value={form.image_url}
              onChange={e => setForm({ ...form, image_url: e.target.value })}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full bg-[#f2f4f3] border-none rounded-[1rem]
                         px-4 py-3 outline-none focus:ring-2
                         focus:ring-[#006d37] text-sm text-[#191c1c]
                         placeholder:text-[#72796f]"
            />
            {form.image_url && (
              <div className="mt-2 h-24 w-40 rounded-[1rem] overflow-hidden
                              bg-[#f2f4f3]">
                <img
                  src={form.image_url}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              </div>
            )}
          </div>

          {/* Featured toggle */}
          <div className="mb-6 flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={e => setForm({ ...form, is_featured: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#c1c9bd] peer-focus:outline-none
                              peer-focus:ring-2 peer-focus:ring-[#006d37]
                              rounded-full peer peer-checked:after:translate-x-full
                              peer-checked:after:border-white
                              after:content-[''] after:absolute after:top-[2px]
                              after:left-[2px] after:bg-white after:border-gray-300
                              after:border after:rounded-full after:h-5 after:w-5
                              after:transition-all peer-checked:bg-[#006d37]" />
            </label>
            <span className="text-sm font-medium text-[#424940]">
              Feature this charity on homepage
            </span>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="px-8 py-3 rounded-full text-white font-bold text-sm
                         hover:scale-105 transition-all shadow-lg"
              style={{ background: 'linear-gradient(135deg,#002e0b,#0b4619)' }}>
              {editing ? 'Save Changes' : 'Add Charity'}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setEditing(null); setForm(EMPTY_FORM) }}
              className="px-8 py-3 rounded-full border border-red-200
                         text-red-500 font-bold text-sm hover:bg-red-50
                         transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* ── Charity Table ── */}
      <div className="bg-white rounded-[2rem] p-8 shadow-sm">
        {charities.length === 0 ? (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-5xl text-[#c1c9bd]
                             block mb-4">
              loyalty
            </span>
            <p className="font-headline font-bold text-[#002e0b] text-xl mb-2">
              No charities yet
            </p>
            <p className="text-[#424940] text-sm mb-6">
              Add your first charity partner above.
            </p>
            <button
              onClick={openAdd}
              className="px-6 py-3 rounded-full text-white font-bold text-sm
                         hover:scale-105 transition-all"
              style={{ background: 'linear-gradient(135deg,#002e0b,#0b4619)' }}>
              Add First Charity
            </button>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="text-[#424940] border-b border-[#eceeed] uppercase
                             text-[10px] tracking-widest font-bold">
                <th className="pb-4 px-4">Name</th>
                <th className="pb-4 px-4">Category</th>
                <th className="pb-4 px-4">Status</th>
                <th className="pb-4 px-4">Featured</th>
                <th className="pb-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eceeed]">
              {charities.map((c) => (
                <tr key={c.id}
                  className="hover:bg-[#f2f4f3]/50 transition-colors group">
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-3">
                      {c.image_url && (
                        <img
                          src={c.image_url}
                          alt={c.name}
                          className="w-10 h-10 rounded-[0.75rem] object-cover"
                          onError={(e) => { e.target.style.display = 'none' }}
                        />
                      )}
                      <div>
                        <p className="font-bold text-[#002e0b]">{c.name}</p>
                        {c.description && (
                          <p className="text-xs text-[#424940] mt-0.5 max-w-xs truncate">
                            {c.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold
                                     ${CATEGORY_COLORS[c.category]
                                       || 'bg-[#eceeed] text-[#424940]'}`}>
                      {c.category}
                    </span>
                  </td>
                  <td className="py-5 px-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1
                                     rounded-full text-xs font-bold ${
                      c.is_active
                        ? 'bg-[#9bf6b2] text-[#00210c]'
                        : 'bg-[#e1e3e2] text-[#424940]'
                    }`}>
                      <span className="material-symbols-outlined text-[10px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}>
                        {c.is_active ? 'check_circle' : 'cancel'}
                      </span>
                      {c.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-5 px-4">
                    <button
                      onClick={() => handleToggleFeatured(c)}
                      className={`text-xs font-bold px-3 py-1 rounded-full
                                  transition-colors ${
                        c.is_featured
                          ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                          : 'bg-[#f2f4f3] text-[#424940] hover:bg-amber-50 hover:text-amber-600'
                      }`}>
                      {c.is_featured ? '★ Featured' : '☆ Feature'}
                    </button>
                  </td>
                  <td className="py-5 px-4 text-right">
                    <div className="flex gap-2 justify-end
                                    opacity-0 group-hover:opacity-100
                                    transition-opacity">
                      <button
                        onClick={() => openEdit(c)}
                        className="text-xs text-[#006d37] hover:text-[#002e0b]
                                   border border-[#006d37]/30 px-3 py-1.5
                                   rounded-full hover:bg-[#006d37]/5
                                   transition-colors font-bold">
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="text-xs text-red-500 hover:text-red-700
                                   border border-red-200 px-3 py-1.5 rounded-full
                                   hover:bg-red-50 transition-colors font-bold">
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {charities.length > 0 && (
        <p className="text-center text-[#424940] text-xs mt-4">
          Showing {charities.length} charit{charities.length !== 1 ? 'ies' : 'y'}
        </p>
      )}
    </div>
  )
}