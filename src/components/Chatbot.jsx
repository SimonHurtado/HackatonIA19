import { useState, useRef, useEffect } from "react";
import { Bot, User, ChevronDown, ChevronUp, MessageSquare, X } from "lucide-react";

function Chatbot() {
  const generateId = () => crypto.randomUUID();

  const [isOpen, setIsOpen] = useState(false); // 👈 Estado para abrir/cerrar
  const [conversationId, setConversationId] = useState(() => {
    const saved = localStorage.getItem("current-conversation-id");
    if (saved) return saved;
    const newId = generateId();
    localStorage.setItem("current-conversation-id", newId);
    return newId;
  });

  const [messages, setMessages] = useState(() => {
    const cached = localStorage.getItem("chat-history");
    return cached
      ? JSON.parse(cached)
      : [{ sender: "bot", text: "¡Hola soy Inge! ¿En qué puedo ayudarte hoy?" }];
  });

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const [metrics, setMetrics] = useState(() => {
    const cached = localStorage.getItem("chat-metrics");
    return cached
      ? JSON.parse(cached)
      : {
          totalUserMessages: 0,
          totalBotMessages: 1,
          lastResponseTime: 0,
          averageResponseTime: 0,
        };
  });

  const [showMetrics, setShowMetrics] = useState(false);

  useEffect(() => {
    localStorage.setItem("chat-history", JSON.stringify(messages));
    localStorage.setItem("chat-metrics", JSON.stringify(metrics));
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, metrics]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: "user", text: input };
    const updatedHistory = [...messages, userMessage];
    setMessages(updatedHistory);
    setInput("");
    setLoading(true);

    const startTime = performance.now();

    try {
      const response = await fetch("https://us-central1-hackatongrupo19.cloudfunctions.net/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, history: updatedHistory }),
      });

      const endTime = performance.now();
      const duration = endTime - startTime;
      const data = await response.json();
      const reply = data.reply || "No se pudo generar respuesta.";
      const botMessage = { sender: "bot", text: reply };

      setMessages((prev) => [...prev, botMessage]);

      setMetrics((prev) => {
        const totalBot = prev.totalBotMessages + 1;
        const totalUser = prev.totalUserMessages + 1;
        const avg = ((prev.averageResponseTime * (totalBot - 1)) + duration) / totalBot;
        return {
          totalUserMessages: totalUser,
          totalBotMessages: totalBot,
          lastResponseTime: duration,
          averageResponseTime: avg,
        };
      });
    } catch (error) {
      console.error("Error al conectar con la API:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error al conectar con el servidor." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleMetrics = () => setShowMetrics(!showMetrics);

  const resetConversation = () => {
    const existing = JSON.parse(localStorage.getItem("conversations") || "[]");
    existing.push({ id: conversationId, timestamp: new Date().toISOString(), messages, metrics });
    localStorage.setItem("conversations", JSON.stringify(existing));

    const newId = generateId();
    setConversationId(newId);
    localStorage.setItem("current-conversation-id", newId);

    setMessages([{ sender: "bot", text: "¡Hola soy Inge! ¿En qué puedo ayudarte hoy?" }]);
    setMetrics({
      totalUserMessages: 0,
      totalBotMessages: 1,
      lastResponseTime: 0,
      averageResponseTime: 0,
    });

    localStorage.removeItem("chat-history");
    localStorage.removeItem("chat-metrics");
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Botón flotante para abrir/cerrar */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-orange-400 text-white p-3 rounded-full shadow-lg hover:bg-orange-500 transition"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {/* Panel del chatbot */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[600px] bg-white rounded-xl shadow-xl flex flex-col overflow-hidden border border-black">
          {/* Encabezado */}
          <div className="bg-black text-orange-400 p-3 font-semibold flex justify-between items-center">
        Chatbot
            <button onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5 text-white hover:text-red-500" />
            </button>
          </div>

          {/* Botón de métricas */}
          <button
            onClick={toggleMetrics}
            className="flex justify-between items-center bg-gray-100 px-4 py-2 text-sm text-gray-800 hover:bg-gray-200 transition"
          >
            <span className="font-medium">Métricas del chat (Para jueces)</span>
            {showMetrics ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {/* Panel de métricas */}
          {showMetrics && (
            <div className="bg-white border-b border-gray-200 px-4 py-2 text-sm text-gray-700">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-2">
                <div>
                  <span className="font-semibold">⏱ Última:</span>
                  <div>{metrics.lastResponseTime.toFixed(0)} ms</div>
                </div>
                <div>
                  <span className="font-semibold">💬 Usuario:</span>
                  <div>{metrics.totalUserMessages}</div>
                </div>
                <div>
                  <span className="font-semibold">🤖 IA:</span>
                  <div>{metrics.totalBotMessages}</div>
                </div>
                <div>
                  <span className="font-semibold">📈 Promedio:</span>
                  <div>{metrics.averageResponseTime.toFixed(0)} ms</div>
                </div>
              </div>
              <div className="text-right">
                <button
                  onClick={resetConversation}
                  className="text-xs text-red-500 hover:underline hover:text-red-600 transition"
                >
                  Nueva conversación
                </button>
              </div>
            </div>
          )}

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4 bg-slate-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className="flex items-end gap-2 max-w-[80%]">
                  {msg.sender === "bot" && <Bot className="w-5 h-5 text-orange-400" />}
                  <div
                    className={`px-4 py-2 rounded-2xl text-sm whitespace-pre-line ${
                      msg.sender === "user"
                        ? "bg-orange-400 text-white rounded-br-none"
                        : "bg-gray-200 text-gray-900 rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                  {msg.sender === "user" && <User className="w-5 h-5 text-gray-400" />}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="px-4 py-2 text-sm bg-gray-300 text-gray-800 rounded-2xl animate-pulse">
                  Escribiendo...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t bg-white flex items-center gap-2">
            <input
              type="text"
              className="flex-1 border border-gray-400 text-black  rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Escribe un mensaje..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className={`bg-orange-400 text-white px-4 py-2 rounded-full ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-orange-500"
              }`}
            >
              {loading ? "..." : "Enviar"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chatbot;
