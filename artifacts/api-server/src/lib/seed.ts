/**
 * Seed script — run once to populate sample data for development.
 * Usage: pnpm --filter @workspace/api-server tsx src/lib/seed.ts
 */
import { db } from "@workspace/db";
import {
  departmentsTable, usersTable, studentProfilesTable, skillsTable,
  projectsTable, internshipsTable, certificationsTable, codingProfilesTable,
  companiesTable, jobPostingsTable, interviewsTable, notificationsTable,
  semesterRecordsTable,
} from "@workspace/db";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("Seeding database…");

  // ── Departments ───────────────────────────────────────────────────────────
  const depts = await db.insert(departmentsTable).values([
    { name: "Computer Science & Engineering", code: "CSE", hodName: "Dr. Anita Sharma" },
    { name: "Electronics & Communication Engineering", code: "ECE", hodName: "Dr. Rajan Mehta" },
    { name: "Mechanical Engineering", code: "ME", hodName: "Dr. Suresh Patel" },
    { name: "Civil Engineering", code: "CE", hodName: "Dr. Priya Nair" },
    { name: "Information Technology", code: "IT", hodName: "Dr. Kavya Reddy" },
  ]).onConflictDoNothing().returning();
  console.log("Departments:", depts.length);

  // ── Companies ─────────────────────────────────────────────────────────────
  const companies = await db.insert(companiesTable).values([
    {
      name: "Google India",
      industry: "Technology",
      description: "Global leader in internet services and products.",
      website: "https://google.com",
      minCGPARequired: "8.0",
      maxBacklogs: 0,
      requiredSkills: ["Data Structures & Algorithms", "System Design", "Python", "JavaScript"],
      packageMin: "18",
      packageMax: "45",
      eligibleDepartments: ["CSE", "IT", "ECE"],
    },
    {
      name: "Microsoft",
      industry: "Technology",
      description: "Global leader in software, cloud services and hardware.",
      website: "https://microsoft.com",
      minCGPARequired: "7.5",
      maxBacklogs: 0,
      requiredSkills: ["C++", "Data Structures & Algorithms", "Azure", "REST APIs"],
      packageMin: "16",
      packageMax: "38",
      eligibleDepartments: ["CSE", "IT", "ECE"],
    },
    {
      name: "Amazon",
      industry: "E-Commerce / Cloud",
      description: "World's largest cloud platform and e-commerce company.",
      website: "https://amazon.in",
      minCGPARequired: "7.0",
      maxBacklogs: 1,
      requiredSkills: ["Java", "Data Structures & Algorithms", "AWS", "SQL"],
      packageMin: "12",
      packageMax: "32",
      eligibleDepartments: ["CSE", "IT", "ECE", "ME"],
    },
    {
      name: "Tata Consultancy Services",
      industry: "IT Services",
      description: "India's largest IT services company.",
      website: "https://tcs.com",
      minCGPARequired: "6.0",
      maxBacklogs: 2,
      requiredSkills: ["Java", "SQL", "Communication"],
      packageMin: "3.5",
      packageMax: "7",
      eligibleDepartments: ["CSE", "IT", "ECE", "ME", "CE"],
    },
    {
      name: "Infosys",
      industry: "IT Services",
      description: "Global leader in next-generation digital services.",
      website: "https://infosys.com",
      minCGPARequired: "6.5",
      maxBacklogs: 1,
      requiredSkills: ["Python", "SQL", "REST APIs", "Git / Version Control"],
      packageMin: "4",
      packageMax: "9",
      eligibleDepartments: ["CSE", "IT", "ECE", "ME"],
    },
    {
      name: "Wipro",
      industry: "IT Services",
      description: "Global information technology company.",
      website: "https://wipro.com",
      minCGPARequired: "6.0",
      maxBacklogs: 2,
      requiredSkills: ["Java", "SQL", "Communication"],
      packageMin: "3.5",
      packageMax: "6.5",
      eligibleDepartments: ["CSE", "IT", "ECE", "ME", "CE"],
    },
  ]).onConflictDoNothing().returning();
  console.log("Companies:", companies.length);

  // ── Job Postings ──────────────────────────────────────────────────────────
  if (companies.length > 0) {
    const google = companies.find(c => c.name === "Google India");
    const microsoft = companies.find(c => c.name === "Microsoft");
    const amazon = companies.find(c => c.name === "Amazon");
    const tcs = companies.find(c => c.name === "Tata Consultancy Services");

    const jobValues = [];
    if (google) jobValues.push({
      title: "Software Engineer", companyId: google.id, status: "open",
      description: "Join our team to build products at scale. Work on Search, Maps, and Cloud.",
      eligibilityCriteria: "CGPA >= 8.0, No backlogs, CSE/IT/ECE students only",
      applicationDeadline: "2025-03-15", ctc: "28", openings: 5,
    });
    if (microsoft) jobValues.push({
      title: "Software Development Engineer", companyId: microsoft.id, status: "open",
      description: "Build world-class software for Azure and Microsoft 365.",
      eligibilityCriteria: "CGPA >= 7.5, No backlogs, CS/IT/ECE",
      applicationDeadline: "2025-03-20", ctc: "22", openings: 8,
    });
    if (amazon) jobValues.push({
      title: "SDE-1", companyId: amazon.id, status: "upcoming",
      description: "Build and operate distributed systems that serve millions of customers.",
      eligibilityCriteria: "CGPA >= 7.0, Max 1 backlog",
      applicationDeadline: "2025-04-01", ctc: "18", openings: 12,
    });
    if (tcs) jobValues.push({
      title: "System Engineer", companyId: tcs.id, status: "open",
      description: "Join TCS and work on enterprise software solutions.",
      eligibilityCriteria: "CGPA >= 6.0, Max 2 backlogs",
      applicationDeadline: "2025-02-28", ctc: "4.5", openings: 50,
    });

    if (jobValues.length > 0) {
      await db.insert(jobPostingsTable).values(jobValues as any).onConflictDoNothing();
    }
    console.log("Job postings inserted");
  }

  // ── Admin User ────────────────────────────────────────────────────────────
  const adminHash = await bcrypt.hash("admin@123", 10);
  const [admin] = await db.insert(usersTable).values({
    name: "System Administrator",
    email: "admin@placepro.edu",
    passwordHash: adminHash,
    role: "admin",
    isActive: true,
  }).onConflictDoNothing().returning();
  console.log("Admin:", admin?.email);

  // ── Placement Officer ─────────────────────────────────────────────────────
  const officerHash = await bcrypt.hash("officer@123", 10);
  const [officer] = await db.insert(usersTable).values({
    name: "Dr. Rajesh Kumar",
    email: "officer@placepro.edu",
    passwordHash: officerHash,
    role: "officer",
    isActive: true,
  }).onConflictDoNothing().returning();
  console.log("Officer:", officer?.email);

  // ── Demo Student ──────────────────────────────────────────────────────────
  const studentHash = await bcrypt.hash("student@123", 10);
  const [student] = await db.insert(usersTable).values({
    name: "Arjun Mehta",
    email: "student@placepro.edu",
    passwordHash: studentHash,
    role: "student",
    isActive: true,
  }).onConflictDoNothing().returning();
  console.log("Student:", student?.email);

  if (student) {
    // Profile
    await db.insert(studentProfilesTable).values({
      userId: student.id,
      rollNo: "CSE2021001",
      phone: "+91 98765 43210",
      batch: "2021-25",
      cgpa: "8.2",
      backlogs: 0,
      bio: "Full-stack developer passionate about building scalable systems. Open source contributor.",
      linkedinUrl: "https://linkedin.com/in/arjunmehta",
    }).onConflictDoNothing();

    // Semester records
    await db.insert(semesterRecordsTable).values([
      { userId: student.id, semester: 1, sgpa: "8.0", year: "2021-22", backlogs: 0 },
      { userId: student.id, semester: 2, sgpa: "8.3", year: "2021-22", backlogs: 0 },
      { userId: student.id, semester: 3, sgpa: "7.9", year: "2022-23", backlogs: 0 },
      { userId: student.id, semester: 4, sgpa: "8.4", year: "2022-23", backlogs: 0 },
      { userId: student.id, semester: 5, sgpa: "8.5", year: "2023-24", backlogs: 0 },
      { userId: student.id, semester: 6, sgpa: "8.1", year: "2023-24", backlogs: 0 },
    ]).onConflictDoNothing();

    // Skills
    await db.insert(skillsTable).values([
      { userId: student.id, name: "JavaScript", level: "advanced", category: "Frontend" },
      { userId: student.id, name: "TypeScript", level: "intermediate", category: "Frontend" },
      { userId: student.id, name: "React", level: "advanced", category: "Frontend" },
      { userId: student.id, name: "Node.js", level: "intermediate", category: "Backend" },
      { userId: student.id, name: "Python", level: "intermediate", category: "Programming" },
      { userId: student.id, name: "PostgreSQL", level: "intermediate", category: "Database" },
      { userId: student.id, name: "Git / Version Control", level: "advanced", category: "Tools" },
      { userId: student.id, name: "REST APIs", level: "intermediate", category: "Backend" },
    ]).onConflictDoNothing();

    // Projects
    await db.insert(projectsTable).values([
      {
        userId: student.id,
        title: "PlacePro — Placement Management System",
        description: "A full-stack web application for university placement management with AI readiness scoring.",
        techStack: ["React", "Node.js", "PostgreSQL", "TypeScript"],
        githubUrl: "https://github.com/arjunmehta/placepro",
        liveUrl: "https://placepro.demo.com",
        startDate: "2024-01",
        endDate: "2024-05",
      },
      {
        userId: student.id,
        title: "E-Commerce Platform",
        description: "Scalable e-commerce platform with product catalog, cart, and payment gateway integration.",
        techStack: ["React", "Express.js", "MongoDB", "Stripe"],
        githubUrl: "https://github.com/arjunmehta/ecommerce",
        startDate: "2023-08",
        endDate: "2023-12",
      },
      {
        userId: student.id,
        title: "Real-Time Chat Application",
        description: "WebSocket-based real-time chat with room support, file sharing, and message encryption.",
        techStack: ["React", "Socket.IO", "Node.js", "Redis"],
        githubUrl: "https://github.com/arjunmehta/chat-app",
        startDate: "2023-06",
        endDate: "2023-08",
      },
    ]).onConflictDoNothing();

    // Internships
    await db.insert(internshipsTable).values([
      {
        userId: student.id,
        company: "Flipkart",
        role: "Software Development Intern",
        description: "Worked on the search ranking algorithm team. Improved search latency by 15%.",
        startDate: "2024-05",
        endDate: "2024-07",
        stipend: "40000",
        location: "Bangalore",
      },
      {
        userId: student.id,
        company: "Startup.in",
        role: "Full Stack Intern",
        description: "Built core features for a B2B SaaS product using React and Node.js.",
        startDate: "2023-12",
        endDate: "2024-01",
        stipend: "20000",
        location: "Remote",
      },
    ]).onConflictDoNothing();

    // Certifications
    await db.insert(certificationsTable).values([
      {
        userId: student.id,
        name: "AWS Certified Cloud Practitioner",
        issuer: "Amazon Web Services",
        issueDate: "2024-03",
        expiryDate: "2027-03",
        credentialUrl: "https://aws.amazon.com/certification",
        credentialId: "AWS-CP-2024-AM001",
      },
      {
        userId: student.id,
        name: "Meta React Developer Certificate",
        issuer: "Meta (Coursera)",
        issueDate: "2023-11",
        credentialUrl: "https://coursera.org",
        credentialId: "REACT-META-2023",
      },
    ]).onConflictDoNothing();

    // Coding Profiles
    await db.insert(codingProfilesTable).values({
      userId: student.id,
      githubUsername: "arjunmehta",
      githubUrl: "https://github.com/arjunmehta",
      leetcodeUsername: "arjun_codes",
      leetcodeSolved: 287,
      hackerrankUsername: "arjunmehta",
      hackerrankBadges: 5,
      codeforcesUsername: "arjun_mehta",
      codeforcesRating: 1450,
    }).onConflictDoNothing();

    // Notifications for student
    await db.insert(notificationsTable).values([
      {
        userId: student.id,
        title: "Google India Drive 2025",
        message: "Google India is visiting campus on March 15. Apply before March 10.",
        type: "job",
        isRead: false,
      },
      {
        userId: student.id,
        title: "Technical Interview Scheduled",
        message: "Your technical interview with Microsoft is scheduled for March 5, 2025 at 10:00 AM.",
        type: "interview",
        isRead: false,
      },
      {
        userId: student.id,
        title: "Resume Review Complete",
        message: "Your AI resume analysis is ready. Your readiness score is 82/100.",
        type: "placement",
        isRead: true,
      },
    ]).onConflictDoNothing();

    // Interview
    if (companies.length > 0) {
      const microsoft = companies.find(c => c.name === "Microsoft");
      if (microsoft) {
        await db.insert(interviewsTable).values({
          studentId: student.id,
          companyId: microsoft.id,
          scheduledAt: "2025-03-05T10:00:00",
          type: "technical",
          status: "scheduled",
          venue: "Room 301, Admin Block",
        }).onConflictDoNothing();
      }
    }
  }

  // ── Extra demo students ───────────────────────────────────────────────────
  const demoStudents = [
    { name: "Priya Sharma", email: "priya@placepro.edu", cgpa: "9.1", batch: "2021-25" },
    { name: "Rahul Verma", email: "rahul@placepro.edu", cgpa: "7.5", batch: "2021-25" },
    { name: "Sneha Patel", email: "sneha@placepro.edu", cgpa: "8.8", batch: "2022-26" },
    { name: "Kiran Kumar", email: "kiran@placepro.edu", cgpa: "6.9", batch: "2022-26" },
  ];

  const pw = await bcrypt.hash("demo@123", 10);
  for (const s of demoStudents) {
    const [u] = await db.insert(usersTable).values({
      name: s.name, email: s.email, passwordHash: pw, role: "student", isActive: true,
    }).onConflictDoNothing().returning();
    if (u) {
      await db.insert(studentProfilesTable).values({
        userId: u.id, cgpa: s.cgpa, batch: s.batch, backlogs: 0,
      }).onConflictDoNothing();
    }
  }
  console.log("Demo students inserted");

  console.log("\nSeed complete!");
  console.log("─────────────────────────────────────────");
  console.log("Login credentials:");
  console.log("  Admin:   admin@placepro.edu    / admin@123");
  console.log("  Officer: officer@placepro.edu  / officer@123");
  console.log("  Student: student@placepro.edu  / student@123");
  console.log("─────────────────────────────────────────");

  process.exit(0);
}

seed().catch(err => {
  console.error("Seed failed:", err);
  process.exit(1);
});
