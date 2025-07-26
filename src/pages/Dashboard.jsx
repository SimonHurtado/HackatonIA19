import React, { useEffect, useState } from 'react';
import { db } from '../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';

function Dashboard() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalConversations: 0,
    totalMessages: 0,
    totalUserMessages: 0,
    totalBotMessages: 0,
    totalWordsFromUsers: 0,
    averageResponseTime: 0,
  });

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const convRef = collection(db, 'conversations');
        const snapshot = await getDocs(convRef);

        let totalUserMessages = 0;
        let totalBotMessages = 0;
        let totalMessages = 0;
        let totalWordsFromUsers = 0;
        let responseTimeSum = 0;
        let responseCount = 0;

        const data = await Promise.all(
          snapshot.docs.map(async (docSnap) => {
            const metrics = docSnap.data().metrics || {};
            const updatedAt = docSnap.data().updatedAt?.toDate().toLocaleString() || 'N/A';

            const messagesSnapshot = await getDocs(collection(db, 'conversations', docSnap.id, 'messages'));
            const messages = messagesSnapshot.docs.map((msgDoc) => msgDoc.data());

            messages.forEach((msg) => {
              if (msg.sender === 'user') {
                totalUserMessages++;
                totalWordsFromUsers += msg.text.split(/\s+/).filter(Boolean).length;
              } else if (msg.sender === 'bot') {
                totalBotMessages++;
              }
            });

            if (metrics.averageResponseTime) {
              responseTimeSum += metrics.averageResponseTime;
              responseCount++;
            }

            totalMessages += messages.length;

            return {
              id: docSnap.id,
              messages,
              metrics,
              updatedAt,
            };
          })
        );

        setConversations(data);

        setSummary({
          totalConversations: data.length,
          totalMessages,
          totalUserMessages,
          totalBotMessages,
          totalWordsFromUsers,
          averageResponseTime: responseCount > 0 ? Math.round(responseTimeSum / responseCount) : 0,
        });
      } catch (error) {
        console.error('Error al obtener conversaciones:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Panel de Conversaciones</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <p className="text-sm text-gray-500">Conversaciones</p>
          <p className="text-xl font-bold text-orange-600">{summary.totalConversations}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <p className="text-sm text-gray-500">Mensajes totales</p>
          <p className="text-xl font-bold text-orange-600">{summary.totalMessages}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <p className="text-sm text-gray-500">Usuario</p>
          <p className="text-xl font-bold text-orange-600">{summary.totalUserMessages}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <p className="text-sm text-gray-500">IA</p>
          <p className="text-xl font-bold text-orange-600">{summary.totalBotMessages}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <p className="text-sm text-gray-500">Informacion recolectada</p>
          <p className="text-xl font-bold text-orange-600">{summary.totalWordsFromUsers}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <p className="text-sm text-gray-500">Promedio respuesta</p>
          <p className="text-xl font-bold text-orange-600">{summary.averageResponseTime} ms</p>
        </div>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {conversations.map((conv) => (
            <div key={conv.id} className="rounded-2xl shadow-md border bg-white p-4 space-y-2">
              <h2 className="font-semibold text-lg text-orange-600">
                Conversación ID: {conv.id.substring(0, 8)}...
              </h2>
              <p className="text-sm text-gray-600">Actualizado: {conv.updatedAt}</p>
              <div className="text-sm">
                <p><strong>Mensajes:</strong> {conv.messages.length}</p>
                <p><strong>Usuario:</strong> {conv.metrics.totalUserMessages || 0}</p>
                <p><strong>IA:</strong> {conv.metrics.totalBotMessages || 0}</p>
                <p><strong>Promedio respuesta:</strong> {Math.round(conv.metrics.averageResponseTime || 0)} ms</p>
              </div>
              <details className="text-sm mt-2">
                <summary className="cursor-pointer text-blue-500 hover:underline">Ver mensajes</summary>
                <ul className="list-disc list-inside mt-2 max-h-40 overflow-y-auto">
                  {conv.messages.map((msg, idx) => (
                    <li key={idx} className={`text-xs ${msg.sender === 'user' ? 'text-orange-600' : 'text-gray-800'}`}>
                      <strong>{msg.sender}:</strong> {msg.text}
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
