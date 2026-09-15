"use client";

import { Bot, Send, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { api } from "@/lib/api";
import { cn } from "@/lib/cn";

const SUMMARY_PROMPT =
  "Give me a summary of the team's work this week: completed work highlights, recurring blockers, and any workload imbalances you notice.";

const HISTORY_LIMIT = 10;

export function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, sending]);

  const send = async (text) => {
    const message = text.trim();
    if (!message || sending) return;

    setError("");
    const history = messages.slice(-HISTORY_LIMIT);
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setInput("");
    setSending(true);
    try {
      const data = await api.post("/assistant/chat", { message, history });
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setError(err.message || "The assistant couldn't respond. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-3 flex h-[520px] w-[360px] flex-col overflow-hidden rounded-lg border border-border bg-card shadow-hero">
          <div className="flex items-center justify-between border-b border-border bg-hero px-4 py-3 text-hero-foreground">
            <span className="flex items-center gap-2 text-sm font-bold">
              <Bot className="size-4" /> WorkPulse Assistant
            </span>
            <button onClick={() => setOpen(false)} aria-label="Close assistant" className="rounded-md p-1 hover:bg-hero-soft">
              <X className="size-4" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.length === 0 && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Ask me about your team's recent reports --- e.g. "What did Priya work on last week?" or
                  "What blockers keep coming up?"
                </p>
                <button
                  onClick={() => send(SUMMARY_PROMPT)}
                  className="flex w-full items-center gap-2 rounded-md border border-dashed border-brand-blue/40 bg-brand-blue/5 px-3 py-2 text-left text-xs font-medium text-brand-blue hover:bg-brand-blue/10"
                >
                  <Sparkles className="size-3.5 shrink-0" /> Generate this week's team summary
                </button>
              </div>
            )}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={cn(
                  "max-w-[85%] rounded-md px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap",
                  msg.role === "user"
                    ? "ml-auto bg-brand-blue text-brand-blue-foreground"
                    : "bg-dashboard-soft text-foreground",
                )}
              >
                {msg.content}
              </div>
            ))}
            {sending && (
              <div className="flex items-center gap-2 rounded-md bg-dashboard-soft px-3 py-2 text-sm text-muted-foreground">
                <Spinner className="size-3.5" /> Thinking…
              </div>
            )}
            {error && <p className="text-xs font-medium text-destructive">{error}</p>}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-border p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your team's reports…"
              className="h-9 flex-1 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <Button type="submit" size="icon" variant="hero" disabled={sending || !input.trim()}>
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close assistant" : "Open assistant"}
        className="grid size-14 place-items-center rounded-full bg-brand-blue text-brand-blue-foreground shadow-button transition-transform hover:-translate-y-0.5 hover:shadow-button-hover"
      >
        {open ? <X className="size-6" /> : <Bot className="size-6" />}
      </button>
    </div>
  );
}
