import { useOptimistic, useState, useRef, startTransition } from "react";

async function deliverMessage(message: string) {
  await new Promise((res) => setTimeout(res, 1000));
  // 模拟 30% 的失败率以演示回滚
  if (Math.random() < 0.5) {
    throw new Error("网络错误：消息发送失败");
  }
  return message;
}

interface Message {
  text: string;
  sending: boolean;
  key: number;
}

function Thread({ messages, sendMessageAction }: { messages: Message[], sendMessageAction: (formData: FormData) => Promise<void> }) {
  const formRef = useRef<HTMLFormElement>(null);
  function formAction(formData: FormData) {
    addOptimisticMessage(formData.get("message") as string);
    formRef.current?.reset();
    startTransition(async () => {
      await sendMessageAction(formData);
    });
  }
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state: Message[], newMessage: string) => [
      {
        text: newMessage,
        sending: true,
        key: Date.now()
      },
      ...state,
    ]
  );

  return (
    <>
      <form action={formAction} ref={formRef}>
        <input type="text" name="message" placeholder="你好！" />
        <button type="submit">发送</button>
      </form>
      {optimisticMessages.map((message: Message) => (
        <div key={message.key}>
          {message.text}
          {!!message.sending && <small>（发送中……）</small>}
        </div>
      ))}
    </>
  );
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    { text: "你好，在这儿！", sending: false, key: 1 }
  ]);
  async function sendMessageAction(formData: FormData) {
    const sentMessage = await deliverMessage(formData.get("message") as string);
    startTransition(() => {
      setMessages((messages) => [{ text: sentMessage, sending: false, key: Date.now() }, ...messages]);
    });
  }
  return <Thread messages={messages} sendMessageAction={sendMessageAction} />;
}