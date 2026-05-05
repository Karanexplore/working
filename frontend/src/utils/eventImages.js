export const eventImages = {
  // ⚽ Sports
  cricket: "/images/cricket.png",
  football: "/images/football.png",
  badminton: "/images/badminton.png",
  chess: "/images/chess.png",
  kabaddi: "/images/kabaddi.png",
  karate: "/images/karate.png",
  volleyball: "/images/volleyball.png",
  basketball: "/images/basketball.png",
  tabletennis: "/images/tabletennis.png",
  athletics: "/images/athletics.png",
  swimming: "/images/swimming.png",
  sports: "/images/sports.png",

  // 🎮 Esports
  bgmi: "/images/bgmi.png",
  freefire: "/images/freefire.png",
  valorant: "/images/valorant.png",
  cod: "/images/cod.png",
  gaming: "/images/gaming.png",

  // 🎭 Cultural
  dance: "/images/dance.png",
  singing: "/images/singing.png",
  drama: "/images/drama.png",
  fashion: "/images/fashion.png",
  music: "/images/singing.png",

  // 💻 Technical
  coding: "/images/coding.png",
  hackathon: "/images/hackathon.png",
  debugging: "/images/debugging.png",
  robotics: "/images/robotics.png",
  quiz: "/images/coding.png",

  // 🎤 Others
  debate: "/images/debate.png",
  workshop: "/images/workshop.png",
  seminar: "/images/seminar.png",
  presentation: "/images/presentation.png",
  event: "/images/event.png",

  // 🖼️ Default
  default: "/images/defaultEvent.png",
};

/**
 * Fully dynamic image resolver.
 * Pass gameTitle OR tournamentName — it will find the best match.
 */
export const getEventImage = (gameTitle = "", tournamentName = "") => {
  const key = (gameTitle + " " + tournamentName).toLowerCase().trim();

  // Sports
  if (key.includes("cricket")) return eventImages.cricket;
  if (key.includes("football")) return eventImages.football;
  if (key.includes("badminton")) return eventImages.badminton;
  if (key.includes("chess")) return eventImages.chess;
  if (key.includes("kabaddi")) return eventImages.kabaddi;
  if (key.includes("karate")) return eventImages.karate;
  if (key.includes("volleyball")) return eventImages.volleyball;
  if (key.includes("basketball")) return eventImages.basketball;
  if (key.includes("table tennis") || key.includes("tabletennis")) return eventImages.tabletennis;
  if (key.includes("athletics")) return eventImages.athletics;
  if (key.includes("swimming")) return eventImages.swimming;

  // Esports
  if (key.includes("bgmi")) return eventImages.bgmi;
  if (key.includes("free fire") || key.includes("freefire")) return eventImages.freefire;
  if (key.includes("valorant")) return eventImages.valorant;
  if (key.includes("cod") || key.includes("call of duty")) return eventImages.cod;
  if (key.includes("gaming") || key.includes("esports")) return eventImages.gaming;

  // Cultural
  if (key.includes("dance")) return eventImages.dance;
  if (key.includes("singing") || key.includes("music")) return eventImages.singing;
  if (key.includes("drama")) return eventImages.drama;
  if (key.includes("fashion")) return eventImages.fashion;

  // Technical
  if (key.includes("hackathon")) return eventImages.hackathon;
  if (key.includes("debug")) return eventImages.debugging;
  if (key.includes("robotics")) return eventImages.robotics;
  if (key.includes("coding") || key.includes("code")) return eventImages.coding;
  if (key.includes("quiz")) return eventImages.quiz;

  // Others
  if (key.includes("debate")) return eventImages.debate;
  if (key.includes("workshop")) return eventImages.workshop;
  if (key.includes("seminar")) return eventImages.seminar;
  if (key.includes("presentation")) return eventImages.presentation;

  // Default fallback
  return eventImages.default;
};


