'use client'

import { useState } from 'react'

const CATEGORY_COLORS = {
  environment: 'bg-[#9bf6b2] text-[#00210c]',
  health:      'bg-blue-100 text-blue-800',
  youth:       'bg-[#6bfe9c] text-[#00210c]',
  community:   'bg-amber-100 text-amber-800',
}

export default function AdminCharitiesClient({ initialCharities = [] }) {
  const [charities, setCharities] = useState(initialCharities)
  const [showForm,  setShowForm]  = useState(false)
  const [error,     setError]     = useState('')
  const [success,   setSuccess]   = useState('')
  const [form, setForm] = useState({
    name: '', description: '', category: 'environment', image_url: ''
  })

  const fetchCharities = async () => {
    const res  = await fetch('/api/admin/charities')
    const data = await res.json()
    setCharities(data.charities || [])
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    setError('')
    const res  = await fetch('/api/admin/charities', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(form),
    })
    const data = await res.json()
    if (res.ok) {
      setSuccess('Charity added successfully!')
      setShowForm(false)
      setForm({ name: '', description: '', category: 'environment', image_url: '' })
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
      setSuccess(data.message || 'Charity deactivated')
      fetchCharities()
    } else {
      setError(data.error || 'Could not delete')
    }
  }

  return (
    <div>
      <header className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight text-[#002e0b] leading-none mb-2 font-headline">
            Charity Management
          </h2>
          <p className="text-[#424940] font-medium">
            Add, edit or remove charity partners.
          </p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setError(''); setSuccess('') }}
          className="px-6 py-3 rounded-full text-white font-semibold shadow-lg hover:scale-105 transition-all flex items-center gap-2 text-sm"
          style={{ background: 'linear-gradient(135deg,#002e0b,#0b4619)' }}>
          <span className="material-symbols-outlined text-lg">add_circle</span>
          {showForm ? 'Cancel' : 'Add Charity'}
        </button>
      </header>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-[1.5rem] text-sm flex items-center gap-3">
          <span className="material-symbols-outlined text-lg">error</span>
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 bg-[#9bf6b2]/30 border border-[#006d37]/30 text-[#006d37] px-6 py-4 rounded-[1.5rem] text-sm flex items-center gap-3">
          <span className="material-symbols-outlined text-lg">check_circle</span>
          {success}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleAdd} className="bg-white rounded-[2rem] p-8 mb-8 shadow-sm border border-[#006d37]/20">
          <h3 className="font-headline font-extrabold text-[#002e0b] text-2xl mb-6">Add New Charity</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-bold text-[#424940] uppercase tracking-wider block mb-2">Name *</label>
              <input
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                required
                placeholder="e.g. Plant a Future"
                className="w-full bg-[#f2f4f3] border-none rounded-[1rem] px-4 py-3 outline-none focus:ring-2 focus:ring-[#006d37] text-sm text-[#191c1c] placeholder:text-[#72796f]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#424940] uppercase tracking-wider block mb-2">Category *</label>
              <select
                value={form.category}
                onChange={e => setForm({...form, category: e.target.value})}
                className="w-full bg-[#f2f4f3] border-none rounded-[1rem] px-4 py-3 outline-none focus:ring-2 focus:ring-[#006d37] text-sm text-[#191c1c]"
              >
                <option value="environment">Environment</option>
                <option value="health">Health</option>
                <option value="youth">Youth</option>
                <option value="community">Community</option>
              </select>
            </div>
          </div>
          <div className="mb-6">
            <label className="text-xs font-bold text-[#424940] uppercase tracking-wider block mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
              rows={3}
              placeholder="Brief description of the charity's mission"
              className="w-full bg-[#f2f4f3] border-none rounded-[1rem] px-4 py-3 outline-none focus:ring-2 focus:ring-[#006d37] text-sm text-[#191c1c] placeholder:text-[#72796f] resize-none"
            />
          </div>
          <div className="flex gap-4">
            <button type="submit" className="px-8 py-3 rounded-full text-white font-bold text-sm hover:scale-105 transition-all shadow-lg" style={{ background: 'linear-gradient(135deg,#002e0b,#0b4619)' }}>
              Save Charity
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-8 py-3 rounded-full border border-red-200 text-red-500 font-bold text-sm hover:bg-red-50 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-[2rem] p-8 shadow-sm">
        {charities.length === 0 ? (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-5xl text-[#c1c9bd] block mb-4">loyalty</span>
            <p className="font-headline font-bold text-[#002e0b] text-xl mb-2">No charities yet</p>
            <p className="text-[#424940] text-sm mb-6">Add your first charity partner above.</p>
            <button onClick={() => setShowForm(true)} className="px-6 py-3 rounded-full text-white font-bold text-sm hover:scale-105 transition-all" style={{ background: 'linear-gradient(135deg,#002e0b,#0b4619)' }}>
              Add First Charity
            </button>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="text-[#424940] border-b border-[#eceeed] uppercase text-[10px] tracking-widest font-bold">
                <th className="pb-4 px-4">Name</th>
                <th className="pb-4 px-4">Category</th>
                <th className="pb-4 px-4">Status</th>
                <th className="pb-4 px-4">Featured</th>
                <th className="pb-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eceeed]">
              {charities.map((c) => (
                <tr key={c.id} className="hover:bg-[#f2f4f3]/50 transition-colors group">
                  <td className="py-5 px-4">
                    <p className="font-bold text-[#002e0b]">{c.name}</p>
                    {c.description && (
                      <p className="text-xs text-[#424940] mt-0.5 max-w-xs truncate">{c.description}</p>
                    )}
                  </td>
                  <td className="py-5 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${CATEGORY_COLORS[c.category] || 'bg-[#eceeed] text-[#424940]'}`}>
                      {c.category}
                    </span>
                  </td>
                  <td className="py-5 px-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${c.is_active ? 'bg-[#9bf6b2] text-[#00210c]' : 'bg-[#e1e3e2] text-[#424940]'}`}>
                      <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {c.is_active ? 'check_circle' : 'cancel'}
                      </span>
                      {c.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-5 px-4 text-sm text-[#424940]">
                    {c.is_featured ? (
                      <span className="inline-flex items-center gap-1 text-amber-600 font-bold text-xs">
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        Featured
                      </span>
                    ) : '—'}
                  </td>
                  <td className="py-5 px-4 text-right">
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="text-xs text-red-500 hover:text-red-700 border border-red-200 px-4 py-1.5 rounded-full hover:bg-red-50 transition-colors font-bold opacity-0 group-hover:opacity-100">
                      Remove
                    </button>
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