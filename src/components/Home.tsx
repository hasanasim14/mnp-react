import type React from "react";
import { TextAreaMessage } from "./TextAreaMessage";
import {
  Briefcase,
  Calculator,
  ChevronRight,
  Info,
  LocateFixed,
  Package,
  Rocket,
  Sparkles,
} from "lucide-react";

interface HomePageProps {
  onCardClick?: (content: string) => void;
  message: string;
  isLoading: boolean;
  timeoutState: boolean;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  sendMessage: (customMessage?: string) => void;
}

export default function HomePage({
  onCardClick,
  message,
  isLoading,
  timeoutState,
  setMessage,
  handleKeyDown,
  sendMessage,
}: HomePageProps) {
  const cardItems = [
    {
      text: "Which Service should I choose?",
      icon: <Package className="h-5 w-5 text-[#f46117]" />,
      query: "Which service should I choose?",
    },
    {
      text: "Calculate Price",
      icon: <Calculator className="h-5 w-5 text-[#f46117]" />,
      query: "I would like to request a quote for shipment",
    },
    {
      text: "Generate QSR",
      icon: <Sparkles className="h-5 w-5 text-[#f46117]" />,
      query: "I would like to generate a QSR",
    },
    {
      text: "Launch Complain",
      icon: <Rocket className="h-5 w-5 text-[#f46117]" />,
      query: "I would like to launch a complain",
    },
    {
      text: "Track & Trace",
      icon: <LocateFixed className="h-5 w-5 text-[#f46117]" />,
      query: "I would like to trace a consignment",
    },
    {
      text: "About M&P",
      icon: <Info className="h-5 w-5 text-[#f46117]" />,
      query: "Tell me about M&P",
    },
    {
      text: "Job Opportunities",
      icon: <Briefcase className="h-5 w-5 text-[#f46117]" />,
      query: "How can I apply for a job with M&P",
    },
  ];

  const handleCardClick = (content: string) => {
    onCardClick?.(content);
  };

  return (
    <div className="flex flex-col h-full max-h-screen bg-gradient-to-br from-[#f46117] via-[#ff8c42] to-[#ffa726]">
      <div className="px-4 py-4 border-b border-white/20 backdrop-blur overflow-y-auto">
        <h2 className="text-xl font-semibold mb-0 text-white drop-shadow-sm">
          👋 How can I help you today?
        </h2>

        <div className="flex-1 px-4 py-2">
          <div className="flex gap-4 mb-4"></div>

          <div className="max-w-sm mx-auto bg-white/95 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {cardItems.map((item, index) => (
                <li
                  key={index}
                  onClick={() => handleCardClick(item.query)}
                  className="flex items-center justify-between p-2 group hover:bg-gray-50/80 transition-colors duration-300 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span className="text-gray-800 font-medium">
                      {item.text}
                    </span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 stroke-[3] transition-colors duration-200 group-hover:text-[#f46117]" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0">
        <TextAreaMessage
          message={message}
          isLoading={isLoading}
          timeoutState={timeoutState}
          setMessage={setMessage}
          handleKeyDown={handleKeyDown}
          sendMessage={sendMessage}
        />
      </div>
    </div>
  );
}
