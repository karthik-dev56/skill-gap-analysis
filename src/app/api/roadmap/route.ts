import { NextRequest,NextResponse } from "next/server";

const RoadMaps: Record<string, any> = {
    "Frontend Developer": {
    phases: [
      {
        phase: 1,
        title: "Foundations",
        duration: "1-2 months",
        skills: ["HTML", "CSS", "JavaScript Basics", "Git & GitHub"],
        description: "Build a strong foundation in web technologies",
        milestones: [
          "Create 3 static websites using HTML/CSS",
          "Learn JavaScript fundamentals (variables, functions, loops)",
          "Set up Git and push projects to GitHub",
          "Understand DOM manipulation"
        ]
      },
      {
        phase: 2,
        title: "Modern Frontend",
        duration: "2-3 months",
        skills: ["React", "Component Design", "State Management", "API Integration"],
        description: "Master modern frontend frameworks",
        milestones: [
          "Build 2-3 React projects",
          "Learn hooks (useState, useEffect, custom hooks)",
          "Integrate REST APIs",
          "Implement responsive design with Tailwind/CSS"
        ]
      },
      {
        phase: 3,
        title: "Professional Skills",
        duration: "1-2 months",
        skills: ["Next.js", "Testing", "Performance Optimization", "Deployment"],
        description: "Level up with production-ready skills",
        milestones: [
          "Build a full-stack app with Next.js",
          "Learn basic testing (Jest, React Testing Library)",
          "Deploy projects on Vercel/Netlify",
          "Build a portfolio website"
        ]
      }
    ],
    totalDuration: "4-7 months",
    careerTips: [
      "Build projects while learning, not after",
      "Contribute to open source after Phase 2",
      "Network with other developers on Twitter/LinkedIn",
      "Start applying for jobs during Phase 3"
    ]
  },
  "Backend Developer": {
    phases: [
      {
        phase: 1,
        title: "Java & Programming Fundamentals",
        duration: "1-2 months",
        skills: ["Java Basics", "OOP Concepts", "Data Structures", "Git"],
        description: "Master Java programming and core concepts",
        milestones: [
          "Learn Java syntax, classes, and objects",
          "Understand OOP principles (inheritance, polymorphism, encapsulation)",
          "Implement common data structures (ArrayList, HashMap)",
          "Set up Git and version control"
        ]
      },
      {
        phase: 2,
        title: "Backend Development",
        duration: "2-3 months",
        skills: ["Spring Boot", "SQL & Databases", "REST APIs", "Authentication"],
        description: "Build robust backend systems",
        milestones: [
          "Create REST APIs with Spring Boot",
          "Design and query SQL databases",
          "Implement CRUD operations",
          "Add JWT authentication",
          "Learn Postman for API testing"
        ]
      },
      {
        phase: 3,
        title: "Production & Deployment",
        duration: "1-2 months",
        skills: ["Docker", "Deployment", "System Design", "Project Work"],
        description: "Prepare for production environments",
        milestones: [
          "Containerize applications with Docker",
          "Deploy backend on AWS/Heroku/Railway",
          "Learn basic system design patterns",
          "Build 1-2 full-stack projects",
          "Understand CI/CD basics"
        ]
      }
    ],
    totalDuration: "4-7 months",
    careerTips: [
      "Focus on writing clean, maintainable code",
      "Document your APIs properly",
      "Learn to read and debug logs effectively",
      "Practice coding problems on LeetCode (Easy/Medium)"
    ]
  },
  "Data Analyst": {
    phases: [
      {
        phase: 1,
        title: "Data Fundamentals",
        duration: "1-2 months",
        skills: ["Excel Advanced", "Statistics Basics", "SQL Fundamentals"],
        description: "Build foundation in data manipulation",
        milestones: [
          "Master Excel (VLOOKUP, PivotTables, formulas)",
          "Learn descriptive statistics (mean, median, standard deviation)",
          "Write SQL queries (SELECT, JOIN, GROUP BY)",
          "Analyze sample datasets"
        ]
      },
      {
        phase: 2,
        title: "Programming & Analysis",
        duration: "2-3 months",
        skills: ["Python", "Pandas", "Data Visualization", "Advanced SQL"],
        description: "Automate analysis with programming",
        milestones: [
          "Learn Python basics and Pandas library",
          "Create visualizations with Matplotlib/Seaborn",
          "Write complex SQL queries (subqueries, window functions)",
          "Clean and transform real-world datasets",
          "Perform exploratory data analysis (EDA)"
        ]
      },
      {
        phase: 3,
        title: "Dashboard & Reporting",
        duration: "1-2 months",
        skills: ["Tableau/Power BI", "Dashboard Design", "Business Intelligence"],
        description: "Create impactful visual reports",
        milestones: [
          "Build interactive dashboards in Tableau/Power BI",
          "Connect to databases and APIs",
          "Learn data storytelling principles",
          "Create a portfolio of 3-4 analysis projects",
          "Present insights effectively"
        ]
      }
    ],
    totalDuration: "4-7 months",
    careerTips: [
      "Always start with business questions, not data",
      "Focus on communicating insights clearly",
      "Build a portfolio showcasing real analysis",
      "Network on LinkedIn and share your work"
    ]
  }
}

export async function POST(req:NextRequest) {
    try {
        const body = await req.json();
        const {role, targetRole} = body;

        // Accept either role or targetRole
        const userRole = role || targetRole;

        if (!userRole) {
            return NextResponse.json(
                { error: "role or targetRole is required" },
                { status: 400 }
            );
        }

        const normalizeRole = userRole.trim();
        const roadmap = RoadMaps[normalizeRole];

        if(!roadmap) {
            return NextResponse.json({
                targetRole: normalizeRole,
                    phases: [
          {
            phase: 1,
            title: "Research & Planning",
            duration: "1 month",
            skills: ["Industry Research", "Skill Identification"],
            description: "Understand the role requirements",
            milestones: [
              "Research job descriptions for this role",
              "Identify common skills and technologies",
              "Connect with professionals in this field",
              "Create a personalized learning plan"
            ]
          },
          {
            phase: 2,
            title: "Core Learning",
            duration: "3-4 months",
            skills: ["Role-specific technical skills"],
            description: "Learn the fundamental skills",
            milestones: [
              "Complete online courses for core skills",
              "Build practice projects",
              "Join relevant communities",
              "Get feedback on your work"
            ]
          },
          {
            phase: 3,
            title: "Apply & Build",
            duration: "2-3 months",
            skills: ["Portfolio", "Networking", "Interviews"],
            description: "Prepare for job market",
            milestones: [
              "Build a professional portfolio",
              "Start networking actively",
              "Apply for positions",
              "Practice interviews"
            ]
          }
        ],
        totalDuration: "6-8 months",
        careerTips: [
          `Research the ${normalizeRole} role thoroughly`,
          "Connect with people already in this role",
          "Build projects relevant to the field",
          "Stay updated with industry trends"
        ],
        note: "This is a generic roadmap. Research specific requirements for your target role."
            })
        }
        return NextResponse.json({
            targetRole: normalizeRole,
            ...roadmap
        })
    }catch(error) {
        return NextResponse.json(
            { error: "An unexpected error occurred." },
            { status: 500 }
        );
    }
}