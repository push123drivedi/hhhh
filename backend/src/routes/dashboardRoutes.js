import express from "express";

const router = express.Router();

// ✅ GET Dashboard Data
router.get("/", async (req, res) => {
  try {
    const { date } = req.query;
    const io = req.app.locals.io;

    console.log(`📊 Dashboard requested for date: ${date}`);

    // ✅ तुम्हारे database queries यहाँ आएंगे
    // const dashboardData = await Dashboard.findOne({ date });
    // const workers = await Worker.find();

    // Dummy data (जब तक database setup न हो)
    const dashboardData = {
      totals: {
        totalRooms: 45,
        cleanedRooms: 32,
        pendingRooms: 10,
        inProgressRooms: 3,
        completionPercentage: 71,
        fastestWorker: "Ahmed Khan"
      },
      workerPerformance: [
        { name: "Ahmed Khan", assigned: 12, done: 10, notDone: 2 },
        { name: "Fatima Ali", assigned: 10, done: 9, notDone: 1 },
        { name: "Hassan Ibrahim", assigned: 8, done: 7, notDone: 1 },
        { name: "Zainab Omar", assigned: 9, done: 6, notDone: 3 }
      ],
      sectionStatus: [
        { code: "A", name: "Ground Floor", total: 15, done: 12, pending: 3 },
        { code: "B", name: "First Floor", total: 15, done: 12, pending: 3 },
        { code: "C", name: "Second Floor", total: 15, done: 8, pending: 7 }
      ],
      liveActivity: [
        { id: 1, title: "Room 101 Cleaned", message: "Ahmed completed cleaning" },
        { id: 2, title: "New Task Assigned", message: "Fatima assigned to Room 205" }
      ],
      aiRecommendations: [
        {
          id: 1,
          room: "Room 101",
          section: "A",
          task: "Clean & Inspect",
          priority: "high",
          estimatedTime: "45 min",
          assignedTo: null,
          status: "pending"
        },
        {
          id: 2,
          room: "Room 102",
          section: "A",
          task: "Clean",
          priority: "medium",
          estimatedTime: "30 min",
          assignedTo: null,
          status: "pending"
        }
      ]
    };

    res.json({ success: true, data: dashboardData });
  } catch (error) {
    console.error("❌ Dashboard error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// ✅ POST - Generate AI Recommendations
router.post("/recommend", async (req, res) => {
  try {
    const { limit, date } = req.body;
    const io = req.app.locals.io;

    console.log(`🤖 Generating ${limit} recommendations for ${date}`);

    // ✅ तुम्हारे AI logic यहाँ आएंगे
    // const recommendations = await generateAIRecommendations(limit, date);

    // Dummy recommendations
    const recommendations = Array.from({ length: limit || 12 }, (_, i) => ({
      id: i + 1,
      room: `Room ${101 + i}`,
      section: String.fromCharCode(65 + (i % 3)),
      task: ["Clean", "Inspect", "Deep Clean"][i % 3],
      priority: ["high", "medium", "low"][i % 3],
      estimatedTime: `${30 + i * 5} min`,
      assignedTo: null,
      status: "pending"
    }));

    // ✅ Socket Event - सभी connected users को notify करो
    if (io) {
      io.emit("task:recommended", {
        message: "🤖 New AI recommendations generated",
        count: recommendations.length,
        date: date,
        timestamp: new Date()
      });
      console.log(`📩 Socket Event: task:recommended (${recommendations.length} tasks)`);
    }

    res.json({ success: true, data: recommendations });
  } catch (error) {
    console.error("❌ Recommendations error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// ✅ PATCH - Start Task
router.patch("/:id/start", async (req, res) => {
  try {
    const { id } = req.params;
    const io = req.app.locals.io;

    console.log(`▶️ Starting task: ${id}`);

    // ✅ तुम्हारा database update logic
    // const task = await Task.findByIdAndUpdate(id, { 
    //   status: "in-progress", 
    //   startTime: new Date() 
    // });

    // ✅ Socket Event - सभी को notify करो
    if (io) {
      io.emit("task:updated", {
        taskId: id,
        status: "in-progress",
        startTime: new Date(),
        timestamp: new Date()
      });
      console.log(`📩 Socket Event: task:updated (started)`);
    }

    res.json({ success: true, message: "Task started", taskId: id });
  } catch (error) {
    console.error("❌ Start task error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// ✅ PATCH - Verify Task (Mark as Done/Not Done)
router.patch("/:id/verify", async (req, res) => {
  try {
    const { id } = req.params;
    const { decision, date } = req.body;
    const io = req.app.locals.io;

    console.log(`✅ Verifying task: ${id} - Decision: ${decision}`);

    // ✅ तुम्हारा database update logic
    // const task = await Task.findByIdAndUpdate(id, { 
    //   verified: true, 
    //   decision: decision,
    //   verifiedAt: new Date()
    // });

    // ✅ Socket Event - सभी को notify करो
    if (io) {
      io.emit("room:updated", {
        taskId: id,
        decision: decision,
        date: date,
        timestamp: new Date()
      });
      console.log(`📩 Socket Event: room:updated (verified)`);
    }

    res.json({ 
      success: true, 
      message: `Task marked as ${decision}`,
      taskId: id 
    });
  } catch (error) {
    console.error("❌ Verify task error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// ✅ PATCH - Assign Task to Worker
router.patch("/:id/assign", async (req, res) => {
  try {
    const { id } = req.params;
    const { workerId } = req.body;
    const io = req.app.locals.io;

    console.log(`👤 Assigning task ${id} to worker ${workerId}`);

    // ✅ तुम्हारा database update logic
    // const task = await Task.findByIdAndUpdate(id, { 
    //   assignedTo: workerId,
    //   status: "assigned",
    //   assignedAt: new Date()
    // });

    // ✅ Socket Event - सभी को notify करो
    if (io) {
      io.emit("task:updated", {
        taskId: id,
        assignedTo: workerId,
        status: "assigned",
        timestamp: new Date()
      });
      console.log(`📩 Socket Event: task:updated (assigned)`);
    }

    res.json({ 
      success: true, 
      message: "Task assigned successfully",
      taskId: id,
      workerId: workerId
    });
  } catch (error) {
    console.error("❌ Assign task error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// ✅ GET - Get Tasks by Section
router.get("/section/:code", async (req, res) => {
  try {
    const { code } = req.params;

    console.log(`📋 Getting tasks for section: ${code}`);

    // ✅ तुम्हारा database query
    // const tasks = await Task.find({ section: code });

    res.json({ 
      success: true, 
      section: code,
      tasks: []
    });
  } catch (error) {
    console.error("❌ Get section tasks error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;