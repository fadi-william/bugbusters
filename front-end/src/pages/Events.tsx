import { useEffect, useState } from "react";
import { IEventModel, fetchEvents } from "@/services/events";
import Layout from "@/components/layout/Layout";
import NoEvents from "@/components/domain/events/list/NoEvents";
import EventCard from "@/components/domain/events/list/EventCard";
import CreateEventDialog from "@/components/domain/events/create/CreateEventDialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/use/auth";
import LoadingData from "@/components/generic/LoadingData";

const Events = () => {
  const [events, setEvents] = useState<IEventModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const { isLoggedIn } = useAuth();

  const fetchEventsData = async () => {
    try {
      setLoading(true);
      const data = await fetchEvents();
      setEvents(data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventsData();
  }, []);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = async () => {
    setDialogOpen(false);
    await fetchEventsData();
    console.log("Events refetched!");
  };

  return (
    <Layout>
      {loading && <LoadingData />}
      {!loading && events.length === 0 && <NoEvents />}
      {!loading && events.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
      {isLoggedIn && (
        <Button
          className="fixed bottom-4 right-4 text-white rounded-full p-4 shadow-lg w-16 h-16 flex items-center justify-center"
          onClick={handleOpenDialog}
        >
          +
        </Button>
      )}
      <CreateEventDialog isOpen={isDialogOpen} onClose={handleCloseDialog} />
    </Layout>
  );
};

export default Events;
