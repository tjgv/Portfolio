import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import {
  Zap,
  Webhook,
  Clock,
  MousePointer,
  FileText,
  Mail,
} from 'lucide-react'
import type { TriggerKind } from '../types'

const ICONS: Record<TriggerKind, typeof Zap> = {
  webhook: Webhook,
  schedule: Clock,
  manual: MousePointer,
  event: Zap,
  'file-watch': FileText,
  'email-received': Mail,
}

function TriggerNode({ data, selected }: NodeProps) {
  const d = data as { label?: string; kind?: TriggerKind; status?: string; errorMessage?: string }
  const Icon = ICONS[d.kind ?? 'webhook'] ?? Zap
  const status = d.status ?? 'idle'

  return (
    <div
      className={`wb-node wb-node-trigger ${selected ? 'wb-node-selected' : ''}`}
      data-status={status}
      role="article"
      aria-label={`Trigger: ${d.label ?? ''}`}
    >
      <Handle
        type="source"
        position={Position.Right}
        id="out"
        className="wb-handle wb-handle-source"
        aria-label="Connect from this node"
      />
      <div className="wb-node-header">
        <span className="wb-node-icon wb-node-icon-trigger" aria-hidden>
          <Icon size={16} strokeWidth={2} />
        </span>
        <span className="wb-node-type">Trigger</span>
      </div>
      <div className="wb-node-body">
        <span className="wb-node-label">{d.label || 'Untitled Trigger'}</span>
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

export default memo(TriggerNode)
