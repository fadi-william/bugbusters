import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { CreateEventInput, UpdateEventInput } from "../models/event.model";
import logger from "../utils/logger";
import fs from "fs";
import path from "path";

export async function createEvent(req: Request, res: Response) {
  try {
    logger.info("Starting event creation process", { userId: req.user!.id });

    const eventData: CreateEventInput = req.body;

    // Validate required fields
    if (!eventData.title?.trim()) {
      return res.status(400).json({ error: "Title is required" });
    }

    if (!eventData.description?.trim()) {
      return res.status(400).json({ error: "Description is required" });
    }

    if (!eventData.date) {
      return res.status(400).json({ error: "Date is required" });
    }

    // Handle image upload
    if (req.file) {
      eventData.image = req.file.filename; // Set the image field to the uploaded file name
    }

    const event = await prisma.event.create({
      data: {
        ...eventData,
        creatorId: req.user!.id,
      },
    });

    logger.info("Event created successfully", {
      eventId: event.id,
      userId: req.user!.id,
    });
    return res.status(201).json(event);
  } catch (error) {
    logger.error("Error in event creation", { error, userId: req.user!.id });
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateEvent(req: Request, res: Response) {
  try {
    const eventId = parseInt(req.params.id);
    logger.info("Starting event update process", {
      eventId,
      userId: req.user!.id,
    });

    const eventData: UpdateEventInput = req.body;

    // Verify event exists and belongs to user
    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!existingEvent) {
      logger.warn("Update attempt on non-existent event", {
        eventId,
        userId: req.user!.id,
      });
      return res.status(404).json({ error: "Event not found" });
    }

    if (existingEvent.creatorId !== req.user!.id) {
      logger.warn("Unauthorized event update attempt", {
        eventId,
        userId: req.user!.id,
      });
      return res
        .status(403)
        .json({ error: "Not authorized to update this event" });
    }

    // Trim string inputs if they exist
    if (eventData.title) eventData.title = eventData.title.trim();
    if (eventData.description)
      eventData.description = eventData.description.trim();

    // Handle image upload
    if (req.file) {
      // Delete the old image if it exists
      if (existingEvent.image) {
        const oldImagePath = path.join(
          __dirname,
          "../../public/images",
          existingEvent.image,
        );
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            logger.error("Error deleting old image", { error: err });
          }
        });
      }
      eventData.image = req.file.filename; // Set the image field to the new uploaded file name
    }

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: eventData,
    });

    logger.info("Event updated successfully", {
      eventId,
      userId: req.user!.id,
    });
    return res.json(updatedEvent);
  } catch (error) {
    logger.error("Error in event update", {
      error,
      eventId: req.params.id,
      userId: req.user!.id,
    });
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function deleteEvent(req: Request, res: Response) {
  try {
    const eventId = parseInt(req.params.id);
    logger.info("Starting event deletion process", {
      eventId,
      userId: req.user!.id,
    });

    // Verify event exists and belongs to user
    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!existingEvent) {
      logger.warn("Delete attempt on non-existent event or unowned event", {
        eventId,
        userId: req.user!.id,
      });
      return res
        .status(404)
        .json({ error: "Event not found or not owned by the current user" });
    }

    if (existingEvent.creatorId !== req.user!.id) {
      logger.warn("Unauthorized event deletion attempt", {
        eventId,
        userId: req.user!.id,
      });
      return res
        .status(403)
        .json({ error: "Not authorized to delete this event" });
    }

    await prisma.event.delete({
      where: { id: eventId },
    });

    logger.info("Event deleted successfully", {
      eventId,
      userId: req.user!.id,
    });
    return res.status(204).send();
  } catch (error) {
    logger.error("Error in event deletion", {
      error,
      eventId: req.params.id,
      userId: req.user!.id,
    });
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getEvent(req: Request, res: Response) {
  try {
    const eventId = parseInt(req.params.id);
    logger.info("Fetching event details", { eventId });

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    if (!event) {
      logger.warn("Attempt to fetch non-existent event", { eventId });
      return res.status(404).json({ error: "Event not found" });
    }

    logger.info("Event details fetched successfully", { eventId });
    return res.json(event);
  } catch (error) {
    logger.error("Error fetching event details", {
      error,
      eventId: req.params.id,
    });
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getAllEvents(req: Request, res: Response) {
  try {
    logger.info("Fetching all events");

    const events = await prisma.event.findMany({
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    logger.info("Successfully fetched all events", { count: events.length });
    return res.json(events);
  } catch (error) {
    logger.error("Error fetching all events", { error });
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function registerForEvent(req: Request, res: Response) {
  const userId = req.user!.id; // Assuming req.user is populated with the authenticated user
  try {
    const eventId = parseInt(req.params.id);

    logger.info("Starting registration for event", { eventId, userId });

    // Verify event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      logger.warn("Registration attempt on non-existent event", { eventId });
      return res.status(404).json({ error: "Event not found" });
    }

    if (event.creatorId === userId) {
      logger.warn("Registration attempt by event creator", { eventId, userId });
      return res
        .status(403)
        .json({ error: "Event creator cannot register for their own event" });
    }

    // Check if the user is already registered
    const isRegistered = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscribedEvents: true },
    });

    if (isRegistered?.subscribedEvents.some((event) => event.id === eventId)) {
      return res
        .status(400)
        .json({ error: "User is already registered for this event" });
    }

    // Register the user for the event
    await prisma.user.update({
      where: { id: userId },
      data: {
        subscribedEvents: {
          connect: { id: eventId },
        },
      },
    });

    logger.info("User registered successfully for event", { eventId, userId });
    return res.status(200).json({ message: "Registered successfully" });
  } catch (error) {
    logger.error("Error in event registration", { error, userId });
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function unregisterFromEvent(req: Request, res: Response) {
  const userId = req.user!.id; // Assuming req.user is populated with the authenticated user
  try {
    const eventId = parseInt(req.params.id);

    logger.info("Starting unregistration from event", { eventId, userId });

    // Verify event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      logger.warn("Unregistration attempt on non-existent event", { eventId });
      return res.status(404).json({ error: "Event not found" });
    }

    if (event.creatorId === userId) {
      logger.warn("Unregistration attempt by event creator", {
        eventId,
        userId,
      });
      return res.status(403).json({
        error: "Event creator cannot unregister from their own event",
      });
    }

    // Unregister the user from the event
    await prisma.user.update({
      where: { id: userId },
      data: {
        subscribedEvents: {
          disconnect: { id: eventId },
        },
      },
    });

    logger.info("User unregistered successfully from event", {
      eventId,
      userId,
    });
    return res.status(200).json({ message: "Unregistered successfully" });
  } catch (error) {
    logger.error("Error in event unregistration", { error, userId });
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getUserRegisteredEvents(req: Request, res: Response) {
  const userId = req.user!.id; // Assuming req.user is populated with the authenticated user

  try {
    logger.info("Fetching registered events for user", { userId });

    // Fetch events the user is registered for
    const registeredEvents = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscribedEvents: {
          include: {
            creator: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!registeredEvents) {
      logger.warn("User not found", { userId });
      return res.status(404).json({ error: "User not found" });
    }

    logger.info("Successfully fetched registered events", {
      userId,
      count: registeredEvents.subscribedEvents.length,
    });
    return res.json(registeredEvents.subscribedEvents);
  } catch (error) {
    logger.error("Error fetching registered events", { error, userId });
    return res.status(500).json({ error: "Internal server error" });
  }
}
