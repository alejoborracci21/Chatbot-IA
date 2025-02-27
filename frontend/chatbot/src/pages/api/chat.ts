import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosError } from "axios";

const HF_API_KEY = process.env.HF_API_KEY; // Clave de Hugging Face
const MODEL_URL = process.env.MODEL_URL; // URL del modelo

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "El mensaje es requerido" });
    }

    // Realizar la solicitud a la API de Hugging Face
    const apiResponse = await axios.post(
      String(MODEL_URL),
      { inputs: message },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Respuesta de Hugging Face:", apiResponse.data); // Log de respuesta

    // Acceder al primer objeto del array y obtener el campo 'generated_text'
    if (apiResponse.data && apiResponse.data[0]?.generated_text) {
      const generatedText = apiResponse.data[0].generated_text;
      return res.status(200).json({ response: generatedText });
    } else {
      console.error("No se pudo generar una respuesta válida:", apiResponse.data);
      return res.status(500).json({ error: "No se pudo generar una respuesta válida." });
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error en la API de Hugging Face:", error.response?.data || error.message);
    } else {
      console.error("Error en el servidor:", error);
    }
    return res.status(500).json({ error: "Error en la API" });
  }
}
