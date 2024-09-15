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

interface StatusChangedEvent {
  event: string;
  status: string;
  headers: {
    uuid: string;
    timestamp: number;
  }[];
}


const assistant = new OpenAIAssistant(
  {
    apiKey: process.env.OPENAI_API_KEY || '', // Replace with your actual API key
    dangerouslyAllowBrowser: true
  },
  process.env.OPENAI_ASSISTANT_ID || '' // Replace with your Assistant ID
);

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (message: Message) => {
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
    //scrollToBottom();
  }, [messages]);

  // Initialize the assistant and set up event listeners
  useEffect(() => {
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

  }, []); // Dependency on isInitialized

  return (
    <>
      <Head>
        <title>보드게임 룰설명 챗봇</title>
        <meta
          name="description"
          content="보드게임 룰설명 챗봇"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <link
          rel="icon"
          href="/favicon.ico"
        />
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
