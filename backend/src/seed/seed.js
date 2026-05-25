import "dotenv/config";
import mongoose from "mongoose";
import { connectDb } from "../config/db.js";
import { cleaningSteps, getRoomDefaults, getSchoolStructure, midpoint } from "../config/schoolStructure.js";
import Attendance from "../models/Attendance.js";
import DailyReport from "../models/DailyReport.js";
import Floor from "../models/Floor.js";
import Notification from "../models/Notification.js";
import Room from "../models/Room.js";
import Section from "../models/Section.js";
import Staff from "../models/Staff.js";
import Task from "../models/Task.js";
import User from "../models/User.js";

const today = new Date().toISOString().slice(0, 10);

async function seed() {
  await connectDb();
  await Promise.all([
    Attendance.deleteMany({}),
    DailyReport.deleteMany({}),
    Notification.deleteMany({}),
    Task.deleteMany({}),
    Staff.deleteMany({}),
    User.deleteMany({}),
    Room.deleteMany({}),
    Section.deleteMany({}),
    Floor.deleteMany({})
  ]);

  const admin = await User.create({
    name: "SVMS Admin",
    email: "admin@svms.edu",
    password: "Admin@123",
    role: "admin"
  });

  const supervisor = await User.create({
    name: "Duty Supervisor",
    email: "supervisor@svms.edu",
    password: "Admin@123",
    role: "supervisor"
  });

  const staffUsers = await User.insertMany(
    ["A", "B", "C", "D", "E"].map((name) => ({
      name: `Group D Staff ${name}`,
      email: `${name.toLowerCase()}@svms.edu`,
      password: "Admin@123",
      role: "staff"
    }))
  );

  const staff = await Staff.insertMany([
    {
      user: staffUsers[0]._id,
      displayName: "A",
      employeeCode: "GD-A",
      skills: ["washroom", "utility", "admin"],
      floorPreference: "GROUND",
      currentLocation: { floor: "GROUND", x: 9, y: 4 }
    },
    {
      user: staffUsers[1]._id,
      displayName: "B",
      employeeCode: "GD-B",
      skills: ["classroom", "support"],
      floorPreference: "GROUND",
      currentLocation: { floor: "GROUND", x: 5, y: 4 }
    },
    {
      user: staffUsers[2]._id,
      displayName: "C",
      employeeCode: "GD-C",
      skills: ["lab", "large"],
      floorPreference: "FIRST",
      currentLocation: { floor: "FIRST", x: 9, y: 10 }
    },
    {
      user: staffUsers[3]._id,
      displayName: "D",
      employeeCode: "GD-D",
      skills: ["classroom", "large"],
      floorPreference: "FIRST",
      currentLocation: { floor: "FIRST", x: 4, y: 10 }
    },
    {
      user: staffUsers[4]._id,
      displayName: "E",
      employeeCode: "GD-E",
      skills: ["admin", "lab", "support"],
      floorPreference: "ANY",
      currentLocation: { floor: "GROUND", x: 1, y: 1 }
    }
  ]);

  await Staff.create({
    user: supervisor._id,
    displayName: "Supervisor",
    employeeCode: "SUP-001",
    skills: ["admin", "washroom", "lab"],
    floorPreference: "ANY",
    currentLocation: { floor: "GROUND", x: 1, y: 1 }
  });

  const floorsByCode = {};
  const sectionsByCode = {};

  for (const floorData of getSchoolStructure()) {
    const floor = await Floor.create({
      floorName: floorData.floorName,
      floorCode: floorData.floorCode,
      level: floorData.level,
      description: `${floorData.floorName} operational cleaning layout`
    });
    floorsByCode[floor.floorCode] = floor;

    for (const sectionData of floorData.sections) {
      const section = await Section.create({
        sectionName: sectionData.sectionName,
        sectionCode: sectionData.sectionCode,
        floor: floor._id,
        priority: Math.max(...sectionData.rooms.map((room) => getRoomDefaults(room[1]).priority)),
        coordinates: sectionData.coordinates
      });
      sectionsByCode[section.sectionCode] = section;

      let offset = 0;
      for (const [roomName, roomType] of sectionData.rooms) {
        const defaults = getRoomDefaults(roomType);
        await Room.create({
          roomName,
          floor: floor._id,
          floorCode: floor.floorCode,
          section: section._id,
          sectionCode: section.sectionCode,
          roomType,
          priority: defaults.priority,
          cleaningTime: {
            min: defaults.minTime,
            max: defaults.maxTime,
            estimated: midpoint(defaults.minTime, defaults.maxTime)
          },
          cleaningStatus: "Pending",
          cleaningSteps: cleaningSteps(),
          coordinates: {
            x: section.coordinates.x + (offset % 3),
            y: section.coordinates.y + Math.floor(offset / 3)
          }
        });
        offset += 1;
      }
    }
  }

  await Attendance.insertMany(staff.map((member) => ({ staff: member._id, date: today, status: "present", checkIn: new Date() })));

  await Notification.create({
    title: "SVMS duty system ready",
    message: "Rooms, sections, Group D staff, and AI recommendation rules are seeded.",
    type: "success",
    audience: "all"
  });

  console.log("Seed complete for St. Vivekanand Millennium School");
  console.log("Admin: admin@svms.edu / Admin@123");
  console.log("Supervisor: supervisor@svms.edu / Admin@123");
  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
