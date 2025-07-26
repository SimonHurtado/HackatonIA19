import React, { useEffect, useState } from 'react';
import { db } from '../firebase/firebase';
import { collection, getDocs, getDoc, doc } from 'firebase/firestore';

function Dashboard() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const convRef = collection(db, 'conversations');
        const snapshot = await getDocs(convRef);

        const data = await Promise.all(
          snapshot.docs.map(async (docSnap) => {
            const metrics = docSnap.data().metrics || {};
            const updatedAt = docSnap.data().updatedAt?.toDate().toLocaleString() || 'N/A';

            const messagesSnapshot = await getDocs(collection(db, 'conversations', docSnap.id, 'messages'));
            const messages = messagesSnapshot.docs.map((msgDoc) => msgDoc.data());

            return {
              id: docSnap.id,
              messages,
              metrics,
              updatedAt,
            };
          })
        );

        setConversations(data);
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
      <h1 className="text-2xl font-bold mb-4">Panel de Conversaciones</h1>

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
