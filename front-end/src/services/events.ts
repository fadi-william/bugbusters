import api from "@/services/axios"; // Import axios instance

// Define the Event interface
export interface IEventModel {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
}

// Define a type for the event data that extends FormData
export interface ICreateEventData {
  title: string;
  description: string;
  date: string;
  image: File;
}

// Function to fetch events
export const fetchEvents = async (): Promise<IEventModel[]> => {
  try {
    const response = await api.get("/events/");
    return response.data; // Return the events data
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error; // Rethrow the error for handling in the component
  }
};

// Function to create an event
export const createEvent = async (
  createEvent: ICreateEventData,
): Promise<IEventModel> => {
  try {
    const eventData = new FormData();
    eventData.append("title", createEvent.title);
    eventData.append("description", createEvent.description);
    eventData.append("date", createEvent.date);
    eventData.append("image", createEvent.image);

    const response = await api.post<IEventModel>("/events/", eventData, {
      headers: {
        "Content-Type": "multipart/form-data", // Set the content type for form-data
      },
    });
    return response.data; // Return the created event data
  } catch (error) {
    console.error("Error creating event:", error);
    throw error; // Rethrow the error for handling in the component
  }
};
