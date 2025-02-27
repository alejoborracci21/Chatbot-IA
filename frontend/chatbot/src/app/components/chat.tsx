"use client"

import { useState } from "react"
import axios from "axios"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2 } from "lucide-react"

interface Message {
  text: string
  type: "user" | "bot"
}

const Chat = () => {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = async () => {
    if (!input.trim()) return
    setError(null)

    const userMessage: Message = { text: input, type: "user" }
    setMessages((prev) => [...prev, userMessage])

    setInput("")
    setLoading(true)

    try {
      const response = await axios.post("/api/chat", { message: input })

      if (response.data && response.data.response) {
        const botMessage: Message = {
          text: response.data.response,
          type: "bot",
        }

        setMessages((prev) => [...prev, botMessage])
      } else {
        throw new Error("Respuesta no válida de la API")
      }
    } catch (err) {
      console.error("Error en la solicitud:", err)
      setError("Hubo un problema con el chatbot. Inténtalo más tarde.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Chatbot con IA</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] w-full pr-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 my-1 rounded-lg ${
                msg.type === "user" ? "bg-primary text-primary-foreground ml-auto" : "bg-muted"
              } max-w-[80%] ${msg.type === "user" ? "text-right" : "text-left"}`}
            >
              {msg.text}
            </div>
          ))}
        </ScrollArea>
        {error && <p className="text-destructive text-sm mt-2">{error}</p>}
      </CardContent>
      <CardFooter>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            sendMessage()
          }}
          className="flex w-full gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu mensaje..."
            disabled={loading}
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Enviar"}
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}

export default Chat

