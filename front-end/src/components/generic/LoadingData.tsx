import { LoaderIcon } from "lucide-react";

const LoadingData = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] w-full flex flex-col items-center justify-center">
      <LoaderIcon className="animate-spin" />
    </div>
  );
};

export default LoadingData;
