import { useState, useEffect } from "react";

// Type the openai bridge
declare global {
  interface Window {
    openai?: {
      toolOutput?: {
        structuredContent?: {
          items?: Array<{ id: string; name: string }>;
        };
      };
      callTool?: (name: string, args: Record<string, unknown>) => Promise<{
        structuredContent?: Record<string, unknown>;
      }>;
    };
  }
}

interface Item {
  id: string;
  name: string;
}

export default function App() {
  const [items, setItems] = useState<Item[]>(
    window.openai?.toolOutput?.structuredContent?.items ?? []
  );
  const [input, setInput] = useState("");

  // Listen for ChatGPT pushing new globals
  useEffect(() => {
    const handler = (e: CustomEvent) => {
      const newItems = e.detail?.globals?.toolOutput?.structuredContent?.items;
      if (newItems) setItems(newItems);
    };
    window.addEventListener("openai:set_globals", handler as EventListener);
    return () => window.removeEventListener("openai:set_globals", handler as EventListener);
  }, []);

  const addItem = async () => {
    const name = input.trim();
    if (!name) return;

    if (window.openai?.callTool) {
      const res = await window.openai.callTool("add_item", { name });
      if (res?.structuredContent?.items) {
        setItems(res.structuredContent.items as Item[]);
      }
    } else {
      // Local dev fallback
      setItems((prev) => [...prev, { id: crypto.randomUUID(), name }]);
    }
    setInput("");
  };

  return (
    <div style={{ padding: 16, fontFamily: "system-ui" }}>
      <h2>My App</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addItem()}
          placeholder="Add an item..."
          style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: "1px solid #ccc" }}
        />
        <button onClick={addItem}>Add</button>
      </div>
      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}