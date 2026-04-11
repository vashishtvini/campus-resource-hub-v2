import { useState, useRef } from 'react'
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4001'

const TYPES = [
  { value: 'notes',      label: '📝 Notes',      desc: 'Lecture notes or study material' },
  { value: 'PYQ',        label: '📋 PYQ',         desc: 'Previous year question papers'   },
  { value: 'assignment', label: '📌 Assignment',  desc: 'Assignment or lab work'           },
]

export function UploadPage() {
  const [form, setForm] = useState({ title: '', subject: '', semester: '', type: 'notes' })
  const [file, setFile]           = useState(null)
  const [dragging, setDragging]   = useState(false)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const [success, setSuccess]     = useState(false)
  const inputRef = useRef()

  function setField(key, val) { setForm(f => ({ ...f, [key]: val })) }

  function handleFile(f) {
    if (!f) return
    if (f.size > 25 * 1024 * 1024) { setError('File must be under 25 MB'); return }
    setFile(f)
    setError('')
  }

  function onDrop(e) {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!file)             { setError('Please select a file'); return }
    if (!form.title)       { setError('Please enter a title'); return }
    if (!form.subject)     { setError('Please enter a subject'); return }
    if (!form.semester)    { setError('Please select a semester'); return }

    setLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('crh_token')
      const fd = new FormData()
      fd.append('file', file)
      fd.append('title', form.title)
      fd.append('subject', form.subject)
      fd.append('semester', form.semester)
      fd.append('type', form.type)

      const res = await fetch(`${API_BASE}/api/resources`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }))
        throw new Error(err.error || 'Upload failed')
      }

      setSuccess(true)
      setForm({ title: '', subject: '', semester: '', type: 'notes' })
      setFile(null)
      setTimeout(() => setSuccess(false), 6000)
    } catch (err) {
      setError(err.message || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page container-sm">
      <div style={{ marginBottom: 36 }}>
        <h1 className="section-title">Upload Resource</h1>
        <p className="section-subtitle">
          Share your notes, PYQs, or assignments with the campus community
        </p>
      </div>

      {/* Alerts */}
      {success && (
        <div className="alert alert-success animate-fadeInUp" style={{ marginBottom: 22 }}>
          <CheckCircle size={16} />
          Resource uploaded successfully! Head to Browse to see it live.
        </div>
      )}
      {error && (
        <div className="alert alert-error animate-fadeInUp" style={{ marginBottom: 22 }}>
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="upload-form card">
        {/* Drop Zone */}
        <div
          id="drop-zone"
          className={`drop-zone ${dragging ? 'drag-active' : ''}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
          aria-label="Upload file area"
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.png,.jpg,.jpeg"
            style={{ display: 'none' }}
            onChange={e => handleFile(e.target.files[0])}
          />

          {file ? (
            <div className="file-preview">
              <div className="file-preview-icon">
                <File size={26} />
              </div>
              <div className="file-preview-info">
                <div className="file-name">{file.name}</div>
                <div className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
              </div>
              <button
                type="button"
                className="btn btn-icon btn-outline"
                onClick={e => { e.stopPropagation(); setFile(null) }}
                title="Remove file"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <>
              <div className="drop-zone-icon">
                <Upload size={28} />
              </div>
              <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: 8, fontSize: '1rem' }}>
                Drop your file here, or click to browse
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-faint)' }}>
                PDF, Word, PowerPoint, images — Max 25 MB
              </div>
            </>
          )}
        </div>

        {/* Form Fields */}
        <div className="upload-fields">
          {/* Title */}
          <div className="input-group">
            <label className="input-label" htmlFor="upload-title">Title *</label>
            <input
              id="upload-title"
              className="input"
              type="text"
              placeholder="e.g. Unit 3 – Operating Systems Notes"
              value={form.title}
              onChange={e => setField('title', e.target.value)}
              maxLength={200}
              required
            />
          </div>

          <div className="upload-grid">
            {/* Subject */}
            <div className="input-group">
              <label className="input-label" htmlFor="upload-subject">Subject *</label>
              <input
                id="upload-subject"
                className="input"
                type="text"
                placeholder="e.g. OS, DBMS, Maths"
                value={form.subject}
                onChange={e => setField('subject', e.target.value)}
                maxLength={80}
                required
              />
            </div>

            {/* Semester */}
            <div className="input-group">
              <label className="input-label" htmlFor="upload-semester">Semester *</label>
              <select
                id="upload-semester"
                className="select"
                value={form.semester}
                onChange={e => setField('semester', e.target.value)}
                required
              >
                <option value="">Select semester</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Type */}
          <div className="input-group">
            <label className="input-label">Resource Type *</label>
            <div className="type-selector">
              {TYPES.map(({ value, label, desc }) => (
                <label
                  key={value}
                  className={`type-option ${form.type === value ? 'selected' : ''}`}
                  htmlFor={`type-${value}`}
                >
                  <input
                    id={`type-${value}`}
                    type="radio"
                    name="type"
                    value={value}
                    checked={form.type === value}
                    onChange={() => setField('type', value)}
                    style={{ display: 'none' }}
                  />
                  <div className="type-option-label">{label}</div>
                  <div className="type-option-desc">{desc}</div>
                </label>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            id="btn-upload-submit"
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={loading || !file}
            style={{ width: '100%', marginTop: 4 }}
          >
            {loading ? (
              <><div className="spinner" />Uploading…</>
            ) : (
              <><Upload size={18} />Upload Resource</>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
