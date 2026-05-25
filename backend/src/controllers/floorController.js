import Floor from "../models/Floor.js";
import Section from "../models/Section.js";
import Room from "../models/Room.js";

export async function getFloors(req, res) {
  const floors = await Floor.find().sort({ level: 1 });
  const enriched = await Promise.all(
    floors.map(async (floor) => {
      const [sections, rooms] = await Promise.all([
        Section.find({ floor: floor._id }).sort({ sectionCode: 1 }),
        Room.find({ floor: floor._id })
      ]);
      return {
        ...floor.toObject(),
        sections,
        totalRooms: rooms.length,
        doneRooms: rooms.filter((room) => room.cleaningStatus === "Done").length,
        pendingRooms: rooms.filter((room) => room.cleaningStatus !== "Done").length
      };
    })
  );
  res.json(enriched);
}

export async function getSections(req, res) {
  const query = {};
  if (req.query.floor) {
    const floor = await Floor.findOne({ floorCode: req.query.floor });
    if (floor) query.floor = floor._id;
  }
  const sections = await Section.find(query).populate("floor").sort({ sectionCode: 1 });
  const enriched = await Promise.all(
    sections.map(async (section) => {
      const rooms = await Room.find({ section: section._id });
      return {
        ...section.toObject(),
        totalRooms: rooms.length,
        doneRooms: rooms.filter((room) => room.cleaningStatus === "Done").length,
        pendingRooms: rooms.filter((room) => room.cleaningStatus !== "Done").length
      };
    })
  );
  res.json(enriched);
}
