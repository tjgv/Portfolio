import { useCallback, useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { WorkflowBuilder } from '../components/workflow-builder'
import type { Node, Edge } from '@xyflow/react'

const INITIAL_NODES: Node[] = [
  {
    id: 'trigger-1',
    type: 'trigger',
    position: { x: 100, y: 150 },
    data: { label: 'Webhook Trigger', kind: 'webhook' },
  },
  {
    id: 'action-1',
    type: 'action',
    position: { x: 380, y: 150 },
    data: { label: 'Process with AI', kind: 'http-request' },
  },
]
const INITIAL_EDGES: Edge[] = [
  { id: 'e-trigger-action', source: 'trigger-1', target: 'action-1' },
]

export default function WorkflowBuilderPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [gmailStatus, setGmailStatus] = useState<{ connected: boolean; email?: string }>({ connected: false })
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    fetch('/api/gmail/me')
      .then((r) => r.json())
      .then((data) => setGmailStatus({ connected: !!data.connected, email: data.email }))
      .catch(() => setGmailStatus({ connected: false }))
  }, [])

  useEffect(() => {
    const gmail = searchParams.get('gmail')
    if (gmail === 'connected' || gmail === 'error') {
      fetch('/api/gmail/me')
        .then((r) => r.json())
        .then((data) => setGmailStatus({ connected: !!data.connected, email: data.email }))
      setSearchParams({}, { replace: true })
    }
  }, [searchParams, setSearchParams])

  const handleChange = useCallback((nodes: Node[], edges: Edge[]) => {
    // In production: persist, validate, etc.
    console.log('Workflow changed:', { nodes: nodes.length, edges: edges.length })
  }, [])

  const handleRun = useCallback(async (nodes: Node[], edges: Edge[]) => {
    setErrorMessage(null)
    try {
      const res = await fetch('/api/run-workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setErrorMessage((data.error as string) || `Request failed: ${res.status}`)
        throw new Error((data.error as string) || res.statusText)
      }
    } catch (e) {
      setErrorMessage((prev) => prev || (e as Error)?.message || 'Workflow run failed')
      throw e
    }
  }, [])

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#000',
        color: '#fff',
        padding: '60px 24px 48px',
        fontFamily: "'Figtree', -apple-system, sans-serif",
      }}
    >
      <header style={{ maxWidth: 980, margin: '0 auto 32px' }}>
        <Link
          to="/"
          style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: 14,
            textDecoration: 'none',
            marginBottom: 16,
            display: 'inline-block',
          }}
        >
          ← Back
        </Link>
        <h1
          style={{
            fontSize: 'clamp(24px, 4vw, 36px)',
            fontWeight: 700,
            margin: '0 0 8px 0',
            letterSpacing: '-0.02em',
          }}
        >
          Workflow Builder
        </h1>
        <p
          style={{
            fontSize: 16,
            color: 'rgba(255,255,255,0.6)',
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          Build AI-powered workflows with drag-and-drop. Add nodes from the left
          panel, connect them, and configure each step.
        </p>
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          {gmailStatus.connected ? (
            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>
              Email linked: {gmailStatus.email}
            </span>
          ) : (
            <a
              href="/api/auth/gmail"
              style={{
                fontSize: 14,
                color: '#6366f1',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Connect Gmail
            </a>
          )}
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ height: '70vh', minHeight: 500 }}>
          <WorkflowBuilder
            initialNodes={INITIAL_NODES}
            initialEdges={INITIAL_EDGES}
            onChange={handleChange}
            onRun={handleRun}
            errorMessage={errorMessage}
          />
        </div>

        <section
          style={{
            marginTop: 32,
            padding: 24,
            background: '#111',
            borderRadius: 12,
            border: '1px solid #27272a',
          }}
        >
          <h2
            style={{
              fontSize: 14,
              fontWeight: 600,
              margin: '0 0 12px 0',
              color: 'rgba(255,255,255,0.9)',
            }}
          >
            Interaction guide
          </h2>
          <ul
            style={{
              margin: 0,
              paddingLeft: 20,
              color: 'rgba(255,255,255,0.7)',
              fontSize: 14,
              lineHeight: 1.8,
            }}
          >
            <li>Drag nodes from the left palette onto the canvas</li>
            <li>Or click palette items to add nodes at random positions</li>
            <li>Connect nodes by dragging from output handles (right) to input
              handles (left)</li>
            <li>Click a node to open the configuration panel</li>
            <li>Use Delete/Backspace to remove selected nodes or edges</li>
            <li>Hold Shift and drag to multi-select</li>
            <li>Use the zoom controls or scroll to pan and zoom</li>
          </ul>
        </section>
      </main>
    </div>
  )
}
