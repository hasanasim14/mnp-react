import { useRef } from "react";
import { Textarea } from "./ui/textarea";
import { ArrowUp, Clock } from "lucide-react";

interface TextAreaMessageProps {
  message: string;
  isLoading: boolean;
  timeoutState?: boolean;
  setMessage: (message: string) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  sendMessage?: () => void;
}

export const TextAreaMessage = ({
  message,
  isLoading,
  timeoutState,
  setMessage,
  handleKeyDown,
  sendMessage = () => {},
}: TextAreaMessageProps) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="px-4 py-2 border-t bg-white">
      <div className="bg-gray-100 rounded-3xl p-2 flex items-center border border-gray-300">
        <Textarea
          ref={inputRef}
          placeholder="Message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full resize-none bg-transparent text-sm placeholder-gray-500 focus-visible:ring-0 border-none shadow-none px-0 py-1 h-auto max-h-[100px] min-h-[24px] overflow-y-auto"
          disabled={isLoading || timeoutState}
          rows={1}
        />
        <button
          onClick={sendMessage}
          disabled={isLoading || !message.trim()}
          className={`flex items-center justify-center rounded-full p-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
            message.trim()
              ? "bg-[#f46117] hover:bg-[#e05615]"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {isLoading ? (
            <Clock
              className={`h-5 w-5 ${
                message.trim() ? "text-white" : "text-gray-500"
              }`}
            />
          ) : (
            <ArrowUp
              className={`h-5 w-5 ${
                message.trim() ? "text-white" : "text-gray-500"
              }`}
            />
          )}
        </button>
      </div>
    </div>
  );
};
