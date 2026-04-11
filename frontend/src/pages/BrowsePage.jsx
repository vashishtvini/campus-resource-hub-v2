import { useEffect, useMemo, useState } from 'react'
import { Search, Filter, SlidersHorizontal } from 'lucide-react'
import { apiFetch, apiJson } from '../lib/api'
import { isAuthed } from '../lib/auth'
import { ResourceCard } from '../components/ResourceCard'

const TYPE_TABS = [
  { value: '',           label: 'All'        },
  { value: 'notes',      label: '📝 Notes'   },
  { value: 'PYQ',        label: '📋 PYQ'     },
  { value: 'assignment', label: '📌 Assign'  },
]

const SEMESTERS = ['', '1', '2', '3', '4', '5', '6', '7', '8']

export function BrowsePage() {
  const [resources, setResources] = useState([])
  const [search, setSearch]       = useState('')
  const [activeType, setActiveType] = useState('')
  const [semester, setSemester]   = useState('')
  const [subject, setSubject]     = useState('')
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')

  const authed = useMemo(() => isAuthed(), [])

  async function loadResources(overrides = {}) {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams()
      const sub  = overrides.subject  !== undefined ? overrides.subject  : subject
      const type = overrides.type     !== undefined ? overrides.type     : activeType
      const sem  = overrides.semester !== undefined ? overrides.semester : semester

      if (sub)  params.set('subject', sub)
      if (type) params.set('type', type)
      if (sem)  params.set('semester', sem)

      const q = params.toString() ? `?${params}` : ''
      const data = await apiFetch(`/api/resources${q}`)
      setResources(data.resources || [])
    } catch (err) {
      setError(err.message || 'Failed to load resources')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadResources() }, [activeType, semester])

  async function handleSearch(e) {
    e.preventDefault()
    const q = search.trim()
    if (!q) { loadResources(); return }
    setLoading(true)
    setError('')
    try {
      const data = await apiFetch(`/api/resources/search?q=${encodeURIComponent(q)}`)
      setResources(data.resources || [])
    } catch (err) {
      setError(err.message || 'Search failed')
    } finally {
      setLoading(false)
    }
  }

  function handleTypeChange(val) {
    setActiveType(val)
    setSearch('')
  }

  function handleSemesterChange(val) {
    setSemester(val)
    setSearch('')
  }

  async function handleVote(id, direction) {
    try {
      const data = await apiJson(`/api/resources/${id}/vote`, {
        method: 'POST',
        body: { direction },
      })
      setResources(prev =>
        prev.map(r =>
          r._id === id
            ? { ...r, upvotes: data.resource.upvotes, downvotes: data.resource.downvotes }
            : r
        )
      )
    } catch (err) {
      setError(err.message || 'Vote failed')
    }
  }

  return (
    <div className="browse-page page">
      {/* Header */}
      <div className="browse-header">
        <div>
          <h1 className="section-title">Browse Resources</h1>
          <p className="section-subtitle">Find notes, past papers, and assignments from your peers</p>
        </div>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="browse-search" id="search-form">
        <div className="search-wrapper" style={{ flex: 1 }}>
          <Search size={17} className="search-icon" />
          <input
            id="search-input"
            className="search-input"
            type="text"
            placeholder="Search by title or subject… (e.g. DBMS, Maths)"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button id="btn-search" type="submit" className="btn btn-primary" disabled={loading}>
          Search
        </button>
        {search && (
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => { setSearch(''); loadResources() }}
          >
            Clear
          </button>
        )}
      </form>

      {/* Filters */}
      <div className="browse-filters card">
        {/* Type filter */}
        <div className="browse-filter-row">
          <div className="browse-filter-label">
            <Filter size={13} />
            Type
          </div>
          <div className="chip-group">
            {TYPE_TABS.map(({ value, label }) => (
              <button
                key={value || 'all'}
                id={`filter-type-${value || 'all'}`}
                className={`chip ${activeType === value ? 'active' : ''}`}
                onClick={() => handleTypeChange(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Semester filter */}
        <div className="browse-filter-row">
          <div className="browse-filter-label">
            <SlidersHorizontal size={13} />
            Semester
          </div>
          <div className="chip-group">
            {SEMESTERS.map(s => (
              <button
                key={s || 'all'}
                id={`filter-sem-${s || 'all'}`}
                className={`chip ${semester === s ? 'active' : ''}`}
                onClick={() => handleSemesterChange(s)}
              >
                {s ? `Sem ${s}` : 'All Sems'}
              </button>
            ))}
          </div>
        </div>

        {/* Subject filter */}
        <div className="browse-filter-row">
          <div className="browse-filter-label">Subject</div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flex: 1 }}>
            <input
              id="filter-subject"
              className="input"
              style={{ maxWidth: 260 }}
              placeholder="e.g. DBMS, OS, Physics…"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && loadResources({ subject })}
            />
            <button
              className="btn btn-outline btn-sm"
              onClick={() => loadResources({ subject })}
            >
              Apply
            </button>
            {subject && (
              <button
                className="btn btn-outline btn-sm"
                onClick={() => { setSubject(''); loadResources({ subject: '' }) }}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-error" style={{ marginBottom: 20 }}>
          ⚠️&nbsp;{error}
        </div>
      )}

      {/* Results count */}
      <div className="browse-results-header">
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="spinner" />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading…</span>
          </div>
        ) : (
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            <strong style={{ color: 'var(--text)' }}>{resources.length}</strong>
            {' '}resource{resources.length !== 1 ? 's' : ''} found
          </span>
        )}
      </div>

      {/* Grid */}
      {!loading && resources.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <div className="empty-state-title">No resources found</div>
          <p style={{ color: 'var(--text-faint)', fontSize: '0.875rem' }}>
            Try different filters or be the first to upload!
          </p>
        </div>
      ) : (
        <div className="resources-grid" id="resources-grid">
          {resources.map((resource, i) => (
            <div
              key={resource._id}
              className="animate-fadeInUp"
              style={{ animationDelay: `${Math.min(i * 0.04, 0.4)}s` }}
            >
              <ResourceCard
                resource={resource}
                authed={authed}
                onVote={handleVote}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
