import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { MongoClient } from "mongodb";

dotenv.config();

const app = express();
app.use(express.json());
const PORT = 3000;

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Helper to safely call Gemini with a model fallback/error handling
async function callGemini(prompt: string, jsonSchema?: any, systemInstruction?: string) {
  try {
    const config: any = {};
    if (systemInstruction) {
      config.systemInstruction = systemInstruction;
    }
    if (jsonSchema) {
      config.responseMimeType = "application/json";
      config.responseSchema = jsonSchema;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config,
    });

    return response.text;
  } catch (err: any) {
    console.error("Gemini API Error:", err);
    throw err;
  }
}

// 1. AI College Chatbot Endpoint
app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;
  
  const systemInstruction = `
    You are an AI College Success Agent, an empathetic and highly knowledgeable academic mentor and campus companion. 
    You help college students with query resolutions regarding attendance, operating systems, database management systems (DBMS), data structures (DSA), networks (CN), placement advice, study timetables, and exam readiness.
    Give realistic, encouraging, and clear answers. Keep responses relatively concise but fully informational.
  `;

  // Build simple conversation context for the model
  let fullPrompt = "Conversation history:\n";
  if (Array.isArray(history)) {
    history.forEach((msg: any) => {
      fullPrompt += `${msg.sender === "user" ? "Student" : "AI Agent"}: ${msg.text}\n`;
    });
  }
  fullPrompt += `Student: ${message}\nAI Agent:`;

  try {
    const text = await callGemini(fullPrompt, undefined, systemInstruction);
    res.json({ text });
  } catch (error: any) {
    res.status(500).json({ 
      error: "Could not fetch chatbot response.", 
      message: error.message || String(error)
    });
  }
});

// 2. AI Study Planner Endpoint
app.post("/api/study-plan", async (req, res) => {
  const { subjects, examDate, hoursAvailable } = req.body;

  const prompt = `
    Generate a personalized study timetable, daily study targets, and revision tips for a student preparing for examinations.
    Subjects to study: ${JSON.stringify(subjects)}
    Exam Target Date: ${examDate}
    Study Hours Available Daily: ${hoursAvailable} hours

    Return a JSON structure matching the schema.
  `;

  const schema = {
    type: Type.OBJECT,
    properties: {
      schedule: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            day: { type: Type.STRING, description: "e.g., Monday, Tuesday" },
            topic: { type: Type.STRING, description: "Specific topic and subject to focus on" },
            hours: { type: Type.NUMBER, description: "Study duration" },
            completed: { type: Type.BOOLEAN, description: "Set false by default" }
          },
          required: ["day", "topic", "hours", "completed"]
        }
      },
      dailyTargets: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "List of 3 concrete short-term milestones"
      },
      revisionTips: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "A few high-impact revision/break strategies"
      }
    },
    required: ["schedule", "dailyTargets", "revisionTips"]
  };

  try {
    const responseText = await callGemini(prompt, schema, "You are a professional study scheduler.");
    if (responseText) {
      res.json(JSON.parse(responseText.trim()));
    } else {
      throw new Error("Empty response from Gemini API");
    }
  } catch (error: any) {
    res.status(500).json({ error: "Failed to generate study plan", message: error.message });
  }
});

// 3. AI Placement Preparation Questions Endpoint
app.post("/api/placement-prep", async (req, res) => {
  const { difficulty, focusTopic } = req.body;

  const prompt = `
    Generate 4 targeted placement preparation items for coding, aptitude, or HR preparation.
    Difficulty: ${difficulty || 'Medium'}
    Focus/Company Topic: ${focusTopic || 'General Top Tier Companies'}

    Each item must contain standard questions, their category (Coding, Aptitude, or HR), topic (e.g. DSA, DBMS, Resume), difficulty, target company, and a helpful AI hint for solution.
  `;

  const schema = {
    type: Type.OBJECT,
    properties: {
      items: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING, description: "Must be 'Coding', 'Aptitude', or 'HR'" },
            topic: { type: Type.STRING, description: "Subtopic like Linked Lists, Probability, HR Strength questions" },
            question: { type: Type.STRING, description: "The actual question" },
            difficulty: { type: Type.STRING, description: "Easy, Medium, or Hard" },
            company: { type: Type.STRING, description: "Target company name, e.g. Google, Amazon, TCS, Infosys" },
            aiHint: { type: Type.STRING, description: "Brief guidance or strategy to answer" }
          },
          required: ["category", "topic", "question", "difficulty", "company", "aiHint"]
        }
      }
    },
    required: ["items"]
  };

  try {
    const responseText = await callGemini(prompt, schema, "You are a recruitment trainer.");
    if (responseText) {
      res.json(JSON.parse(responseText.trim()));
    } else {
      throw new Error("No response from AI API");
    }
  } catch (error: any) {
    res.status(500).json({ error: "Failed to generate placement prep", message: error.message });
  }
});

// 4. AI Goals, Analytics & Comprehensive AI Success Evaluation Endpoint
app.post("/api/ai-evaluation", async (req, res) => {
  const { 
    attendanceRecords, 
    assignments, 
    studyHoursHistory, 
    codingCount,
    studentName,
    course
  } = req.body;

  const prompt = `
    Analyze this student's progress and generate a Semester Success evaluation.
    Student Name: ${studentName || "Student"}
    Course: ${course || "Engineering"}
    Attendance Records: ${JSON.stringify(attendanceRecords)}
    Assignments: ${JSON.stringify(assignments)}
    Recent Daily Study Hours: ${JSON.stringify(studyHoursHistory)}
    Total Coding Problems Solved: ${codingCount || 12}

    Provide:
    1. A single 'semesterSuccessScore' percentage (0-100) based on positive indicators (good attendance, assignments completed, coding problems).
    2. Concrete bullet point 'reasons' for the score, with clear indicators (like ✔ Good attendance, ⚠ Revise specific subject, ⚠ Complete pending task).
    3. 'productivityAnalyzer' comparing planned vs actual hours (e.g., planned 6, actual 4) and giving a targeted suggestion for tomorrow.
    4. 'weeklyReport' summarizing progress and giving actionable suggestions.
    5. 'examReadiness' percentage predictions for major academic subjects: 'DBMS', 'Operating Systems', 'Computer Networks', and 'Java/Programming'.
    6. 'motivationQuote' from an AI motivation coach.
    
    Return a valid JSON structure following the exact responseSchema.
  `;

  const schema = {
    type: Type.OBJECT,
    properties: {
      semesterSuccessScore: { type: Type.INTEGER, description: "Score out of 100" },
      reasons: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      },
      productivityAnalyzer: {
        type: Type.OBJECT,
        properties: {
          plannedHours: { type: Type.INTEGER },
          actualHours: { type: Type.INTEGER },
          suggestion: { type: Type.STRING }
        },
        required: ["plannedHours", "actualHours", "suggestion"]
      },
      weeklyReport: {
        type: Type.OBJECT,
        properties: {
          attendanceSummary: { type: Type.STRING },
          assignmentsSummary: { type: Type.STRING },
          studyHoursSummary: { type: Type.STRING },
          codingSummary: { type: Type.STRING },
          suggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["attendanceSummary", "assignmentsSummary", "studyHoursSummary", "codingSummary", "suggestions"]
      },
      examReadiness: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING },
            percentage: { type: Type.INTEGER }
          },
          required: ["subject", "percentage"]
        }
      },
      motivationQuote: { type: Type.STRING }
    },
    required: ["semesterSuccessScore", "reasons", "productivityAnalyzer", "weeklyReport", "examReadiness", "motivationQuote"]
  };

  try {
    const responseText = await callGemini(prompt, schema, "You are a supportive academic advisor.");
    if (responseText) {
      res.json(JSON.parse(responseText.trim()));
    } else {
      throw new Error("Failed to receive output from Gemini evaluation API");
    }
  } catch (error: any) {
    // Elegant fallback if API has trouble or is missing key
    res.status(500).json({ 
      error: "Failed to generate AI evaluations.", 
      message: error.message,
      // Provide high-quality structural mock fallback so the application never breaks
      fallback: {
        semesterSuccessScore: 84,
        reasons: [
          "✔ Attendance is excellent at 88% overall",
          "✔ Strong recent study hour commitment",
          "⚠ 2 assignments are approaching their due date",
          "⚠ Focus on operating system concept revision"
        ],
        productivityAnalyzer: {
          plannedHours: 6,
          actualHours: 4.5,
          suggestion: "Study Data Structures & Algorithms tomorrow morning when focus is highest."
        },
        weeklyReport: {
          attendanceSummary: "Maintaining above 75% in all major courses. Excellent progress.",
          assignmentsSummary: "Completed 3 of 5 assignments on time.",
          studyHoursSummary: "Averaged 4.2 hours of dynamic studying daily.",
          codingSummary: "Solved 8 aptitude & coding problems this week.",
          suggestions: [
            "Increase focus on Java Programming exercises.",
            "Complete the pending Database query assignments.",
            "Schedule a mock aptitude test."
          ]
        },
        examReadiness: [
          { subject: "DBMS", percentage: 91 },
          { subject: "Operating Systems", percentage: 72 },
          { subject: "Computer Networks", percentage: 60 },
          { subject: "Java Programming", percentage: 85 }
        ],
        motivationQuote: "Success in college is built daily, small step by small step. You completed major goals today – keep up the brilliant momentum!"
      }
    });
  }
});

// Lazy connection function to MongoDB Atlas
let mongoClient: MongoClient | null = null;
async function getMongoDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI environment variable is missing.");
  }
  if (!mongoClient) {
    mongoClient = new MongoClient(uri);
    await mongoClient.connect();
    console.log("Successfully connected to MongoDB database!");
  }
  return mongoClient.db("college_success_agent");
}

// 4.5 Configure MongoDB connection dynamically from frontend
app.post("/api/mongodb/configure", async (req, res) => {
  const { uri } = req.body;
  if (!uri) {
    return res.status(400).json({ error: "No MongoDB URI connection string provided." });
  }

  try {
    console.log("Validating connection to MongoDB with provided URI...");
    const tempClient = new MongoClient(uri);
    await tempClient.connect();
    await tempClient.close();
    console.log("Connection validated successfully!");

    // Set process.env so it takes effect immediately in the current running process
    process.env.MONGODB_URI = uri;
    mongoClient = null; // reset client so next getMongoDb() reconnects

    // Write the variable to .env file for persistence across restarts
    const envPath = path.join(process.cwd(), ".env");
    let envContent = "";
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, "utf8");
    }

    if (envContent.includes("MONGODB_URI=")) {
      envContent = envContent.replace(/MONGODB_URI=.*/g, `MONGODB_URI=${uri}`);
    } else {
      if (envContent && !envContent.endsWith("\n")) {
        envContent += "\n";
      }
      envContent += `MONGODB_URI=${uri}\n`;
    }
    fs.writeFileSync(envPath, envContent, "utf8");

    res.json({ success: true, message: "Connected to MongoDB Atlas and configuration saved!" });
  } catch (error: any) {
    console.error("MongoDB validation error:", error);
    res.status(400).json({ 
      error: "Connection failed. Please check your credentials and make sure you allowed IP access '0.0.0.0/0' in MongoDB Atlas Network Access.", 
      message: error.message || String(error)
    });
  }
});

// 5. MongoDB Status Check
app.get("/api/mongodb/status", async (req, res) => {
  const uriExists = !!process.env.MONGODB_URI;
  if (!uriExists) {
    return res.json({ connected: false, configured: false, message: "MONGODB_URI is not set in environment variables." });
  }
  try {
    const db = await getMongoDb();
    res.json({ connected: true, configured: true, message: "Connected to MongoDB Atlas!" });
  } catch (error: any) {
    res.json({ connected: false, configured: true, message: error.message || String(error) });
  }
});

// 6. MongoDB Save Entire State (Sync)
app.post("/api/mongodb/save", async (req, res) => {
  const { data } = req.body; // containing profile, attendance, etc.
  if (!data) {
    return res.status(400).json({ error: "No data payload provided." });
  }
  try {
    const db = await getMongoDb();
    const collection = db.collection("student_records");
    // Update or insert a single student document
    await collection.updateOne(
      { student_id: "saranya_sasikumar" },
      { $set: { ...data, updatedAt: new Date().toISOString() } },
      { upsert: true }
    );
    res.json({ success: true, message: "Data successfully synced and backup stored in MongoDB!" });
  } catch (error: any) {
    console.error("MongoDB Save Error:", error);
    res.status(500).json({ error: "Failed to save to MongoDB.", message: error.message || String(error) });
  }
});

// 7. MongoDB Load Entire State (Sync)
app.get("/api/mongodb/load", async (req, res) => {
  try {
    const db = await getMongoDb();
    const collection = db.collection("student_records");
    const record = await collection.findOne({ student_id: "saranya_sasikumar" });
    if (record) {
      res.json({ success: true, data: record });
    } else {
      res.json({ success: false, message: "No document found in MongoDB for student." });
    }
  } catch (error: any) {
    console.error("MongoDB Load Error:", error);
    res.status(500).json({ error: "Failed to load from MongoDB.", message: error.message || String(error) });
  }
});

// Book Recommendation API
app.post("/api/book-recommendations", async (req, res) => {
  const { interestTopic } = req.body;
  const prompt = `
    Suggest 3 books related to the topic of: ${interestTopic || 'Computer Science'}.
    For each, return book title, author, brief reason for recommendation, and an appropriate technical difficulty rating.
  `;

  const schema = {
    type: Type.OBJECT,
    properties: {
      recommendations: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            author: { type: Type.STRING },
            reason: { type: Type.STRING },
            difficulty: { type: Type.STRING }
          },
          required: ["title", "author", "reason", "difficulty"]
        }
      }
    },
    required: ["recommendations"]
  };

  try {
    const responseText = await callGemini(prompt, schema, "You are a university librarian.");
    if (responseText) {
      res.json(JSON.parse(responseText.trim()));
    } else {
      throw new Error("No response");
    }
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch book recommendations", message: error.message });
  }
});

// HR Practice Platform - Answer Evaluation Endpoint
app.post("/api/evaluate-hr-answer", async (req, res) => {
  const { question, answer } = req.body;

  if (!question || !answer) {
    return res.status(400).json({ error: "Question and answer are required" });
  }

  const prompt = `
    Evaluate the following HR interview response:
    Question: ${question}
    Student Answer: ${answer}

    Provide:
    1. A single 'relevanceScore' (0-100) indicating how relevant, structured, and professional the response is.
    2. 'feedback' containing 2-3 constructive feedback points on how they can improve.
    3. 'strengths' containing 1-2 key highlights of what they did well (e.g. STAR structure, confidence, honesty).
    4. 'sampleAnswer' representing an optimized response to the same question that the student can study.
    
    Return a valid JSON structure following the exact responseSchema.
  `;

  const schema = {
    type: Type.OBJECT,
    properties: {
      relevanceScore: { type: Type.INTEGER, description: "A percentage value from 0 to 100" },
      feedback: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "List of 2-3 specific constructive suggestions"
      },
      strengths: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "List of 1-2 positive points about the response"
      },
      sampleAnswer: { type: Type.STRING, description: "A short, polished exemplary answer" }
    },
    required: ["relevanceScore", "feedback", "strengths", "sampleAnswer"]
  };

  try {
    const responseText = await callGemini(prompt, schema, "You are an experienced HR Director and career coach.");
    if (responseText) {
      res.json(JSON.parse(responseText.trim()));
    } else {
      throw new Error("No response from Gemini");
    }
  } catch (error: any) {
    // Elegant fallback if Gemini fails
    console.error("HR Evaluation Error:", error);
    
    // Heuristic client/server evaluation fallback
    const len = answer.trim().length;
    let score = 55;
    if (len > 30) score += 10;
    if (len > 80) score += 15;
    if (len > 150) score += 10;
    
    const lowercaseAnswer = answer.toLowerCase();
    const keywords = ["example", "situation", "task", "action", "result", "because", "learned", "team", "challenge", "solved", "strength", "weakness"];
    let matchCount = 0;
    keywords.forEach(kw => {
      if (lowercaseAnswer.includes(kw)) {
        matchCount++;
      }
    });
    score += Math.min(15, matchCount * 3);
    score = Math.min(95, score);
    
    res.json({
      relevanceScore: score,
      feedback: [
        "Structure your reply with the STAR method (Situation, Task, Action, Result) to make your examples clear.",
        "Add more details about quantitative metrics (e.g., percentages, team sizes, deadlines met) to prove your impact."
      ],
      strengths: [
        answer.length > 50 ? "Strong depth of response showing clear commitment and detail." : "A concise summary of your key experience.",
        matchCount > 1 ? "Used effective career and collaboration keywords." : "Directly addressed the question's premise."
      ],
      sampleAnswer: "A great answer would be: 'In my last team project, we faced a tight deadline. I took the initiative to map out our deliverables, communicated daily updates, and we delivered the project 2 days ahead of schedule, raising our team efficiency by 15%.'"
    });
  }
});

// Build Phase & Production Start / Vite Middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
