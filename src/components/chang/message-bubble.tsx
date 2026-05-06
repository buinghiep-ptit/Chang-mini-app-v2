import { Check, ChevronDown, FileImage, FileText, File, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Mascot } from './mascot'
import { cn } from '@/lib/utils'
import type { Message, Attachment } from '@/store/chat-store'

// ── File helpers ───────────────────────────────────────────────
function AttachmentIcon({ type, size = 14 }: { type: string; size?: number }) {
  if (type.startsWith('image/')) return <FileImage size={size} className="shrink-0" />
  if (type === 'application/pdf') return <FileText size={size} className="shrink-0 text-red-400" />
  return <File size={size} className="shrink-0" />
}

// ── Full-screen preview portal ─────────────────────────────────
function PreviewModal({ att, onClose }: { att: Attachment; onClose: () => void }) {
  const isImage = att.type.startsWith('image/')
  const isPdf = att.type === 'application/pdf'

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-6"
      onClick={onClose}
    >
      {/* Close — top-right corner of the overlay */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition-colors"
      >
        <X size={16} />
      </button>
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="relative w-full max-w-sm max-h-[80dvh] rounded-2xl overflow-hidden bg-card shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {isImage && (
          <img
            src={att.objectUrl}
            alt={att.name}
            className="w-full h-full object-contain max-h-[80dvh]"
          />
        )}
        {isPdf && (
          <iframe
            src={att.objectUrl}
            title={att.name}
            className="w-full h-[70dvh]"
          />
        )}
        {!isImage && !isPdf && (
          <div className="flex flex-col items-center justify-center gap-3 py-12 px-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
              <AttachmentIcon type={att.type} size={28} />
            </div>
            <p className="text-[14px] font-medium break-all">{att.name}</p>
            <p className="text-[12px] text-muted-foreground">Không thể xem trước loại file này</p>
          </div>
        )}
      </motion.div>
    </motion.div>,
    document.body,
  )
}

// ── Attachment list row ────────────────────────────────────────
function AttachmentRow({ att, onPreview }: { att: Attachment; onPreview: () => void }) {
  const isPdf = att.type === 'application/pdf'
  return (
    <button
      onClick={onPreview}
      className={cn(
        'w-full flex items-center gap-2.5 px-3 py-2 rounded-sm border text-[13px] text-left transition-colors',
        isPdf
          ? 'bg-red-50 border-red-100 dark:bg-red-950/30 dark:border-red-900/40 hover:bg-red-100/60 dark:hover:bg-red-950/50'
          : 'bg-primary/10 border-primary/20 hover:bg-primary/15',
      )}
    >
      <AttachmentIcon type={att.type} />
      <span className="flex-1 truncate font-medium">{att.name}</span>
    </button>
  )
}

// ── Main MessageBubble ─────────────────────────────────────────
interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const [thinkingOpen, setThinkingOpen] = useState(false)
  const [preview, setPreview] = useState<Attachment | null>(null)
  const isUser = message.role === 'user'
  const hasAttachments = isUser && message.attachments && message.attachments.length > 0

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className={cn('flex gap-2', isUser ? 'justify-end' : 'justify-start')}
      >
        {/* Chang avatar */}
        {!isUser && (
          <div className="shrink-0 w-8 h-8 rounded-full bg-info/10 flex items-center justify-center overflow-hidden mt-0.5">
            <Mascot size={22} />
          </div>
        )}

        <div className={cn('flex flex-col gap-1.5 max-w-[78%] md:max-w-[65%]', isUser && 'items-end')}>
          {/* File attachment list (above text bubble) */}
          {hasAttachments && (
            <div className="flex flex-col gap-1.5 w-full">
              {message.attachments!.map((att, i) => (
                <AttachmentRow key={i} att={att} onPreview={() => setPreview(att)} />
              ))}
            </div>
          )}

          {/* Text bubble */}
          <div
            className={cn(
              'rounded-2xl px-4 py-2.5 text-[15px] leading-6',
              isUser
                ? 'bg-primary text-primary-foreground tail-r'
                : 'bg-muted text-foreground tail-l',
            )}
          >
            {message.content}
          </div>

          {/* Task steps (Chang only) */}
          {!isUser && message.tasks && message.tasks.length > 0 && (
            <div className="pl-1 flex flex-col gap-1.5">
              <button
                onClick={() => setThinkingOpen(o => !o)}
                className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
              >
                <Check size={13} className="text-success" />
                Xem suy nghĩ
                <ChevronDown
                  size={13}
                  className={cn('transition-transform', thinkingOpen && 'rotate-180')}
                />
              </button>
              <AnimatePresence>
                {thinkingOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden flex flex-col gap-1.5 border-l-2 border-border pl-3"
                  >
                    {message.tasks.map(task => (
                      <div key={task.id} className="flex items-center gap-2 text-[13px]">
                        {task.status === 'done' ? (
                          <Check size={13} className="text-success shrink-0" />
                        ) : (
                          <span className="w-3 h-3 rounded-full border-2 border-info border-t-transparent animate-spin shrink-0" />
                        )}
                        <span className={task.status === 'done' ? 'text-muted-foreground' : 'text-foreground'}>
                          {task.label}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* User spacer */}
        {isUser && <div className="w-8 shrink-0" />}
      </motion.div>

      {/* Preview modal */}
      <AnimatePresence>
        {preview && <PreviewModal att={preview} onClose={() => setPreview(null)} />}
      </AnimatePresence>
    </>
  )
}

export function ThinkingBubble() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      className="flex gap-2 items-start"
    >
      <div className="shrink-0 w-8 h-8 rounded-full bg-info/10 flex items-center justify-center overflow-hidden">
        <Mascot size={22} />
      </div>
      <div className="bg-muted rounded-2xl tail-l px-4 py-3 flex items-center gap-1.5">
        {[0, 1, 2].map(i => (
          <motion.span
            key={i}
            className="w-2 h-2 rounded-full bg-muted-foreground/60"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </motion.div>
  )
}
