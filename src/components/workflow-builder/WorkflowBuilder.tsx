import {
  useCallback,
  useRef,
  useState,
  useMemo,
  useEffect,
  type DragEvent,
} from 'react'
import {
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  useReactFlow,
  addEdge,
  Background,
  BackgroundVariant,
  Controls,
  Panel,
  ConnectionMode,
  type Node,
  type Edge,
  type Connection,
  type OnConnect,
} from '@xyflow/react'
import type { NodeTypes } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import TriggerNode from './nodes/TriggerNode'
import ActionNode from './nodes/ActionNode'
import AIOperationNode from './nodes/AIOperationNode'
import ConditionNode from './nodes/ConditionNode'
import { NodePalette } from './NodePalette'
import { NodeConfigPanel } from './NodeConfigPanel'
import type { NodeTypeId, WorkflowStatus } from './types'
import type {
  TriggerNodeData,
  ActionNodeData,
  AIOperationNodeData,
  ConditionNodeData,
} from './types'
import './WorkflowBuilder.css'

const NODE_TYPES = {
  trigger: TriggerNode,
  action: ActionNode,
  'ai-operation': AIOperationNode,
  condition: ConditionNode,
}

const DEFAULT_DATA: Record<
  NodeTypeId,
  TriggerNodeData | ActionNodeData | AIOperationNodeData | ConditionNodeData
> = {
  trigger: { label: 'Webhook Trigger', kind: 'webhook' },
  action: { label: 'Send HTTP Request', kind: 'http-request' },
  'ai-operation': { label: 'Summarize with AI', kind: 'summarize' },
  condition: {
    label: 'If / Else',
    leftOperand: 'status',
    operator: 'equals',
    rightOperand: 'active',
  },
}

export interface WorkflowBuilderProps {
  /** Initial nodes (optional) */
  initialNodes?: Node[]
  /** Initial edges (optional) */
  initialEdges?: Edge[]
  /** Called when workflow structure changes */
  onChange?: (nodes: Node[], edges: Edge[]) => void
  /** Called when user runs workflow; receives current nodes and edges */
  onRun?: (nodes: Node[], edges: Edge[]) => void | Promise<void>
  /** External status override (e.g. from parent) */
  status?: WorkflowStatus
  /** Error message to display */
  errorMessage?: string | null
  /** Disabled state (e.g. during run) */
  disabled?: boolean
  /** Class name for the root container */
  className?: string
}

function createNode(
  type: NodeTypeId,
  position: { x: number; y: number },
  id?: string,
): Node {
  const nodeId = id ?? `${type}-${Date.now()}`
  const data = DEFAULT_DATA[type]
  return {
    id: nodeId,
    type,
    position,
    data: { ...data },
  }
}

function WorkflowBuilderInner({
  initialNodes = [],
  initialEdges = [],
  onChange,
  onRun,
  status: externalStatus,
  errorMessage,
  disabled = false,
  className,
}: WorkflowBuilderProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [internalStatus, setInternalStatus] = useState<WorkflowStatus>('idle')
  const { screenToFlowPosition } = useReactFlow()

  const status = externalStatus ?? internalStatus
  const isBusy = status === 'loading'

  useEffect(() => {
    onChange?.(nodes, edges)
  }, [nodes, edges, onChange])

  const onConnect: OnConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge(params, eds))
    },
    [setEdges],
  )

  const onAddNode = useCallback(
    (type: NodeTypeId) => {
      const position = { x: 250 + Math.random() * 100, y: 100 + Math.random() * 100 }
      const newNode = createNode(type, position)
      setNodes((nds) => [...nds, newNode])
    },
    [setNodes],
  )

  const onDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      const type = e.dataTransfer.getData('application/reactflow') as
        | NodeTypeId
        | ''
      if (!type || !['trigger', 'action', 'ai-operation', 'condition'].includes(type)) return
      const position = screenToFlowPosition({
        x: e.clientX,
        y: e.clientY,
      })
      const newNode = createNode(type as NodeTypeId, position)
      setNodes((nds) => [...nds, newNode])
    },
    [screenToFlowPosition, setNodes],
  )

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
  }, [])

  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
  }, [])

  const onUpdateNode = useCallback(
    (nodeId: string, data: Record<string, unknown>) => {
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id !== nodeId) return n
          const nextData = { ...n.data, ...data } as Record<string, unknown>
          const existingConfig = (n.data as Record<string, unknown>).config
          if (
            data.config &&
            typeof data.config === 'object' &&
            !Array.isArray(data.config)
          ) {
            nextData.config = {
              ...(typeof existingConfig === 'object' && existingConfig && !Array.isArray(existingConfig)
                ? existingConfig
                : {}),
              ...data.config,
            }
          }
          return { ...n, data: nextData }
        }),
      )
      setSelectedNode((prev) =>
        prev?.id === nodeId ? { ...prev, data: { ...prev.data, ...data } } : prev,
      )
    },
    [setNodes],
  )

  const handleRun = useCallback(async () => {
    setInternalStatus('loading')
    try {
      await onRun?.(nodes, edges)
      setInternalStatus('success')
    } catch {
      setInternalStatus('error')
    } finally {
      setTimeout(() => setInternalStatus('idle'), 2000)
    }
  }, [onRun, nodes, edges])

  const hasTestEventTrigger = useMemo(
    () =>
      nodes.some(
        (n) =>
          n?.type === 'trigger' &&
          n.data?.kind === 'event' &&
          (n.data?.config?.eventType ?? '') === 'test event',
      ),
    [nodes],
  )

  const edgesWithBranchColors = useMemo(() => {
    return edges.map((edge) => {
      const src = nodes.find((n) => n.id === edge.source)
      if (src?.type === 'condition') {
        if (edge.sourceHandle === 'true') {
          return { ...edge, className: [edge.className, 'wb-edge-true'].filter(Boolean).join(' ') }
        }
        if (edge.sourceHandle === 'false') {
          return { ...edge, className: [edge.className, 'wb-edge-false'].filter(Boolean).join(' ') }
        }
      }
      return edge
    })
  }, [edges, nodes])

  const liveRegion = useMemo(
    () => (
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="visuallyhidden"
      >
        {status === 'loading' && 'Workflow is running...'}
        {status === 'success' && 'Workflow completed successfully.'}
        {status === 'error' && 'Workflow failed.'}
        {errorMessage && errorMessage}
      </div>
    ),
    [status, errorMessage],
  )

  return (
    <div
      ref={reactFlowWrapper}
      className={`wb-root ${className ?? ''}`}
      data-status={status}
      data-disabled={disabled || undefined}
    >
      <div className="wb-layout">
        <aside className="wb-sidebar">
          <NodePalette onAddNode={onAddNode} disabled={disabled || isBusy} />
          <div className="wb-palette-test-wrap">
            <button
              type="button"
              className="wb-test-event-btn"
              onClick={handleRun}
              disabled={disabled || isBusy || !hasTestEventTrigger}
              aria-busy={isBusy}
              aria-label="Trigger test event (runs workflow when an Event trigger is set to Test event)"
              title={hasTestEventTrigger ? 'Run workflow (test event)' : 'Add an Event trigger set to "Test event" to use this button'}
            >
              Test event
            </button>
          </div>
        </aside>

        <div
          className="wb-canvas-wrap"
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          <ReactFlow
            nodes={nodes}
            edges={edgesWithBranchColors}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={NODE_TYPES as NodeTypes}
            connectionMode={ConnectionMode.Loose}
            fitView
            deleteKeyCode={['Backspace', 'Delete']}
            multiSelectionKeyCode="Shift"
            panOnDrag={!disabled}
            nodesDraggable={!disabled}
            nodesConnectable={!disabled}
            elementsSelectable={!disabled}
            connectOnClick={false}
            className="wb-react-flow"
            aria-label="Workflow canvas - drag nodes from the left panel or add via buttons. Connect nodes by dragging from output handles to input handles."
          >
            <Background variant={BackgroundVariant.Dots} gap={16} size={1} className="wb-background" />
            <Controls className="wb-controls" showInteractive={false} />
            <Panel position="top-right" className="wb-panel-run">
              <button
                type="button"
                className="wb-run-btn"
                onClick={handleRun}
                disabled={disabled || isBusy}
                aria-busy={isBusy}
                aria-live="polite"
              >
                {isBusy ? 'Running…' : 'Run workflow'}
              </button>
            </Panel>
          </ReactFlow>
        </div>

        {selectedNode && (
          <NodeConfigPanel
            node={selectedNode}
            onUpdate={onUpdateNode}
            onClose={() => setSelectedNode(null)}
          />
        )}
      </div>

      {errorMessage && (
        <div className="wb-error-banner" role="alert">
          {errorMessage}
        </div>
      )}

      {liveRegion}
    </div>
  )
}

export function WorkflowBuilder(props: WorkflowBuilderProps) {
  return (
    <ReactFlowProvider>
      <WorkflowBuilderInner {...props} />
    </ReactFlowProvider>
  )
}

export default WorkflowBuilder
