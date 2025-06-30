import type React from "react";
import { useRef, useState } from "react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { MessageSquare, Home, MessageCircle } from "lucide-react";
import Message from "./Message";
import HomePage from "./Home";
import IframeComponent from "./IframeComponent";

type PopoverPage = "home" | "message";

const MessageButton = () => {
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<PopoverPage>("home");
  const [currentUrl, setCurrentUrl] = useState("https://www.mulphilog.com/");
  const [message, setMessage] = useState("");
  const [initialQuery, setInitialQuery] = useState<string | undefined>();
  const [isLoading, _setIsLoading] = useState(false);
  const [timeoutState, _setTimeoutState] = useState(false);
  const hasUsedInitialQuery = useRef(false);

  const navigateTo = (page: PopoverPage) => {
    setCurrentPage(page);
  };

  const sendMessage = (customMessage?: string) => {
    const query = customMessage || message.trim();
    if (!query) return;

    hasUsedInitialQuery.current = false;
    setInitialQuery(query);
    setMessage("");
    setCurrentPage("message");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case "message":
        return (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
              <Message
                initialQuery={initialQuery}
                onUrlDetected={(url) => setCurrentUrl(url)}
                hasUsedInitialQuery={hasUsedInitialQuery}
              />
            </div>
            <div className="flex justify-around bg-white rounded-b-2xl sticky bottom-0">
              <Button
                variant="ghost"
                className="flex flex-col items-center gap-1 h-auto text-gray-500 hover:text-[#f46117] cursor-pointer"
                onClick={() => navigateTo("home")}
              >
                <Home className="h-6 w-6" />
                <span className="font-medium">Home</span>
              </Button>
              <Button
                variant="ghost"
                className="flex flex-col items-center gap-1 h-auto text-[#f46117] cursor-pointer"
                onClick={() => navigateTo("message")}
              >
                <MessageCircle className="h-6 w-6" />
                <span className="font-medium">Messages</span>
              </Button>
            </div>
          </div>
        );

      default: // 'home'
        return (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
              <HomePage
                onCardClick={(content) => sendMessage(content)}
                message={message}
                isLoading={isLoading}
                timeoutState={timeoutState}
                setMessage={setMessage}
                handleKeyDown={handleKeyDown}
                sendMessage={sendMessage}
              />
            </div>
            <div className="flex justify-around bg-white rounded-b-2xl sticky bottom-0">
              <Button
                variant="ghost"
                className="flex flex-col items-center gap-1 h-auto text-[#f46117] cursor-pointer hover:text-[#f46117]"
                onClick={() => navigateTo("home")}
              >
                <Home className="h-6 w-6" />
                <span className="font-medium">Home</span>
              </Button>
              <Button
                variant="ghost"
                className="flex flex-col items-center gap-1 h-auto text-gray-500 hover:text-[#f46117] cursor-pointer"
                onClick={() => navigateTo("message")}
              >
                <MessageCircle className="h-6 w-6" />
                <span className="font-medium">Messages</span>
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center py-8 px-4 py-0 text-white h-full">
      <div className="w-full max-w-4xl text-center mt-2">
        <div className="inline-block bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-transparent">
            This is not the Official M&P Website
          </h1>
        </div>
      </div>

      <IframeComponent currentUrl={currentUrl} />

      <div className="fixed bottom-8 right-8 z-50">
        {!open && (
          <div className="absolute -top-4 -left-24 flex items-center gap-2">
            <span className="text-2xl text-orange-400 bg-gray-800 px-2 py-1 rounded-lg shadow border border-gray-700 animate-bounce">
              Try me!
            </span>
          </div>
        )}

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger>
            <Button
              className={`h-14 w-14 rounded-full shadow-xl cursor-pointer transition-all duration-300 ${
                !open ? "hover:scale-110" : ""
              } bg-gradient-to-br from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 p-0 flex items-center justify-center`}
              aria-label="Open chat"
              onClick={() => setOpen(!open)}
            >
              <MessageSquare className="h-6 w-6 text-white" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-80 sm:w-96 p-0 rounded-2xl border border-gray-700 shadow-2xl bg-gray-900 overflow-hidden"
            align="end"
            side="top"
            style={{ maxHeight: "calc(100vh - 95px)" }}
            onInteractOutside={(e) => {
              // Prevent closing when clicking on the button
              const target = e.target as HTMLElement;
              if (target.closest(".fixed.bottom-8.right-8")) {
                e.preventDefault();
              }
            }}
          >
            <div className="flex flex-col h-[500px]">{renderPage()}</div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default MessageButton;
