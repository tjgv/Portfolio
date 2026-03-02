import { useCallback } from 'react'
import { Zap, Send, Sparkles, GitBranch } from 'lucide-react'
import type { NodePaletteItem, NodeTypeId } from './types'

const PALETTE_ITEMS: NodePaletteItem[] = [
  {
    type: 'trigger',
    label: 'Trigger',
    description: 'Start workflow on webhook, schedule, or event',
  },
  {
    type: 'action',
    label: 'Action',
    description: 'HTTP, email, database, or transform',
  },
  {
    type: 'ai-operation',
    label: 'AI Operation',
    description: 'Summarize, extract, classify, generate',
  },
  {
    type: 'condition',
    label: 'Condition',
    description: 'Branch workflow based on logic',
  },
]

const ICONS: Record<NodeTypeId, typeof Zap> = {
  trigger: Zap,
  action: Send,
  'ai-operation': Sparkles,
  condition: GitBranch,
}

interface NodePaletteProps {
  onAddNode: (type: NodeTypeId) => void
  disabled?: boolean
}

export function NodePalette({ onAddNode, disabled = false }: NodePaletteProps) {
  const handleDragStart = useCallback(
    (e: React.DragEvent, type: NodeTypeId) => {
      if (disabled) return
      e.dataTransfer.setData('application/reactflow', type)
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/plain', type)
    },
    [disabled],
  )

  const handleClick = useCallback(
    (type: NodeTypeId) => {
      if (disabled) return
      onAddNode(type)
    },
    [onAddNode, disabled],
  )

  return (
    <div
      className="wb-palette"
      role="toolbar"
      aria-label="Add workflow nodes"
    >
      <h3 className="wb-palette-title">Add Node</h3>
      <ul className="wb-palette-list" role="list">
        {PALETTE_ITEMS.map((item) => {
          const Icon = ICONS[item.type]
          return (
            <li key={item.type} role="listitem">
              <button
                type="button"
                className="wb-palette-item"
                draggable={!disabled}
                onDragStart={(e) => handleDragStart(e, item.type)}
                onClick={() => handleClick(item.type)}
                disabled={disabled}
                aria-label={`Add ${item.label} node`}
                title={item.description}
              >
                <span className="wb-palette-icon" aria-hidden>
                  <Icon size={18} strokeWidth={2} />
                </span>
                <span className="wb-palette-label">{item.label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
