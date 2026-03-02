import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { Sparkles } from 'lucide-react'

function AIOperationNode({
  data,
  selected,
}: NodeProps) {
  const d = data as { label?: string; kind?: string; status?: string; errorMessage?: string }
  const status = d.status ?? 'idle'

  return (
    <div
      className={`wb-node wb-node-ai ${selected ? 'wb-node-selected' : ''}`}
      data-status={status}
      role="article"
      aria-label={`AI Operation: ${d.label ?? ''}`}
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
        <span className="wb-node-icon wb-node-icon-ai" aria-hidden>
          <Sparkles size={16} strokeWidth={2} />
        </span>
        <span className="wb-node-type">AI Operation</span>
      </div>
      <div className="wb-node-body">
        <span className="wb-node-label">
          {d.label || 'Untitled AI Operation'}
        </span>
        <span className="wb-node-subtitle">{d.kind ?? ''}</span>
        {d.errorMessage && (
          <span className="wb-node-error" role="alert">
            {d.errorMessage}
          </span>
        )}
      </div>
      {status === 'running' && (
        <div className="wb-node-status-badge wb-node-status-running" aria-hidden>
          <span className="wb-node-status-dot" />
          Processing
        </div>
      )}
    </div>
  )
}

export default memo(AIOperationNode)
