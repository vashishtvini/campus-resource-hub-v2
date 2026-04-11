import { Download, Eye, ThumbsUp, ThumbsDown, FileText, BookOpen, ClipboardList } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4001'

const TYPE_CONFIG = {
  notes:      { label: 'Notes',       icon: <BookOpen size={11} />,      cls: 'badge-notes'      },
  PYQ:        { label: 'PYQ',         icon: <FileText size={11} />,       cls: 'badge-pyq'        },
  assignment: { label: 'Assignment',  icon: <ClipboardList size={11} />,  cls: 'badge-assignment' },
}

function formatSize(bytes) {
  if (!bytes) return ''
  if (bytes < 1024)         return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7)  return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return `${Math.floor(days / 30)}mo ago`
}

export function ResourceCard({ resource, authed, onVote }) {
  const cfg = TYPE_CONFIG[resource.type] || TYPE_CONFIG.notes

  return (
    <div className="resource-card card card-hover">
      {/* Top row — badge + size */}
      <div className="resource-card-header">
        <span className={`badge ${cfg.cls}`}>
          {cfg.icon}
          {cfg.label}
        </span>
        <span className="resource-size">{formatSize(resource.size)}</span>
      </div>

      {/* Title & meta */}
      <div className="resource-card-body">
        <h3 className="resource-title">{resource.title}</h3>
        <div className="resource-meta">
          <span className="resource-subject">{resource.subject}</span>
          <span className="resource-dot">·</span>
          <span>Sem {resource.semester}</span>
          <span className="resource-dot">·</span>
          <span>{timeAgo(resource.createdAt)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="resource-card-actions">
        {/* Votes */}
        <div className="vote-group">
          {authed ? (
            <>
              <button
                className="vote-btn up"
                onClick={() => onVote(resource._id, 'up')}
                title="Upvote"
              >
                <ThumbsUp size={13} />
                {resource.upvotes || 0}
              </button>
              <button
                className="vote-btn down"
                onClick={() => onVote(resource._id, 'down')}
                title="Downvote"
              >
                <ThumbsDown size={13} />
                {resource.downvotes || 0}
              </button>
            </>
          ) : (
            <span className="vote-hint">Sign in to vote</span>
          )}
        </div>

        {/* View / Download */}
        <div className="resource-links">
          <a
            href={`${API_BASE}/api/resources/${resource._id}/view`}
            className="btn btn-outline btn-sm"
            target="_blank"
            rel="noreferrer"
            title="View in browser"
          >
            <Eye size={13} />
            View
          </a>
          <a
            href={`${API_BASE}/api/resources/${resource._id}/download`}
            className="btn btn-secondary btn-sm"
            title="Download file"
          >
            <Download size={13} />
            Download
          </a>
        </div>
      </div>
    </div>
  )
}
