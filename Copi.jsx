import { useState, useRef, useEffect } from "react";
import { Bot, User } from "lucide-react"; // íconos para avatar

function App() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "¡Hola soy Inge! ¿En qué puedo ayudarte hoy?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const [metrics, setMetrics] = useState({
    totalUserMessages: 0,
    totalBotMessages: 1,
    lastResponseTime: 0,
    averageResponseTime: 0,
  });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    const startTime = performance.now();

    try {
      const response = await fetch("https://us-central1-hackatongrupo19.cloudfunctions.net/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: input,
          history: messages,
        }),
      });

      const endTime = performance.now();
      const duration = endTime - startTime;

      const data = await response.json();
      const reply = data.reply || "No se pudo generar respuesta.";

      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);

      setMetrics((prev) => {
        const totalBot = prev.totalBotMessages + 1;
        const totalUser = prev.totalUserMessages + 1;
        const avg =
          ((prev.averageResponseTime * (totalBot - 1)) + duration) / totalBot;

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl flex flex-col h-[700px] overflow-hidden">
        {/* Header */}
        <div className="bg-black text-orange-400 p-4 text-center font-semibold text-lg">
          INGELEAN
        </div>

        {/* Métricas */}
        <div className="fixed bg-white border-b border-gray-200 px-4 py-2 text-sm grid grid-cols-2 sm:grid-cols-4 gap-4 text-gray-700">
          <div> 
            <span className="font-semibold">⏱ Última respuesta:</span>
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

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className="flex items-end gap-2 max-w-[80%]">
                {msg.sender === "bot" && <Bot className="w-6 h-6 text-orange-400" />}
                <div
                  className={`px-4 py-2 rounded-2xl text-sm whitespace-pre-line ${
                    msg.sender === "user"
                      ? "bg-orange-400 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-900 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
                {msg.sender === "user" && <User className="w-6 h-6 text-gray-400" />}
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

        {/* Input area */}
        <div className="p-3 border-t bg-white flex items-center gap-2">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Escribe un mensaje..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className={`bg-orange-400 text-white px-4 py-2 rounded-full ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
          >
            {loading ? "Pensando..." : "Enviar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
