import { useState } from "react";
import { cn } from "@/lib/utils";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
}

const Image = ({ src, alt, className, fallback = "/placeholder.svg", ...props }: ImageProps) => {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    console.error(`Failed to load image: ${src}`);
    setError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <img
      src={error ? fallback : src}
      alt={alt}
      className={cn(
        "transition-opacity duration-300",
        isLoading && "opacity-50",
        className
      )}
      onError={handleError}
      onLoad={handleLoad}
      {...props}
    />
  );
};

export default Image;