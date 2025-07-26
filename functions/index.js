const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const cors = require("cors")({ origin: true });


const OPENROUTER_API_KEY = "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";

const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

exports.chatbot = onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send("Método no permitido");
    }

    const { input, history } = req.body;

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`, // 👈 Usamos la constante
          "Content-Type": "application/json",
          "HTTP-Referer": "https://hackatongrupo19.web.app/",
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
Responde de forma corta a las preguntas del usuario.

Información sobre INGELEAN:
- Empresa ubicada en Pereira, Risaralda (Colombia)
- Especializada en: automatización industrial, desarrollo de software a medida, inteligencia artificial y mantenimiento de equipos industriales.
- Atiende empresas principalmente en el Eje Cafetero.
- Ofrece servicios personalizados para optimizar procesos industriales y comerciales.
- No tiene tienda física abierta al público.
- Se enfoca en soluciones B2B (empresa a empresa).


FAQ (Solo cuando pregunte):
¿Dónde están ubicados?
En Pereira, Risaralda – Colombia.
Dirección
Cl. 29 #10-23, La victoria, Pereira, Risaralda


¿Atienden al público?
No, solo trabajamos con empresas.

¿Tienen tienda física?
No, todo es virtual o en sitio según el proyecto.

¿En qué zonas prestan servicio?
Principalmente en el Eje Cafetero.

¿Qué servicios ofrecen?
Automatización industrial, desarrollo de software a medida, inteligencia artificial y mantenimiento de equipos industriales.

¿Trabajan con inteligencia artificial?
Sí, usamos IA para mejorar procesos empresariales.

¿Diseñan software personalizado?
Sí, según las necesidades de cada cliente.

¿Realizan mantenimiento industrial?
Sí, tanto preventivo como correctivo.

¿Hacen visitas técnicas?
Sí, para empresas ubicadas en el Eje Cafetero.

¿Cuánto cuesta un proyecto?
Depende del alcance. Hacemos cotizaciones sin costo.

¿Tienen soporte técnico?
Sí, ofrecemos soporte según el servicio contratado.

¿Hacen automatización de procesos existentes?
Sí, podemos optimizar líneas ya instaladas.

¿Desarrollan sistemas de control?
Sí, adaptados a cada proceso industrial.

¿Trabajan con empresas pequeñas?
Sí, si requieren soluciones B2B.

¿Puedo agendar una reunión?
Sí, coordinamos por correo o teléfono.

¿Cuánto tarda un desarrollo?
Varía según el proyecto. Lo definimos tras el análisis.

¿Ofrecen garantía en sus servicios?
Sí, según lo establecido en el contrato.

¿Pueden integrar sus sistemas con los míos?
Sí, analizamos compatibilidades antes del desarrollo.

¿Trabajan con PLCs?
Sí, en proyectos de automatización.

¿Cómo puedo contactarlos? (Solo cuando solicite contacto) 
Correo
comercial@ingelean.com
Números telefónicos
+(57) 321 549 28 72
+(57) 304 326 25 38







              `
            },
            ...history.map((msg) => ({
              role: msg.sender === "user" ? "user" : "assistant",
              content: msg.text
            })),
            { role: "user", content: input }
          ]
        })
      });

      const data = await response.json();
      console.log("🔍 OpenRouter respuesta:", data);

      if (!data.choices || !data.choices[0]) {
        return res.status(500).json({ error: "Respuesta inválida de OpenRouter", data });
      }

      res.json({ reply: data.choices[0].message.content });
    } catch (error) {
      logger.error("Error al conectar con OpenRouter", error);
      res.status(500).json({ error: "Fallo en la solicitud" });
    }
  });
});
