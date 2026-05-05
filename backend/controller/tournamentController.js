import uuid4 from "uuid4";
import tournamentSchema from "../model/tournamentSchema.js";
import organizerSchema from "../model/organizerSchema.js";

/* ================= CREATE TOURNAMENT ================= */

export const createTournamentController = async (req, res) => {
  try {
    let {
      tournamentName,
      venue,
      gameTitle,
      description,
      maxParticipants,
      tournamentDate,
      reportingTime,
      gameCategory
    } = req.body;

    // ✅ Normalize gameTitle (🔥 IMPORTANT FIX)
    if (gameTitle) {
      gameTitle = gameTitle.split(" ")[0]; 
      // "BGMI Esports" → "BGMI"
    }

    // ✅ Required field check
    if (
      !tournamentName ||
      !venue ||
      !gameTitle ||
      !description ||
      !maxParticipants ||
      !tournamentDate ||
      !reportingTime ||
      !gameCategory
    ) {
      return res.status(400).send({
        message: "All fields are required"
      });
    }

    // ✅ Text validation
    const isValidText = (text) =>
      /^[a-zA-Z0-9\s,.-]+$/.test(text);

    if (!isValidText(tournamentName)) {
      return res.status(400).send({ message: "Invalid tournament name" });
    }

    if (!isValidText(venue)) {
      return res.status(400).send({ message: "Invalid venue" });
    }

    // ✅ Game validation
    const validGames = ["Cricket", "Football", "BGMI", "Valorant", "CSGO"];

    if (!validGames.includes(gameTitle)) {
      return res.status(400).send({
        message: "Invalid game selected"
      });
    }

    // ✅ Description validation
    if (description.length < 10) {
      return res.status(400).send({
        message: "Description must be at least 10 characters"
      });
    }

    // ✅ Participants validation
    if (Number(maxParticipants) <= 0) {
      return res.status(400).send({
        message: "Participants must be greater than 0"
      });
    }

    // ✅ Create object
    const tournamentObj = {
      ...req.body,
      gameTitle, // 🔥 use normalized value
      tournamentId: uuid4()
    };

    await tournamentSchema.create(tournamentObj);

    res.status(200).send({
      message: "Tournament created successfully"
    });

  } catch (error) {
    console.log("Error in createTournamentController:", error);
    res.status(500).send("Internal Server Error");
  }
};

/* ================= VIEW ALL TOURNAMENTS ================= */
export const viewTournamentListController = async (request, response) => {
  try {
    const tournaments = await tournamentSchema.find().lean();

    for (let t of tournaments) {
      const organizer = await organizerSchema.findOne({
        _id: t.organizerEmail
      });

      t.organizerName = organizer?.organizerName || "";
      t.organizerContact = organizer?.contact || "";
    }

    response.status(200).send(tournaments);

  } catch (error) {
    console.log("Error in viewTournamentListController:", error);
    response.status(500).send("Internal Server Error");
  }
};

/* ================= ASSIGN ADMIN (OPTIONAL) ================= */
export const assignAdminController = async (request, response) => {
  try {
    const { tournamentId, adminEmail } = request.body;

    await tournamentSchema.updateOne(
      { tournamentId },
      { $set: { assignedAdminId: adminEmail } }
    );

    response.status(200).send({
      message: "Admin assigned successfully"
    });

  } catch (error) {
    console.log("Error in assignAdminController:", error);
    response.status(500).send("Internal Server Error");
  }
};


/* ================= TOURNAMENT LIST (PUBLIC) ================= */
export const tournamentListController = async (request, response) => {
  try {
    const tournamentList = await tournamentSchema.find({
      status: true,
      registrationOpen: true
    });

    response.status(200).send({ tournamentList });

  } catch (error) {
    console.log("Error in tournamentListController:", error);
    response.status(500).send("Internal Server Error");
  }
};