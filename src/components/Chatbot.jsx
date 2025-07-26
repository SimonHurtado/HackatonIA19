import { useState, useRef, useEffect } from "react";
import { Bot, User, ChevronDown, ChevronUp, MessageSquare, X } from "lucide-react";
import { db } from "../firebase/firebase";
import {
  collection,
  addDoc,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

function Chatbot() {
  const generateId = () => crypto.randomUUID();
  const [isOpen, setIsOpen] = useState(false);
  const [conversationId, setConversationId] = useState(null);

  useEffect(() => {
    const newId = generateId();
    setConversationId(newId);
    localStorage.setItem("current-conversation-id", newId);
  }, []);

  const [messages, setMessages] = useState([
    { sender: "bot", text: "¡Hola soy Inge! ¿En qué puedo ayudarte hoy?" },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const [showMetrics, setShowMetrics] = useState(false);

  const [metrics, setMetrics] = useState({
    totalUserMessages: 0,
    totalBotMessages: 1,
    lastResponseTime: 0,
    averageResponseTime: 0,
  });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const saveMessageToFirestore = async (msg, convId) => {
    try {
      await addDoc(collection(db, "conversations", convId, "messages"), {
        ...msg,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error("❌ Error al guardar mensaje en Firestore:", error);
    }
  };

  const saveMetrics = async (metrics, convId) => {
    try {
      await setDoc(
        doc(db, "conversations", convId),
        {
          metrics,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error("❌ Error al guardar métricas en Firestore:", error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    const updatedHistory = [...messages, userMessage];
    setMessages(updatedHistory);
    setInput("");
    setLoading(true);

    await saveMessageToFirestore(userMessage, conversationId);

    const startTime = performance.now();

    try {
      const response = await fetch(
        "https://us-central1-hackatongrupo19.cloudfunctions.net/chatbot",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input, history: updatedHistory }),
        }
      );

      const endTime = performance.now();
      const duration = endTime - startTime;
      const data = await response.json();
      const reply = data.reply || "No se pudo generar respuesta.";
      const botMessage = { sender: "bot", text: reply };

      setMessages((prev) => [...prev, botMessage]);
      await saveMessageToFirestore(botMessage, conversationId);

      const totalBot = metrics.totalBotMessages + 1;
      const totalUser = metrics.totalUserMessages + 1;
      const average =
        ((metrics.averageResponseTime * (totalBot - 1)) + duration) / totalBot;

      const updatedMetrics = {
        totalUserMessages: totalUser,
        totalBotMessages: totalBot,
        lastResponseTime: duration,
        averageResponseTime: average,
      };

      setMetrics(updatedMetrics);
      await saveMetrics(updatedMetrics, conversationId);
    } catch (error) {
      console.error("Error al conectar con la API:", error);
      const errorMsg = { sender: "bot", text: "Error al conectar con el servidor." };
      setMessages((prev) => [...prev, errorMsg]);
      await saveMessageToFirestore(errorMsg, conversationId);
    } finally {
      setLoading(false);
    }
  };

  const resetConversation = () => {
    const newId = generateId();
    setConversationId(newId);
    localStorage.setItem("current-conversation-id", newId);

    const initialMsg = { sender: "bot", text: "¡Hola soy Inge Bot! ¿En qué puedo ayudarte hoy?" };
    setMessages([initialMsg]);
    setMetrics({
      totalUserMessages: 0,
      totalBotMessages: 1,
      lastResponseTime: 0,
      averageResponseTime: 0,
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-orange-400 text-white p-3 rounded-full shadow-lg hover:bg-orange-500 transition"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {isOpen && (
        <div className="w-80 sm:w-96 h-[600px] bg-white rounded-xl shadow-xl flex flex-col overflow-hidden border border-gray-300">
          <div className="bg-black text-orange-400 p-3 font-semibold flex justify-between items-center">
            INGELEAN
            <button onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5 text-white hover:text-red-500" />
            </button>
          </div>

          <button
            onClick={() => setShowMetrics(!showMetrics)}
            className="flex justify-between items-center bg-gray-100 px-4 py-2 text-sm text-gray-800 hover:bg-gray-200 transition"
          >
            <span className="font-medium">Métricas del chat</span>
            {showMetrics ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showMetrics && (
            <div className="bg-white border-b border-gray-200 px-4 py-2 text-sm text-gray-700">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-2">
                <div><span className="font-semibold">⏱ Última:</span><div>{metrics.lastResponseTime.toFixed(0)} ms</div></div>
                <div><span className="font-semibold">💬 Usuario:</span><div>{metrics.totalUserMessages}</div></div>
                <div><span className="font-semibold">🤖 IA:</span><div>{metrics.totalBotMessages}</div></div>
                <div><span className="font-semibold">📈 Promedio:</span><div>{metrics.averageResponseTime.toFixed(0)} ms</div></div>
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

          <div className="p-3 border-t bg-white flex items-center gap-2">
            <input
              type="text"
              className="flex-1 border border-gray-300 text-black rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
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
