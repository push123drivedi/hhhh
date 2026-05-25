export const SCHOOL_NAME = "St. Vivekanand Millennium School";

const roomDefaults = {
  classroom: { priority: 3, minTime: 20, maxTime: 25 },
  lab: { priority: 5, minTime: 30, maxTime: 30 },
  washroom: { priority: 6, minTime: 15, maxTime: 20 },
  admin: { priority: 5, minTime: 20, maxTime: 25 },
  support: { priority: 4, minTime: 20, maxTime: 25 },
  utility: { priority: 5, minTime: 15, maxTime: 20 },
  large: { priority: 4, minTime: 30, maxTime: 30 }
};

const structure = [
  {
    floorName: "Ground Floor",
    floorCode: "GROUND",
    level: 0,
    sections: [
      {
        sectionCode: "A",
        sectionName: "Admin Row",
        coordinates: { x: 1, y: 1 },
        rooms: [
          ["Front Office", "admin"],
          ["Principal Office", "admin"],
          ["Accounts Department", "admin"],
          ["Enquiry Room", "admin"]
        ]
      },
      {
        sectionCode: "B",
        sectionName: "Academic Row",
        coordinates: { x: 4, y: 1 },
        rooms: [
          ["Class 9A", "classroom"],
          ["Class 9B", "classroom"],
          ["Class 9C", "classroom"]
        ]
      },
      {
        sectionCode: "C",
        sectionName: "Lab Row",
        coordinates: { x: 7, y: 1 },
        rooms: [
          ["Physics Lab", "lab"],
          ["Biology Lab", "lab"],
          ["Math Lab", "lab"],
          ["ATL Lab", "lab"]
        ]
      },
      {
        sectionCode: "D",
        sectionName: "Support Row",
        coordinates: { x: 1, y: 4 },
        rooms: [
          ["Kitchen", "support"],
          ["Staff Room", "support"],
          ["Meditation Room", "support"],
          ["Transport Room", "support"],
          ["Technician Room", "support"]
        ]
      },
      {
        sectionCode: "E",
        sectionName: "Senior Wing",
        coordinates: { x: 5, y: 4 },
        rooms: [
          ["Class 12B Medical/Arts", "classroom"],
          ["Class 12 Arts/Commerce", "classroom"],
          ["Class 12 NM/ME", "classroom"],
          ["Class 11 Arts/Commerce", "classroom"],
          ["Class 11 NM/Medical", "classroom"],
          ["Class 11A Medical/NM", "classroom"],
          ["Class 10C", "classroom"],
          ["Class 10A", "classroom"]
        ]
      },
      {
        sectionCode: "F",
        sectionName: "Utility Row",
        coordinates: { x: 9, y: 4 },
        rooms: [
          ["Staff Washroom", "washroom"],
          ["Boys Washroom", "washroom"],
          ["Girls Washroom", "washroom"],
          ["Drinking Water Point", "utility"]
        ]
      },
      {
        sectionCode: "G",
        sectionName: "Special Rooms",
        coordinates: { x: 3, y: 7 },
        rooms: [
          ["Music Room", "large"],
          ["Medical/Arts Room", "support"],
          ["Vice Principal Office", "admin"]
        ]
      }
    ]
  },
  {
    floorName: "First Floor",
    floorCode: "FIRST",
    level: 1,
    sections: [
      {
        sectionCode: "H",
        sectionName: "English Zone",
        coordinates: { x: 1, y: 10 },
        rooms: [
          ["Class 3A", "classroom"],
          ["Class 3B", "classroom"],
          ["Class 5A", "classroom"],
          ["Class 5B", "classroom"],
          ["Class 6A", "classroom"]
        ]
      },
      {
        sectionCode: "I",
        sectionName: "Middle School Zone",
        coordinates: { x: 5, y: 10 },
        rooms: [
          ["Class 6B", "classroom"],
          ["Class 7A", "classroom"],
          ["Class 7B", "classroom"],
          ["Class 7C", "classroom"],
          ["Class 8A", "classroom"],
          ["Class 8B", "classroom"],
          ["Class 8C", "classroom"]
        ]
      },
      {
        sectionCode: "J",
        sectionName: "Resource Zone",
        coordinates: { x: 9, y: 10 },
        rooms: [
          ["Computer Lab", "lab"],
          ["Art & Craft Lab", "lab"],
          ["Library", "large"],
          ["English Language Lab", "lab"]
        ]
      },
      {
        sectionCode: "K",
        sectionName: "Staff Area",
        coordinates: { x: 3, y: 13 },
        rooms: [
          ["Staff Lounge 2", "support"],
          ["Drinking Point", "utility"]
        ]
      }
    ]
  }
];

export function getSchoolStructure() {
  return structure;
}

export function getRoomDefaults(roomType) {
  return roomDefaults[roomType] || roomDefaults.classroom;
}

export function midpoint(min, max) {
  return Math.round((min + max) / 2);
}

export function cleaningSteps() {
  return [
    { name: "Sweeping", done: false },
    { name: "Mopping", done: false },
    { name: "Dusting", done: false }
  ];
}
