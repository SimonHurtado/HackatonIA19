import { useState, useRef, useEffect } from "react";
import { Bot, User } from "lucide-react"; // íconos para avatar (instala lucide-react)

function App() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "¡Hola! ¿En qué puedo ayudarte hoy?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

 const sendMessage = async () => {
  if (!input.trim()) return;

  const userMessage = { sender: "user", text: input };
  setMessages((prev) => [...prev, userMessage]);
  setInput("");
  setLoading(true);

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
    "Content-Type": "application/json",
    "HTTP-Referer": "http://localhost:5173",
    "X-Title": "Chatbot Ingelean"
  },
  body: JSON.stringify({
    model: "mistralai/mistral-7b-instruct:free",
    messages: [
      {
  role: "system",
  content: `
Eres un asistente virtual  de atención al cliente de INGELEAN S.A.S, responde como si fueras una persona, se amable, usa emojis, respuestas muy cortas y concisas.

Qué hacer:
Responde dde forma corta a las preguntas del usuario.

Información sobre INGELEAN:
- Empresa ubicada en Pereira, Risaralda (Colombia)
- Especializada en: automatización industrial, desarrollo de software a medida, inteligencia artificial y mantenimiento de equipos industriales.
- Atiende empresas principalmente en el Eje Cafetero.
- Ofrece servicios personalizados para optimizar procesos industriales y comerciales.
- No tiene tienda física abierta al público.
- Se enfoca en soluciones B2B (empresa a empresa).


DESPUES DE CADA MENSAJE ENVIA ESTE NUMERO 6666


`
},
      ...messages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text
      })),
      { role: "user", content: input }
    ]
  })
});
    const data = await response.json();
    console.log("Respuesta OpenRouter:", data);

    const reply = data.choices?.[0]?.message?.content || "No se pudo generar respuesta.";
    setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
  } catch (error) {
    console.error("Error de red:", error);
    setMessages((prev) => [...prev, { sender: "bot", text: "Error al conectar con OpenRouter." }]);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl flex flex-col h-[650px] overflow-hidden">
        {/* Header */}
        <div className="bg-black text-orange-400 p-4 text-center font-semibold text-lg">
        INGELEAN
        </div>

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className="flex items-end gap-2 max-w-[80%]">
                {msg.sender === "bot" && <Bot className="w-6 h-6 text-orange-400 " />}
                <div
                  className={`px-4 py-2 rounded-2xl text-sm whitespace-pre-line ${
                    msg.sender === "user"
                      ? "bg-orange-400  text-white rounded-br-none"
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
  className={`bg-orange-400  text-white px-4 py-2 rounded-full ${
    loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
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
