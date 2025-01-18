import { useState } from "react";
import { cn } from "@/lib/utils";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
}

const Image = ({ src, alt, className, fallback = "/placeholder.svg", ...props }: ImageProps) => {
  const [error, setError] = useState(false);

  return (
    <img
      src={error ? fallback : src}
      alt={alt}
      className={cn("transition-opacity duration-300", className)}
      onError={() => setError(true)}
      {...props}
    />
  );
};

export default Image;