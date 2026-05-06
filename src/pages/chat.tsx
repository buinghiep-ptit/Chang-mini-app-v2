import { useEffect, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ChangComposer } from '@/components/chang/composer'
import { ChangTopBar } from '@/components/chang/top-bar'
import { MessageBubble, ThinkingBubble } from '@/components/chang/message-bubble'
import { useChatStore, getChangResponse } from '@/store/chat-store'

interface ChatPageProps {
  chatId: string
}

export function ChatPage({ chatId }: ChatPageProps) {
  const { state, dispatch } = useChatStore()
  const conv = state.conversations.find(c => c.id === chatId)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conv?.messages.length, conv?.status])

  function handleSend(text: string, files?: File[]) {
    if (!conv || conv.status === 'thinking') return
    const attachments = files?.map(f => ({
      name: f.name,
      type: f.type,
      objectUrl: URL.createObjectURL(f),
    }))
    dispatch({ type: 'ADD_USER_MSG', convId: chatId, content: text, attachments })
    const res = getChangResponse(text)
    setTimeout(() => {
      dispatch({ type: 'ADD_CHANG_MSG', convId: chatId, content: res.content, tasks: res.tasks })
    }, 1800)
  }

  if (!conv) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
        Không tìm thấy cuộc trò chuyện.
      </div>
    )
  }

  return (
    <>
      <ChangTopBar title={conv.title.length > 24 ? conv.title.slice(0, 24) + '…' : conv.title} />

      {/* Conversation title pill */}
      <div className="px-3 pt-3 md:px-6 md:max-w-2xl md:mx-auto md:w-full shrink-0">
        <div className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold truncate">
          {conv.title}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-3 no-scrollbar md:px-6 md:max-w-2xl md:mx-auto md:w-full">
        <AnimatePresence initial={false}>
          {conv.messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          {conv.status === 'thinking' && <ThinkingBubble key="thinking" />}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      <div className="md:max-w-2xl md:mx-auto md:w-full">
        <ChangComposer
          tabs
          onSend={handleSend}
          disabled={conv.status === 'thinking'}
        />
      </div>
    </>
  )
}
