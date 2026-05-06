import { Check, ChevronDown } from 'lucide-react'
import { ChangComposer } from '@/components/chang/composer'
import { ChangTopBar } from '@/components/chang/top-bar'

export function ConversationPage() {
  return (
    <>
      <ChangTopBar />
      <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-3 no-scrollbar">
        <div className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold">
          Hội thoại mới mà Chang chưa kịp đặt tên
        </div>
        <p className="text-[15px] leading-6 px-1">
          Chào Phong,{' '}
          <span className="inline-block w-4 h-4 align-middle bg-foreground rounded-sm" />{' '}
          Hôm nay anh muốn biết điều gì? Chang ở đây và sẵn lòng giúp đỡ anh!
        </p>
        <div className="self-end max-w-[78%] bg-muted text-foreground rounded-2xl tail-r px-4 py-2.5 text-[15px]">
          A bubble component for chat.
        </div>

        {/* Thinking / processing block */}
        <div className="flex gap-3 pl-1 pr-2 border-l-2 border-border ml-2">
          <div className="-ml-[11px] mt-0.5 w-5 h-5 rounded-full border-2 border-info border-t-transparent animate-spin shrink-0" />
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[15px] font-medium">
              Đang xử lí yêu cầu
              <ChevronDown size={16} className="text-muted-foreground" />
            </div>
            <div className="text-sm text-muted-foreground">
              Anh Phong muốn đòi bồi thường bảo hiểm
            </div>
            <div className="text-[15px]">Tạo Task: Bồi thường bảo hiểm của PhongNT31</div>
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-border bg-background w-fit text-sm">
              <Check size={14} className="text-success" /> Task Completed
            </div>
            <div className="text-[15px]">
              Yêu cầu anh Phong cung cấp các giấy tờ liên quan
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-border bg-background w-fit text-sm">
              <span className="w-3.5 h-3.5 rounded-full border-2 border-info border-t-transparent animate-spin" />
              Task Completed
            </div>
          </div>
        </div>
      </div>
      <ChangComposer />
    </>
  )
}
