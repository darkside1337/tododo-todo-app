import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface MaxWidthWrapperProps {
  children: ReactNode;
  className?: string;
}

const MaxWidthWrapper = ({ children, className }: MaxWidthWrapperProps) => {
  return (
    <div className={cn("mx-auto px-4 max-w-screen-lg lg:px-8", className)}>
      {children}
    </div>
  );
};

export default MaxWidthWrapper;
