/* eslint-disable jsx-a11y/label-has-associated-control */
"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, SendIcon, Sparkles, Star } from "lucide-react";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
};

const starterPrompts = [
  "Plan a weekend trip to Kyoto",
  "Summarize the latest AI breakthroughs",
  "Help me brainstorm a startup idea",
  "Draft a friendly welcome message for new teammates"
];

export default function Page() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content:
        "Hey there, I'm Astra—your friendly conversational partner. Ask me about planning, brainstorming, learning new topics, or just say hi!",
      createdAt: Date.now()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [pending, setPending] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth"
    });
  }, [messages]);

  const sendMessage = async (prompt: string) => {
    if (!prompt.trim() || pending) return;
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: prompt.trim(),
      createdAt: Date.now()
    };

    const optimisticMessages = [...messages, userMessage];
    setMessages(optimisticMessages);
    setInputValue("");
    setPending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation: optimisticMessages.map(({ role, content }) => ({
            role,
            content
          }))
        })
      });

      if (!response.ok) {
        throw new Error("Failed to reach assistant");
      }

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.reply ?? "I came up empty—mind asking that a different way?",
        createdAt: Date.now()
      };

      setMessages((current) => [...current, assistantMessage]);
    } catch (error) {
      console.error(error);
      const fallback: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          "I hit a snag trying to respond. Give it another shot in a few seconds?",
        createdAt: Date.now()
      };
      setMessages((current) => [...current, fallback]);
    } finally {
      setPending(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage(inputValue);
  };

  return (
    <main className="flex min-h-screen flex-col bg-slate-950">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 pb-10 pt-12 md:px-10">
        <div className="flex flex-col gap-10 md:flex-row">
          <section className="w-full rounded-3xl border border-white/5 bg-white/[0.02] p-8 shadow-2xl shadow-brand-900/40 backdrop-blur-sm md:w-80">
            <div className="mb-6 flex items-center gap-3 text-brand-200">
              <Sparkles className="size-8" />
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-brand-300">
                  Astra
                </p>
                <h1 className="text-2xl font-semibold text-white">
                  Conversational Copilot
                </h1>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-200/80">
              Bring your ideas, questions, and plans—Astra responds with
              thoughtful, structured guidance that feels both personable and
              actionable.
            </p>

            <div className="mt-8 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center gap-2 text-brand-200">
                  <Star className="size-4" />
                  <span className="text-xs uppercase tracking-widest">
                    Try asking
                  </span>
                </div>
                <ul className="mt-3 space-y-2 text-sm text-slate-200/80">
                  {starterPrompts.map((prompt) => (
                    <li key={prompt}>
                      <button
                        type="button"
                        onClick={() => void sendMessage(prompt)}
                        className="w-full rounded-xl border border-transparent bg-white/[0.02] px-4 py-3 text-left transition hover:border-white/20 hover:bg-white/[0.04]"
                      >
                        {prompt}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="flex w-full flex-1 flex-col overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] shadow-2xl shadow-brand-900/40 backdrop-blur-sm">
            <header className="border-b border-white/5 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-brand-500/20 text-brand-100 ring-1 ring-brand-400/40">
                  <Sparkles className="size-6" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-brand-200">
                    Live Session
                  </p>
                  <h2 className="text-xl font-semibold text-white">
                    Ask Astra anything
                  </h2>
                </div>
              </div>
            </header>

            <div
              ref={listRef}
              className="flex-1 space-y-6 overflow-y-auto px-6 py-6"
            >
              {messages.map((message) => (
                <article
                  key={message.id}
                  className={`max-w-xl rounded-3xl border px-5 py-4 text-sm leading-relaxed shadow-lg transition ${
                    message.role === "assistant"
                      ? "ml-0 border-brand-500/30 bg-brand-500/10 text-brand-50 shadow-brand-900/30"
                      : "ml-auto border-white/10 bg-white/[0.06] text-white shadow-black/20"
                  }`}
                >
                  {message.content}
                </article>
              ))}

              {pending ? (
                <div className="flex items-center gap-3 rounded-3xl border border-brand-500/30 bg-brand-500/10 px-5 py-4 text-brand-100 shadow-brand-900/30">
                  <Loader2 className="size-5 animate-spin" />
                  <span className="text-sm">Thinking through your request…</span>
                </div>
              ) : null}
            </div>

            <footer className="border-t border-white/5 p-4 md:p-6">
              <form
                onSubmit={handleSubmit}
                className="flex w-full flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-3 shadow-lg shadow-black/20 transition focus-within:border-brand-400/40 focus-within:bg-white/[0.04]"
              >
                <label className="text-xs uppercase tracking-[0.4em] text-slate-200/60">
                  Message Astra
                </label>
                <textarea
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  rows={3}
                  placeholder="Ask me to plan, summarize, brainstorm, or create…"
                  className="w-full resize-none rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-brand-400/60 focus:bg-slate-900/40"
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-300/70">
                    Astra crafts answers using curated knowledge and creative
                    reasoning.
                  </p>
                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-full bg-brand-500 px-5 py-2 text-sm font-medium text-white transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:bg-brand-500/40"
                    disabled={pending || !inputValue.trim()}
                  >
                    <SendIcon className="size-4" />
                    Send
                  </button>
                </div>
              </form>
            </footer>
          </section>
        </div>
      </div>
    </main>
  );
}
