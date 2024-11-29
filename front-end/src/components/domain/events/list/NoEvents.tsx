import { Ticket } from "lucide-react";

const NoEvents = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] w-full flex flex-col items-center justify-center">
      <div className="flex flex-col items-center">
        <Ticket className="h-12 w-12 mb-4" />
        <p className="text-center">No Events</p>
        <p className="text-center mt-2">There are currently no events to display.</p>
      </div>
    </div>
  );
};

export default NoEvents;
