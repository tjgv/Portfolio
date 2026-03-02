import { useCallback, useState, useEffect } from 'react'
import type { Node } from '@xyflow/react'
import type {
  ConditionNodeData,
  NodeTypeId,
  TriggerKind,
  TriggerNodeData,
  ActionKind,
  ActionNodeData,
  AIOperationKind,
  AIOperationNodeData,
} from './types'

interface NodeConfigPanelProps {
  node: Node | null
  onUpdate: (nodeId: string, data: Record<string, unknown>) => void
  onClose: () => void
}

const TRIGGER_KINDS: { value: TriggerKind; label: string }[] = [
  { value: 'webhook', label: 'Webhook' },
  { value: 'schedule', label: 'Schedule' },
  { value: 'manual', label: 'Manual' },
  { value: 'event', label: 'Event' },
  { value: 'file-watch', label: 'File watch' },
  { value: 'email-received', label: 'New email received' },
]

const ACTION_KINDS: { value: ActionKind; label: string }[] = [
  { value: 'http-request', label: 'HTTP Request' },
  { value: 'email', label: 'Email' },
  { value: 'discord', label: 'Discord' },
  { value: 'database', label: 'Database' },
  { value: 'transform', label: 'Transform' },
]

const AI_OPERATION_KINDS: { value: AIOperationKind; label: string }[] = [
  { value: 'summarize', label: 'Summarize' },
  { value: 'extract', label: 'Extract' },
  { value: 'classify', label: 'Classify' },
  { value: 'generate', label: 'Generate' },
  { value: 'translate', label: 'Translate' },
]

export function NodeConfigPanel({
  node,
  onUpdate,
  onClose,
}: NodeConfigPanelProps) {
  const [localLabel, setLocalLabel] = useState<string>(
    String(node?.data?.label ?? ''),
  )
  // Condition
  const [localLeft, setLocalLeft] = useState(
    ((node?.data as unknown) as ConditionNodeData)?.leftOperand ?? '',
  )
  const [localOp, setLocalOp] = useState<
    ConditionNodeData['operator'] | undefined
  >(((node?.data as unknown) as ConditionNodeData)?.operator ?? 'equals')
  const [localRight, setLocalRight] = useState(
    ((node?.data as unknown) as ConditionNodeData)?.rightOperand ?? '',
  )
  // Trigger
  const [localTriggerKind, setLocalTriggerKind] = useState<TriggerKind>(
    ((node?.data as unknown) as TriggerNodeData)?.kind ?? 'webhook',
  )
  const [localWebhookPath, setLocalWebhookPath] = useState(
    ((node?.data as unknown) as TriggerNodeData)?.config?.webhookPath ?? '',
  )
  const [localSchedule, setLocalSchedule] = useState(
    ((node?.data as unknown) as TriggerNodeData)?.config?.schedule ?? '',
  )
  const [localEventType, setLocalEventType] = useState(
    ((node?.data as unknown) as TriggerNodeData)?.config?.eventType ?? '',
  )
  const [localMailboxFolder, setLocalMailboxFolder] = useState(
    ((node?.data as unknown) as TriggerNodeData)?.config?.mailboxFolder ?? '',
  )
  const [localFromFilter, setLocalFromFilter] = useState(
    ((node?.data as unknown) as TriggerNodeData)?.config?.fromFilter ?? '',
  )
  // Action
  const [localActionKind, setLocalActionKind] = useState<ActionKind>(
    ((node?.data as unknown) as ActionNodeData)?.kind ?? 'http-request',
  )
  const [localActionConfig, setLocalActionConfig] = useState<
    Record<string, string>
  >({})
  // AI operation
  const [localAIKind, setLocalAIKind] = useState<AIOperationKind>(
    ((node?.data as unknown) as AIOperationNodeData)?.kind ?? 'summarize',
  )
  const [localAIModel, setLocalAIModel] = useState(
    ((node?.data as unknown) as AIOperationNodeData)?.config?.model ?? '',
  )
  const [localAIPrompt, setLocalAIPrompt] = useState(
    ((node?.data as unknown) as AIOperationNodeData)?.config?.prompt ?? '',
  )
  const [localAIMaxTokens, setLocalAIMaxTokens] = useState(
    String(
      ((node?.data as unknown) as AIOperationNodeData)?.config?.maxTokens ??
        '',
    ),
  )

  useEffect(() => {
    if (!node) return
    const d = node.data as Record<string, unknown>
    setLocalLabel(String(d?.label ?? ''))
    const cond = d as unknown as ConditionNodeData
    setLocalLeft(cond.leftOperand ?? '')
    setLocalOp(cond.operator ?? 'equals')
    setLocalRight(cond.rightOperand ?? '')
    const trigger = d as unknown as TriggerNodeData
    setLocalTriggerKind(trigger.kind ?? 'webhook')
    setLocalWebhookPath(trigger.config?.webhookPath ?? '')
    setLocalSchedule(trigger.config?.schedule ?? '')
    setLocalEventType(trigger.config?.eventType ?? '')
    setLocalMailboxFolder(trigger.config?.mailboxFolder ?? '')
    setLocalFromFilter(trigger.config?.fromFilter ?? '')
    const action = d as unknown as ActionNodeData
    setLocalActionKind(action.kind ?? 'http-request')
    const actionCfg = (action.config ?? {}) as Record<string, unknown>
    setLocalActionConfig(
      Object.fromEntries(
        Object.entries(actionCfg).map(([k, v]) => [k, String(v ?? '')]),
      ),
    )
    const ai = d as unknown as AIOperationNodeData
    setLocalAIKind(ai.kind ?? 'summarize')
    setLocalAIModel(ai.config?.model ?? '')
    setLocalAIPrompt(ai.config?.prompt ?? '')
    setLocalAIMaxTokens(String(ai.config?.maxTokens ?? ''))
  }, [node?.id, node?.data])

  const setActionConfig = useCallback((key: string, value: string) => {
    setLocalActionConfig((prev) => ({ ...prev, [key]: value }))
  }, [])

  const handleSave = useCallback(() => {
    if (!node) return
    const type = node.type as NodeTypeId
    const updates: Record<string, unknown> = { label: localLabel }

    if (type === 'trigger') {
      updates.kind = localTriggerKind
      updates.config = {
        webhookPath: localWebhookPath || undefined,
        schedule: localSchedule || undefined,
        eventType: localEventType || undefined,
        mailboxFolder: localMailboxFolder || undefined,
        fromFilter: localFromFilter || undefined,
      }
    }

    if (type === 'action') {
      updates.kind = localActionKind
      const config: Record<string, unknown> = {}
      Object.entries(localActionConfig).forEach(([k, v]) => {
        if (v !== '') config[k] = v
      })
      updates.config = config
    }

    if (type === 'ai-operation') {
      updates.kind = localAIKind
      updates.config = {
        model: localAIModel || undefined,
        prompt: localAIPrompt || undefined,
        maxTokens: localAIMaxTokens ? Number(localAIMaxTokens) || undefined : undefined,
      }
    }

    if (type === 'condition') {
      updates.leftOperand = localLeft
      updates.operator = localOp
      updates.rightOperand = localRight
    }

    onUpdate(node.id, updates)
    onClose()
  }, [
    node,
    localLabel,
    localLeft,
    localOp,
    localRight,
    localTriggerKind,
    localWebhookPath,
    localSchedule,
    localEventType,
    localMailboxFolder,
    localFromFilter,
    localActionKind,
    localActionConfig,
    localAIKind,
    localAIModel,
    localAIPrompt,
    localAIMaxTokens,
    onUpdate,
    onClose,
  ])

  if (!node) return null

  const type = (node.type ?? 'default') as NodeTypeId
  const isTrigger = type === 'trigger'
  const isAction = type === 'action'
  const isAIOperation = type === 'ai-operation'
  const isCondition = type === 'condition'

  return (
    <aside
      className="wb-config-panel"
      role="region"
      aria-labelledby="wb-config-title"
    >
      <div className="wb-config-header">
        <h2 id="wb-config-title" className="wb-config-title">
          Configure Node
        </h2>
        <button
          type="button"
          className="wb-config-close"
          onClick={onClose}
          aria-label="Close configuration panel"
        >
          ×
        </button>
      </div>

      <div className="wb-config-body">
        <div className="wb-config-field">
          <label htmlFor="wb-config-label">Label</label>
          <input
            id="wb-config-label"
            type="text"
            className="wb-config-input"
            value={localLabel}
            onChange={(e) => setLocalLabel(e.target.value)}
            placeholder="Node label"
            aria-describedby="wb-config-label-desc"
          />
          <span id="wb-config-label-desc" className="wb-config-hint">
            Display name for this step
          </span>
        </div>

        {/* Trigger */}
        {isTrigger && (
          <>
            <div className="wb-config-field">
              <label htmlFor="wb-config-trigger-kind">Trigger type</label>
              <select
                id="wb-config-trigger-kind"
                className="wb-config-select"
                value={localTriggerKind}
                onChange={(e) =>
                  setLocalTriggerKind(e.target.value as TriggerKind)
                }
              >
                {TRIGGER_KINDS.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            {localTriggerKind === 'webhook' && (
              <div className="wb-config-field">
                <label htmlFor="wb-config-webhook-path">Webhook path</label>
                <input
                  id="wb-config-webhook-path"
                  type="text"
                  className="wb-config-input"
                  value={localWebhookPath}
                  onChange={(e) => setLocalWebhookPath(e.target.value)}
                  placeholder="/api/webhook"
                />
              </div>
            )}
            {localTriggerKind === 'schedule' && (
              <div className="wb-config-field">
                <label htmlFor="wb-config-schedule">Schedule (cron)</label>
                <input
                  id="wb-config-schedule"
                  type="text"
                  className="wb-config-input"
                  value={localSchedule}
                  onChange={(e) => setLocalSchedule(e.target.value)}
                  placeholder="0 9 * * *"
                />
                <span className="wb-config-hint">e.g. 0 9 * * * for 9am daily</span>
              </div>
            )}
            {localTriggerKind === 'event' && (
              <>
                <div className="wb-config-field">
                  <label htmlFor="wb-config-event-type">Event type</label>
                  <select
                    id="wb-config-event-type"
                    className="wb-config-select"
                    value={localEventType === 'test event' ? 'test event' : 'custom'}
                    onChange={(e) => {
                      const v = e.target.value
                      if (v === 'test event') setLocalEventType('test event')
                      else if (v === 'custom') setLocalEventType(localEventType === 'test event' ? '' : localEventType)
                    }}
                  >
                    <option value="test event">Test event</option>
                    <option value="custom">Custom</option>
                  </select>
                  <span className="wb-config-hint">
                    &quot;Test event&quot; is triggered by the red Test event button in the left panel
                  </span>
                </div>
                {localEventType !== 'test event' && (
                  <div className="wb-config-field">
                    <label htmlFor="wb-config-event-type-custom">Custom event name</label>
                    <input
                      id="wb-config-event-type-custom"
                      type="text"
                      className="wb-config-input"
                      value={localEventType}
                      onChange={(e) => setLocalEventType(e.target.value)}
                      placeholder="e.g. user.created"
                    />
                  </div>
                )}
              </>
            )}
            {localTriggerKind === 'email-received' && (
              <>
                <div className="wb-config-field">
                  <label htmlFor="wb-config-mailbox-folder">Mailbox / folder</label>
                  <input
                    id="wb-config-mailbox-folder"
                    type="text"
                    className="wb-config-input"
                    value={localMailboxFolder}
                    onChange={(e) => setLocalMailboxFolder(e.target.value)}
                    placeholder="INBOX"
                  />
                  <span className="wb-config-hint">e.g. INBOX or folder name</span>
                </div>
                <div className="wb-config-field">
                  <label htmlFor="wb-config-from-filter">From filter (optional)</label>
                  <input
                    id="wb-config-from-filter"
                    type="text"
                    className="wb-config-input"
                    value={localFromFilter}
                    onChange={(e) => setLocalFromFilter(e.target.value)}
                    placeholder="user@example.com"
                  />
                  <span className="wb-config-hint">Only trigger for emails from this address</span>
                </div>
              </>
            )}
          </>
        )}

        {/* Action */}
        {isAction && (
          <>
            <div className="wb-config-field">
              <label htmlFor="wb-config-action-kind">Action type</label>
              <select
                id="wb-config-action-kind"
                className="wb-config-select"
                value={localActionKind}
                onChange={(e) =>
                  setLocalActionKind(e.target.value as ActionKind)
                }
              >
                {ACTION_KINDS.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            {localActionKind === 'http-request' && (
              <>
                <div className="wb-config-field">
                  <label htmlFor="wb-action-url">URL</label>
                  <input
                    id="wb-action-url"
                    type="text"
                    className="wb-config-input"
                    value={localActionConfig.url ?? ''}
                    onChange={(e) => setActionConfig('url', e.target.value)}
                    placeholder="https://api.example.com"
                  />
                </div>
                <div className="wb-config-field">
                  <label htmlFor="wb-action-method">Method</label>
                  <select
                    id="wb-action-method"
                    className="wb-config-select"
                    value={localActionConfig.method ?? 'GET'}
                    onChange={(e) => setActionConfig('method', e.target.value)}
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="PATCH">PATCH</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                </div>
                <div className="wb-config-field">
                  <label htmlFor="wb-action-body">Body (JSON)</label>
                  <textarea
                    id="wb-action-body"
                    className="wb-config-input wb-config-textarea"
                    value={localActionConfig.body ?? ''}
                    onChange={(e) => setActionConfig('body', e.target.value)}
                    placeholder='{"key": "value"}'
                    rows={3}
                  />
                </div>
              </>
            )}
            {localActionKind === 'email' && (
              <>
                <div className="wb-config-field">
                  <label htmlFor="wb-action-to">To</label>
                  <input
                    id="wb-action-to"
                    type="text"
                    className="wb-config-input"
                    value={localActionConfig.to ?? ''}
                    onChange={(e) => setActionConfig('to', e.target.value)}
                    placeholder="user@example.com"
                  />
                </div>
                <div className="wb-config-field">
                  <label htmlFor="wb-action-subject">Subject</label>
                  <input
                    id="wb-action-subject"
                    type="text"
                    className="wb-config-input"
                    value={localActionConfig.subject ?? ''}
                    onChange={(e) => setActionConfig('subject', e.target.value)}
                    placeholder="Subject"
                  />
                </div>
                <div className="wb-config-field">
                  <label htmlFor="wb-action-email-body">Body</label>
                  <textarea
                    id="wb-action-email-body"
                    className="wb-config-input wb-config-textarea"
                    value={localActionConfig.body ?? ''}
                    onChange={(e) => setActionConfig('body', e.target.value)}
                    placeholder="Email content"
                    rows={3}
                  />
                </div>
              </>
            )}
            {localActionKind === 'discord' && (
              <>
                <div className="wb-config-field">
                  <label htmlFor="wb-action-channel">Channel ID</label>
                  <input
                    id="wb-action-channel"
                    type="text"
                    className="wb-config-input"
                    value={localActionConfig.channel ?? ''}
                    onChange={(e) => setActionConfig('channel', e.target.value)}
                    placeholder="1234567890123456789"
                  />
                  <span className="wb-config-hint">
                    Enable Developer Mode in Discord, then right‑click the channel → Copy channel ID
                  </span>
                </div>
                <div className="wb-config-field">
                  <label htmlFor="wb-action-message">Message</label>
                  <textarea
                    id="wb-action-message"
                    className="wb-config-input wb-config-textarea"
                    value={localActionConfig.message ?? ''}
                    onChange={(e) => setActionConfig('message', e.target.value)}
                    placeholder="Message text. Use {{email.from}}, {{email.subject}}, {{email.snippet}} if workflow has New email received trigger"
                    rows={3}
                  />
                  <span className="wb-config-hint">
                    With &quot;New email received&quot; trigger use: {'{{email.from}}'}, {'{{email.subject}}'}, {'{{email.snippet}}'}
                  </span>
                </div>
              </>
            )}
            {localActionKind === 'database' && (
              <div className="wb-config-field">
                <label htmlFor="wb-action-query">Query</label>
                <textarea
                  id="wb-action-query"
                  className="wb-config-input wb-config-textarea"
                  value={localActionConfig.query ?? ''}
                  onChange={(e) => setActionConfig('query', e.target.value)}
                  placeholder="SELECT * FROM ..."
                  rows={3}
                />
              </div>
            )}
            {localActionKind === 'transform' && (
              <div className="wb-config-field">
                <label htmlFor="wb-action-expression">Expression / mapping</label>
                <textarea
                  id="wb-action-expression"
                  className="wb-config-input wb-config-textarea"
                  value={localActionConfig.expression ?? ''}
                  onChange={(e) => setActionConfig('expression', e.target.value)}
                  placeholder="e.g. input.field or JSON path"
                  rows={3}
                />
              </div>
            )}
          </>
        )}

        {/* AI operation */}
        {isAIOperation && (
          <>
            <div className="wb-config-field">
              <label htmlFor="wb-config-ai-kind">AI operation</label>
              <select
                id="wb-config-ai-kind"
                className="wb-config-select"
                value={localAIKind}
                onChange={(e) =>
                  setLocalAIKind(e.target.value as AIOperationKind)
                }
              >
                {AI_OPERATION_KINDS.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="wb-config-field">
              <label htmlFor="wb-config-ai-model">Model</label>
              <input
                id="wb-config-ai-model"
                type="text"
                className="wb-config-input"
                value={localAIModel}
                onChange={(e) => setLocalAIModel(e.target.value)}
                placeholder="gpt-4o"
              />
            </div>
            <div className="wb-config-field">
              <label htmlFor="wb-config-ai-prompt">Prompt</label>
              <textarea
                id="wb-config-ai-prompt"
                className="wb-config-input wb-config-textarea"
                value={localAIPrompt}
                onChange={(e) => setLocalAIPrompt(e.target.value)}
                placeholder="Instructions for the AI"
                rows={4}
              />
            </div>
            <div className="wb-config-field">
              <label htmlFor="wb-config-ai-max-tokens">Max tokens</label>
              <input
                id="wb-config-ai-max-tokens"
                type="number"
                min={1}
                className="wb-config-input"
                value={localAIMaxTokens}
                onChange={(e) => setLocalAIMaxTokens(e.target.value)}
                placeholder="1024"
              />
            </div>
          </>
        )}

        {/* Condition */}
        {isCondition && (
          <>
            <div className="wb-config-field">
              <label htmlFor="wb-config-left">Left operand</label>
              <input
                id="wb-config-left"
                type="text"
                className="wb-config-input"
                value={localLeft}
                onChange={(e) => setLocalLeft(e.target.value)}
                placeholder="e.g. status"
              />
            </div>
            <div className="wb-config-field">
              <label htmlFor="wb-config-op">Operator</label>
              <select
                id="wb-config-op"
                className="wb-config-select"
                value={(localOp ?? 'equals') as string}
                onChange={(e) =>
                  setLocalOp(
                    e.target.value as ConditionNodeData['operator'],
                  )
                }
              >
                <option value="equals">Equals</option>
                <option value="contains">Contains</option>
                <option value="gt">Greater than</option>
                <option value="lt">Less than</option>
                <option value="exists">Exists</option>
              </select>
            </div>
            <div className="wb-config-field">
              <label htmlFor="wb-config-right">Right operand</label>
              <input
                id="wb-config-right"
                type="text"
                className="wb-config-input"
                value={localRight}
                onChange={(e) => setLocalRight(e.target.value)}
                placeholder="e.g. active"
              />
            </div>
          </>
        )}

        <div className="wb-config-type-badge" aria-hidden>
          Type: {type}
        </div>
      </div>

      <div className="wb-config-footer">
        <button
          type="button"
          className="wb-config-btn wb-config-btn-primary"
          onClick={handleSave}
        >
          Save
        </button>
        <button
          type="button"
          className="wb-config-btn wb-config-btn-secondary"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </aside>
  )
}
