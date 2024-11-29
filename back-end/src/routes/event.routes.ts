import { Router } from "express";
import upload from "../utils/multer-config";
import {
  createEvent,
  updateEvent,
  deleteEvent,
  getEvent,
  getAllEvents,
  registerForEvent,
  unregisterFromEvent,
  getUserRegisteredEvents,
} from "../controllers/event.controller";
import { authenticate } from "../middlewares/auth/jwt-mw";

const router = Router();

// Route to create a new event with image upload
router.post("/", authenticate, upload.single("image"), createEvent);

// Route to update an existing event with image upload
router.put("/:id", authenticate, upload.single("image"), updateEvent);

// Route to delete an existing event
router.delete("/:id", authenticate, deleteEvent);

// Route to get the users' registered events
router.get("/me/", authenticate, getUserRegisteredEvents);

// Route to get details of a specific event
router.get("/:id", getEvent);

// Route to get all events
router.get("/", getAllEvents);

// Route to register for an event
router.post("/:id/register", authenticate, registerForEvent);

// Route to unregister from an event
router.delete("/:id/unregister", authenticate, unregisterFromEvent);

export default router;
