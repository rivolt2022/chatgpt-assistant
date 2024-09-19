import { Chat } from "@/components/Chat/Chat";
import { Footer } from "@/components/Layout/Footer";
import { Navbar } from "@/components/Layout/Navbar";
import { Message } from "@/types";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { OpenAIAssistant } from '@brainstack/openai-assistantapi';


interface MessageContent {
  type: string;
  text: {
    value: string;
  };
}

interface MessageData {
  id: string;
  object: string;
  created_at: number;
  assistant_id: string | null;
  thread_id: string;
  run_id: string | null;
  role: string;
  content: MessageContent[];
}

interface RunCompletedResponse {
  event: string;
  threadId: string;
  respmsg: {
    body: {
      object: string;
      data: MessageData[];
    };
  };
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [assistant, setAssistant] = useState<OpenAIAssistant | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (message: Message) => {
    if (!assistant) return;  // assistant 초기화 전에 실행되지 않도록 방지

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      await assistant.addMessage(message.content);
      await assistant.run();
    } catch (error) {
      console.error('Assistant error:', error);
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        role: "assistant",
        content: `보드게임 룰설명 챗봇입니다.(담고있는 보드게임 : @테라포밍마스@황혼의 투쟁@윙스팬)`
      }
    ]);
  };

  useEffect(() => {
    // 초기화된 assistant 객체를 설정
    const initializedAssistant = new OpenAIAssistant(
      {
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY  || '', // 환경변수 변경
        dangerouslyAllowBrowser: true
      },
      process.env.NEXT_PUBLIC_OPENAI_ASSISTANT_ID  || '' // 환경변수 변경
    );

    setAssistant(initializedAssistant);  // assistant 객체를 상태로 설정
  }, []);

  useEffect(() => {
    if (!assistant) return; // assistant가 초기화되기 전에는 아무것도 하지 않음

    setMessages([
      {
        role: "assistant",
        content: `보드게임 룰설명 챗봇입니다.(담고있는 보드게임 : @테라포밍마스@황혼의 투쟁@윙스팬)`
      }
    ]);

    assistant.initThread();
    assistant.on('run_completed', (data: RunCompletedResponse) => {
      const messageData = data.respmsg.body.data;
      if (messageData && messageData.length > 0) {
        const responseMessage = messageData
          .filter(msg => msg.role === "assistant")
          .map(msg => msg.content.map(content => content.text.value).join("\n"))
          .join("\n");

        if (responseMessage) {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              role: "assistant",
              content: responseMessage,
            },
          ]);
        }
      }
      setLoading(false);
    });
  }, [assistant]); // assistant가 초기화되었을 때만 실행

  return (
    <>
      <Head>
        <title>보드게임 룰설명 챗봇</title>
        <meta name="description" content="보드게임 룰설명 챗봇" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col h-screen">
        <Navbar />

        <div className="flex-1 overflow-auto sm:px-10 pb-4 sm:pb-10">
          <div className="max-w-[800px] mx-auto mt-4 sm:mt-12">
            <Chat
              messages={messages}
              loading={loading}
              onSend={handleSend}
              onReset={handleReset}
            />
            <div ref={messagesEndRef} />
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}