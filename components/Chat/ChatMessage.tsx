import { Message } from "@/types";
import { FC } from "react";
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import supersub from 'remark-supersub'

interface Props {
  message: Message;
}

export const ChatMessage: FC<Props> = ({ message }) => {
  return (
    <div className={`flex flex-col ${message.role === "assistant" ? "items-start" : "items-end"}`}>
      <div
        className={`flex items-center ${message.role === "assistant" ? "bg-neutral-200 text-neutral-900" : "bg-blue-500 text-white"} rounded-2xl px-3 py-2 max-w-[67%] whitespace-pre-wrap`}
        style={{ overflowWrap: "anywhere" }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkMath, supersub, remarkBreaks, remarkGfm]}
          rehypePlugins={[[rehypeHighlight, { detect: true, ignoreMissing: true }]]}
          className={`markdown-body markdown-custom-styles !text-base font-normal`}
          linkTarget="_blank"
        >
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  );
};
