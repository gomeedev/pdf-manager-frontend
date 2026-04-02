import { useState, useCallback } from 'react'
import { chatWithAgent, ChatMessage } from '@/api/agent'
import { useAuth } from '@/hooks/useAuth'

export function useAgent() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !user) return

    // Add user message to local state immediately
    const userMessage: ChatMessage = { role: 'user', content }
    const updatedHistory = [...messages, userMessage]
    setMessages(updatedHistory)
    setIsTyping(true)
    setError(null)

    try {
      // We pass the current messages (before adding the new one) as history,
      // because the backend might expect the history without the new message, 
      // or we can pass the history WITH the new message. The API structure typical
      // for this is to send message + previous history.
      const cleanHistory = messages.map(msg => {
        const cleaned: any = { role: msg.role, content: msg.content }
        if (msg.name !== undefined && msg.name !== null) cleaned.name = msg.name
        if (msg.tool_call_id !== undefined && msg.tool_call_id !== null) cleaned.tool_call_id = msg.tool_call_id
        return cleaned
      })
      
      const response = await chatWithAgent(content, cleanHistory)
      
      // Update with the full history returned from the server if available, 
      // or simply append the assistant's reply.
      if (response.history && response.history.length > 0) {
        setMessages(response.history)
      } else {
        setMessages([...updatedHistory, { role: 'assistant', content: response.reply }])
      }
    } catch (err: any) {
      console.error('Error talking to AI agent:', err)
      setError(err.response?.data?.detail || 'Failed to connect to the agent.')
      // Optional: remove the user message if it failed, but usually it's better to keep it and show error
    } finally {
      setIsTyping(false)
    }
  }, [messages, user])

  const clearHistory = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  return {
    messages,
    isTyping,
    error,
    sendMessage,
    clearHistory
  }
}
