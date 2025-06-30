import type React from "react";
import { useState, useRef, useEffect } from "react";
import {
  setTempSessionID,
  getTempSessionID,
  getTempErrorMessage,
  setTempErrorMessage,
} from "../libs/tempStore";
import { TextAreaMessage } from "./TextAreaMessage";
import ReactMarkdown from "react-markdown";

interface MessageProps {
  initialQuery?: string;
  hasUsedInitialQuery?: React.MutableRefObject<boolean>;
}
type Message = {
  role: "user" | "assistant";
  content: string;
  source?: "history" | "agent";
};

const Message = ({ initialQuery, hasUsedInitialQuery }: MessageProps) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [_showHomePage, setShowHomePage] = useState(true);
  const [timeoutState, setTimeoutState] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevMessagesLength = useRef(0);
  const [hasLoadedExistingMessages, setHasLoadedExistingMessages] =
    useState(false);

  console.log("endpoint", import.meta.env.VITE_API_URL);

  const fetchExistingMessages = async (sessionId: string) => {
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + "/chatHistory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "CxzzU2s11eygP1RFICwzLiDlR",
        },
        body: JSON.stringify({ sessionid: sessionId }),
      });

      if (!res.ok) throw new Error("API Not working");

      const data = await res.json();

      const transformedMessages = data.map((msg: any) => ({
        role: msg.type === "user" ? "user" : "assistant",
        content: msg.content,
        source: "history",
      }));

      if (transformedMessages.length > 0) {
        setShowHomePage(false);
      }

      setMessages(transformedMessages);
      setHasLoadedExistingMessages(true);
    } catch (error) {
      console.error("Error", error);
      setHasLoadedExistingMessages(true);
    }
  };

  // Load existing messages on mount
  useEffect(() => {
    const sessionId = getTempSessionID();
    const error = getTempErrorMessage();

    if (sessionId) {
      fetchExistingMessages(sessionId);
    } else {
      setHasLoadedExistingMessages(true);
    }

    if (error) {
      setErrorMessage(error);
      setTimeoutState(true);
    }
  }, []);

  useEffect(() => {
    if (
      initialQuery &&
      hasUsedInitialQuery?.current === false &&
      hasLoadedExistingMessages
    ) {
      hasUsedInitialQuery.current = true;
      setShowHomePage(false);

      setMessages((prev) => {
        return [...prev, { role: "user", content: initialQuery }];
      });

      // Send to API
      sendMessageToAPI(initialQuery);
    }
  }, [initialQuery, hasLoadedExistingMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    if (messages.length > prevMessagesLength.current) {
      const newMessages = messages.slice(prevMessagesLength.current);

      newMessages.forEach((msg) => {
        if (msg.role === "assistant" && msg.source === "agent") {
          const urlRegex =
            /(?:https?:\/\/[^\s]+)|(?:\[([^\]]+)\]\((https?:\/\/[^\s)]+)\))/g;
          let match;

          while ((match = urlRegex.exec(msg.content)) !== null) {
            const url = match[2] || match[0];

            if (url) {
              window.open(url, "_blank");
            }
          }
        }
      });
    }

    prevMessagesLength.current = messages.length;
  }, [messages]);

  // Save cursor position
  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const sendMessageToAPI = async (userQuery: string) => {
    if (!userQuery || isLoading) return;

    setIsLoading(true);

    const timeout = 30 * 1000;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const res = await fetch(import.meta.env.VITE_API_URL + "/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "CxzzU2s11eygP1RFICwzLiDlR",
        },
        body: JSON.stringify({
          query: userQuery,
          sessionid: getTempSessionID(),
        }),
        signal: controller.signal,
      });

      if (!res.ok) throw new Error(`API responded with status: ${res.status}`);

      const data = await res.json();
      if (data?.success === false) {
        setTimeoutState(true);
        setErrorMessage(data?.message);
        setTempErrorMessage(data?.message);
      }

      if (data.data?.sessionID) {
        setTempSessionID(data?.data?.sessionID);
      }

      // Add assistant response to chat
      const assistantMessage =
        data.data?.Message || "I couldn't process that request.";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: assistantMessage, source: "agent" },
      ]);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("API Error:", error);
        const errorMessage =
          error.name === "AbortError"
            ? "Sorry, the chat API took too long to respond. Please try again later."
            : "Sorry, there was an error processing your request. Please try again at a later time";

        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: errorMessage, source: "agent" },
        ]);
      }
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  const sendMessage = async (customMessage?: string) => {
    const userQuery = customMessage || message.trim();

    if (!userQuery || isLoading) return;

    setShowHomePage(false);
    setMessages((prev) => [...prev, { role: "user", content: userQuery }]);
    setMessage("");

    await sendMessageToAPI(userQuery);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center p-4 border-b bg-white">
        <div className="flex items-center">
          <div>
            <h2 className="font-bold text-xl">M&P Support</h2>
          </div>
        </div>
      </div>

      {/* Error Bar */}
      {errorMessage && (
        <div className="bg-red-500 text-white px-4 py-2 text-sm font-medium">
          {errorMessage}
        </div>
      )}

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="p-4">
          <div className="space-y-4">
            {messages.map((msg, index) => {
              if (msg.role === "user") {
                return (
                  <div key={index} className="flex justify-end w-full">
                    <div className="bg-[#f46117] text-white text-sm rounded-lg px-4 py-2 max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl">
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div key={index} className="flex justify-start w-full">
                    <div className="bg-gray-200 text-gray-800 text-sm rounded-lg px-4 py-2 max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl">
                      <div className="whitespace-pre-wrap">
                        <ReactMarkdown
                          components={{
                            a: ({ node, ...props }) => (
                              <a
                                className="text-blue-600 underline hover:text-blue-800"
                                target="_blank"
                                rel="noopener noreferrer"
                                {...props}
                              />
                            ),
                            pre: ({ node, ...props }) => (
                              <pre
                                className="bg-gray-100 p-2 rounded my-2 overflow-x-auto"
                                {...props}
                              />
                            ),
                            code: ({ node, ...props }) => (
                              <code
                                className="bg-gray-100 rounded px-1 py-0.5"
                                {...props}
                              />
                            ),
                            strong: ({ node, ...props }) => (
                              <strong className="font-bold" {...props} />
                            ),
                            em: ({ node, ...props }) => (
                              <em className="italic" {...props} />
                            ),
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                );
              }
            })}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-800 rounded-lg px-4 py-2">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
                    <div
                      className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      <TextAreaMessage
        message={message}
        isLoading={isLoading}
        timeoutState={timeoutState}
        setMessage={setMessage}
        handleKeyDown={handleKeyDown}
        sendMessage={sendMessage}
      />
    </div>
  );
};
export default Message;
