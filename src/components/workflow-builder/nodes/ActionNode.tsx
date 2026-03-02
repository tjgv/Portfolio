import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import {
  Send,
  Mail,
  MessageSquare,
  Database,
  GitBranch,
  type LucideIcon,
} from 'lucide-react'
import type { ActionKind } from '../types'

const ICONS: Record<ActionKind, LucideIcon> = {
  'http-request': Send,
  email: Mail,
  discord: MessageSquare,
  database: Database,
  transform: GitBranch,
}

function ActionNode({ data, selected }: NodeProps) {
  const d = data as { label?: string; kind?: ActionKind; status?: string; errorMessage?: string }
  const Icon = ICONS[d.kind ?? 'http-request'] ?? Send
  const status = d.status ?? 'idle'

  return (
    <div
      className={`wb-node wb-node-action ${selected ? 'wb-node-selected' : ''}`}
      data-status={status}
      role="article"
      aria-label={`Action: ${d.label ?? ''}`}
    >
      <Handle
        type="target"
        position={Position.Left}
        id="in"
        className="wb-handle wb-handle-target"
        aria-label="Connect to this node"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="out"
        className="wb-handle wb-handle-source"
        aria-label="Connect from this node"
      />
      <div className="wb-node-header">
        <span className="wb-node-icon wb-node-icon-action" aria-hidden>
          <Icon size={16} strokeWidth={2} />
        </span>
        <span className="wb-node-type">Action</span>
      </div>
      <div className="wb-node-body">
        <span className="wb-node-label">{d.label || 'Untitled Action'}</span>
        {d.errorMessage && (
          <span className="wb-node-error" role="alert">
            {d.errorMessage}
          </span>
        )}
      </div>
      {status === 'running' && (
        <div className="wb-node-status-badge wb-node-status-running" aria-hidden>
          <span className="wb-node-status-dot" />
          Running
        </div>
      )}
    </div>
  )
}

export default memo(ActionNode)
