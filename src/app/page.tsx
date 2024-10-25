'use client'
import {useState} from 'react'
import { useMutation, useQuery} from 'convex/react'
import {api} from "../../convex/_generated/api"

export default function Home() {

  const messages = useQuery(api.functions.messages.list)
  const createMessage = useMutation(api.functions.messages.create)

  const [input,setInput] = useState("")

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    createMessage({sender: "Alice", content: input})
    setInput("")
  }

  return (
        <div>
          {messages?.map((message, index) => (
            <div key={index}>
              <strong>{message.sender}:</strong> {message.content}
            </div>
          ))}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="message"
              id="message"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit">Send</button>
          </form>
        </div>

  );
}
