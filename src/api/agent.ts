import apiClient from './axiosClient'

export type MessageRole = 'user' | 'assistant' | 'tool'

export interface ChatMessage {
  role: MessageRole
  content: string
}

export interface ChatRequest {
  message: string
  message_history: ChatMessage[]
}

export interface ChatResponse {
  reply: string
  history: ChatMessage[]
}

/**
 * Send a message to the AI agent.
 * POST /agent/chat
 *
 * The full message_history must be sent every time so the agent
 * maintains context across turns (including tool calls).
 */
export async function chatWithAgent(
  message: string,
  messageHistory: ChatMessage[] = []
): Promise<ChatResponse> {
  const response = await apiClient.post<ChatResponse>('/agent/chat', {
    message,
    message_history: messageHistory,
  })
  return response.data
}
