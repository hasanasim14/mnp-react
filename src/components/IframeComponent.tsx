import { useState, useEffect } from "react";
import { useMediaQuery } from "../hooks/use-mobile";

type IframeComponentProps = {
  currentUrl: string;
};

const IframeComponent = ({ currentUrl }: IframeComponentProps) => {
  const [loading, setLoading] = useState(true);
  const [iframeHeight, setIframeHeight] = useState("600px");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");

  // Adjust height based on screen size
  useEffect(() => {
    const updateHeight = () => {
      const viewportHeight = window.innerHeight;
      if (isMobile) {
        setIframeHeight(`${viewportHeight * 0.6}px`); // 60% of viewport height on mobile
      } else if (isTablet) {
        setIframeHeight(`${viewportHeight * 0.7}px`); // 70% of viewport height on tablet
      } else {
        setIframeHeight(`${viewportHeight * 0.8}px`); // 80% of viewport height on desktop
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [isMobile, isTablet]);

  // Handle iframe load event
  const handleIframeLoad = () => {
    setLoading(false);
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto my-5 relative">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg z-10">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-[#f46117] rounded-full animate-spin mb-3"></div>
          <p className="text-gray-700 dark:text-gray-300">Loading content...</p>
        </div>
      )}
      <div
        className="w-full rounded-lg overflow-hidden shadow-lg"
        style={{ height: iframeHeight }}
      >
        <iframe
          src={currentUrl}
          title="M&P Support"
          width="100%"
          height="100%"
          onLoad={handleIframeLoad}
          className="border-none transition-opacity duration-300"
          style={{
            opacity: loading ? 0 : 1,
          }}
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default IframeComponent;
