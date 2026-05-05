import uuid4 from "uuid4";
import Ticket from "../model/ticketSchema.js";
import Tournament from "../model/tournamentSchema.js";
import moment from "moment";

/* ================= PRICE LOGIC ================= */
// Price is determined by event type
const getPriceByEventType = (eventType) => {
  const prices = {
    sports: 150,
    esports: 100,
    technical: 80,
    cultural: 120,
    workshop: 200,
    fest: 180
  };
  return prices[eventType] || 100;
};

/* ================= BOOK TICKET ================= */
export const bookTicketController = async (req, res) => {
  try {
    const participantEmail = req.participantPayload?.email;

    if (!participantEmail) {
      return res.status(401).json({ message: "Unauthorized participant" });
    }

    const { tournamentId, seatCount } = req.body;

    if (!tournamentId) {
      return res.status(400).json({ message: "Tournament ID is required" });
    }

    const seats = Number(seatCount);
    if (!seats || seats < 1 || seats > 10) {
      return res.status(400).json({ message: "Seat count must be between 1 and 10" });
    }

    // Find the tournament
    const tournament = await Tournament.findOne({ tournamentId });

    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }

    if (!tournament.status) {
      return res.status(400).json({ message: "This tournament is not available for booking" });
    }

    // Check if the event has already passed
    const eventDate = moment(tournament.tournamentDate, "YYYY-MM-DD").toDate();
    if (new Date() > eventDate) {
      return res.status(400).json({ message: "Cannot book tickets for a past event" });
    }

    // Check if participant already has tickets for this event
    const existingTicket = await Ticket.findOne({
      tournamentId,
      participantEmail,
      status: "confirmed"
    });

    if (existingTicket) {
      return res.status(400).json({
        message: "You already have tickets booked for this event. Cancel existing tickets first to rebook."
      });
    }

    const pricePerSeat = getPriceByEventType(tournament.eventType);
    const totalPrice = pricePerSeat * seats;

    const ticket = await Ticket.create({
      ticketId: uuid4(),
      tournamentId,
      tournamentName: tournament.tournamentName,
      participantEmail,
      seatCount: seats,
      pricePerSeat,
      totalPrice,
      venue: tournament.venue,
      eventDate: tournament.tournamentDate,
      status: "confirmed"
    });

    return res.status(200).json({
      message: "Tickets booked successfully!",
      ticket: {
        ticketId: ticket.ticketId,
        tournamentName: ticket.tournamentName,
        seatCount: ticket.seatCount,
        pricePerSeat: ticket.pricePerSeat,
        totalPrice: ticket.totalPrice,
        venue: ticket.venue,
        eventDate: ticket.eventDate,
        bookedAt: ticket.bookedAt,
        status: ticket.status
      }
    });

  } catch (error) {
    console.error("Book Ticket Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/* ================= GET MY TICKETS ================= */
export const getMyTicketsController = async (req, res) => {
  try {
    const participantEmail = req.participantPayload?.email;

    if (!participantEmail) {
      return res.status(401).json({ message: "Unauthorized participant" });
    }

    const tickets = await Ticket.find({ participantEmail })
      .sort({ _id: -1 })
      .lean();

    return res.status(200).json({ tickets });

  } catch (error) {
    console.error("Get My Tickets Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/* ================= GET TICKET PRICE (Preview before booking) ================= */
export const getTicketPriceController = async (req, res) => {
  try {
    const { tournamentId } = req.params;

    const tournament = await Tournament.findOne({ tournamentId });

    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }

    const pricePerSeat = getPriceByEventType(tournament.eventType);

    return res.status(200).json({
      tournamentId,
      tournamentName: tournament.tournamentName,
      eventType: tournament.eventType,
      pricePerSeat,
      venue: tournament.venue,
      eventDate: tournament.tournamentDate
    });

  } catch (error) {
    console.error("Get Ticket Price Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/* ================= CANCEL TICKET ================= */
export const cancelTicketController = async (req, res) => {
  try {
    const participantEmail = req.participantPayload?.email;

    if (!participantEmail) {
      return res.status(401).json({ message: "Unauthorized participant" });
    }

    const { ticketId } = req.params;

    const ticket = await Ticket.findOne({ ticketId, participantEmail });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (ticket.status === "cancelled") {
      return res.status(400).json({ message: "Ticket is already cancelled" });
    }

    // Check: cannot cancel within 24 hours of event
    const eventDate = moment(ticket.eventDate, "YYYY-MM-DD").toDate();
    const hoursUntilEvent = (eventDate - new Date()) / (1000 * 60 * 60);

    if (hoursUntilEvent < 24) {
      return res.status(400).json({
        message: "Cancellation is not allowed within 24 hours of the event"
      });
    }

    ticket.status = "cancelled";
    await ticket.save();

    return res.status(200).json({ message: "Ticket cancelled successfully" });

  } catch (error) {
    console.error("Cancel Ticket Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};