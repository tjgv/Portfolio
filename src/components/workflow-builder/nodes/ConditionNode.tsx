import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { GitBranch } from 'lucide-react'
function ConditionNode({
  data,
  selected,
}: NodeProps) {
  const d = data as { label?: string; leftOperand?: string; operator?: string; rightOperand?: string; status?: string; errorMessage?: string }
  const status = d.status ?? 'idle'
  const hasCondition =
    d.leftOperand != null &&
    d.operator != null &&
    d.rightOperand != null

  return (
    <div
      className={`wb-node wb-node-condition ${selected ? 'wb-node-selected' : ''}`}
      data-status={status}
      role="article"
      aria-label={`Condition: ${d.label ?? ''}`}
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
        id="true"
        style={{ top: '35%' }}
        className="wb-handle wb-handle-source wb-handle-true"
        aria-label="True branch"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="false"
        style={{ top: '65%' }}
        className="wb-handle wb-handle-source wb-handle-false"
        aria-label="False branch"
      />
      <div className="wb-node-header">
        <span className="wb-node-icon wb-node-icon-condition" aria-hidden>
          <GitBranch size={16} strokeWidth={2} />
        </span>
        <span className="wb-node-type">Condition</span>
      </div>
      <div className="wb-node-body">
        <span className="wb-node-label">
          {d.label || 'Untitled Condition'}
        </span>
        {hasCondition && (
          <span className="wb-node-condition-expr">
            {d.leftOperand} {d.operator} {d.rightOperand}
          </span>
        )}
        {d.errorMessage && (
          <span className="wb-node-error" role="alert">
            {d.errorMessage}
          </span>
        )}
      </div>
    </div>
  )
}

export default memo(ConditionNode)
