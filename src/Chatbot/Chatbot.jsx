import { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/chat", {
        message: userMsg.text, // <-- backend expects "message"
      });

      const botMsg = {
        sender: "bot",
        text: res.data.reply || "No reply received."
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "⚠ Server error! Please try again." }
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="h-screen w-full flex bg-gray-100">
      
      {/* LEFT SIDEBAR */}
      <div className="hidden md:flex flex-col w-64 bg-white shadow-lg p-6">
        <div className="text-center mb-6">
          <div className="h-20 w-20 mx-auto rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold">
            🤖
          </div>
          <h2 className="text-xl font-semibold mt-3">MJ AI</h2>
          <p className="text-green-500 text-sm">● Online</p>
        </div>

        <div className="mt-6 text-gray-500 text-sm leading-6">
          <h1 className="text-lg font-bold">Assalamu Alaikum.</h1>
           <h1 className="text-lg font-bold">I am MJ AI.</h1>
          {/* <p><strong>Creator:</strong> G M Mortuza</p> */}
          <p  className="text-lg font-semibold">Your Smart AI Assistant</p>
        </div>
      </div>

      {/* MAIN CHAT AREA */}
      <div className="flex-1 flex flex-col">

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-xl max-w-xs shadow 
                ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-800"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Loading animation */}
          {loading && (
            <div className="flex justify-start">
              <div className="px-4 py-2 bg-white rounded-xl shadow text-gray-500">
                <span className="animate-pulse">Typing...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef}></div>
        </div>

        {/* INPUT AREA */}
        <div className="p-4 bg-white border-t flex gap-3">
          <input
            type="text"
            value={input}
            placeholder="Type a message..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 border rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 active:scale-95 transition disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
