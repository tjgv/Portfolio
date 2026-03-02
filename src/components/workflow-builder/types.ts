/**
 * Workflow Builder - Type definitions
 * Production-ready types for AI-powered workflow automation
 */

export type WorkflowStatus = 'idle' | 'loading' | 'success' | 'error';

export type NodeTypeId = 'trigger' | 'action' | 'ai-operation' | 'condition';

export type TriggerKind =
  | 'webhook'
  | 'schedule'
  | 'manual'
  | 'event'
  | 'file-watch'
  | 'email-received';

export type ActionKind =
  | 'http-request'
  | 'email'
  | 'discord'
  | 'database'
  | 'transform';

export type AIOperationKind =
  | 'summarize'
  | 'extract'
  | 'classify'
  | 'generate'
  | 'translate';

export type ConditionOperator = 'equals' | 'contains' | 'gt' | 'lt' | 'exists';

/** Base node data shared by all node types */
export interface BaseNodeData {
  label: string;
  status?: 'idle' | 'success' | 'error' | 'running';
  errorMessage?: string;
}

export interface TriggerNodeData extends BaseNodeData {
  kind: TriggerKind;
  config?: {
    webhookPath?: string;
    schedule?: string;
    eventType?: string;
    mailboxFolder?: string;
    fromFilter?: string;
  };
}

export interface ActionNodeData extends BaseNodeData {
  kind: ActionKind;
  config?: Record<string, unknown>;
}

export interface AIOperationNodeData extends BaseNodeData {
  kind: AIOperationKind;
  config?: {
    model?: string;
    prompt?: string;
    maxTokens?: number;
  };
}

export interface ConditionNodeData extends BaseNodeData {
  leftOperand?: string;
  operator?: ConditionOperator;
  rightOperand?: string;
}

export type WorkflowNodeData =
  | TriggerNodeData
  | ActionNodeData
  | AIOperationNodeData
  | ConditionNodeData;

/** Node palette item for drag-from-toolbox */
export interface NodePaletteItem {
  type: NodeTypeId;
  label: string;
  description?: string;
  icon?: string;
}
