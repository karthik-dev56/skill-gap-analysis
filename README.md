# Career Path Analyzer

A full-stack web application that helps users analyze their career path by identifying skill gaps, providing personalized roadmaps, and keeping them updated with the latest tech news.

##  Features

### 1. Career Goal Input Page
- User-friendly form to input target role and current skills
- Support for predefined roles and custom role entries
- Multi-skill input with comma-separated values
- Responsive design for all screen sizes
- Analysis history access

### 2. Skill Gap Analysis API (`POST /api/skill-gap`)
- Analyzes user skills against predefined role requirements
- Returns:
  - **Matched Skills**: Skills the user already has
  - **Missing Skills**: Skills needed for the target role
  - **Match Percentage**: Percentage of skills matched
  - **Recommendations**: Personalized career advice based on skill level
  - **Suggested Learning Order**: Optimized sequence for learning missing skills

**Predefined Roles:**
- Frontend Developer: HTML, CSS, JavaScript, React, Git
- Backend Developer: Java, Spring Boot, SQL, APIs, Git
- Data Scientist: Excel, SQL, Python, Dashboards, Statistics

### 3. Career Roadmap API (`POST /api/roadmap`)
- Generates a 3-phase learning roadmap based on target role
- Each phase includes:
  - Duration estimate
  - Skills to learn
  - Detailed milestones
  - Description and goals
- Career tips and guidance
- Total duration estimation

### 4. HackerNews Integration (`GET /api/hackernews`)
- Fetches top 5 latest tech stories from HackerNews API
- Displays:
  - Title
  - URL
  - Score
  - Author
  - Formatted timestamp
  - Story type

### 5. Analysis History (JSON File Storage)
- Automatic saving of all analyses to `data/user-analyses.json`
- View complete history at `/history` page
- Persistent storage across server restarts
- Detailed view of past analyses with all results

### 6. Combined Dashboard
- **Skill Gap Section**: Analysis with visual progress indicators
- **Career Roadmap Section**: Phase-by-phase learning path
- **Tech News Section**: Latest HackerNews stories
- **Navigation**: Go back button and new analysis option
- Clean, responsive layout

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: React Hooks (useState, useEffect)
- **Routing**: Next.js App Router

### Backend
- **Framework**: Next.js API Routes
- **Runtime**: Node.js
- **Language**: TypeScript
- **Data Storage**: JSON file system (no database)

### External APIs
- HackerNews Firebase API

## 📁 Project Structure

```
skill-gap-analysis/
├── src/
│   └── app/
│       ├── api/                    # API routes
│       │   ├── skill-gap/
│       │   │   └── route.ts        # Skill gap analysis endpoint
│       │   ├── roadmap/
│       │   │   └── route.ts        # Career roadmap endpoint
│       │   ├── hackernews/
│       │   │   └── route.ts        # HackerNews integration endpoint
│       │   └── save-analysis/
│       │       └── route.ts        # Save/retrieve analysis history
│       ├── dashboard/
│       │   └── page.tsx            # Dashboard page (results)
│       ├── history/
│       │   └── page.tsx            # Analysis history page
│       ├── page.tsx                # Home page (input form)
│       ├── layout.tsx              # Root layout
│       └── globals.css             # Global styles
├── data/
│   └── user-analyses.json          # Stored user analyses
├── public/                         # Static assets
├── package.json                    # Dependencies
├── tsconfig.json                   # TypeScript config
├── next.config.ts                  # Next.js config
├── postcss.config.mjs              # PostCSS config
├── eslint.config.mjs               # ESLint config
└── README.md                       # This file
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone or download the repository**
   ```bash
   cd skill-gap-analysis
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)
   
   Note: If port 3000 is in use, the app will automatically use port 3001

### Build for Production

```bash
npm run build
npm start
```

## 📡 API Endpoints

### 1. Skill Gap Analysis
**Endpoint**: `POST /api/skill-gap`

**Request Body**:
```json
{
  "targetRole": "Backend Developer",
  "currentSkills": "Java, SQL, Git"
}
```

**Response**:
```json
{
  "targetRole": "Backend Developer",
  "matchedSkills": ["Java", "SQL", "Git"],
  "missingSkills": ["Spring Boot", "APIs"],
  "recommendations": [
    "You're 60% ready for the Backend Developer role!",
    "Focus on learning: Spring Boot, APIs",
    "You can start applying for junior positions while learning."
  ],
  "suggestedLearningOrder": ["APIs", "Spring Boot"],
  "matchPercentage": 60
}
```

### 2. Career Roadmap
**Endpoint**: `POST /api/roadmap`

**Request Body**:
```json
{
  "targetRole": "Backend Developer"
}
```

**Response**:
```json
{
  "targetRole": "Backend Developer",
  "phases": [
    {
      "phase": 1,
      "title": "Java & Programming Fundamentals",
      "duration": "1-2 months",
      "skills": ["Java Basics", "OOP Concepts", "Data Structures", "Git"],
      "description": "Master Java programming and core concepts",
      "milestones": [
        "Learn Java syntax, classes, and objects",
        "Understand OOP principles"
      ]
    }
  ],
  "totalDuration": "4-7 months",
  "careerTips": [
    "Focus on writing clean, maintainable code",
    "Document your APIs properly"
  ]
}
```

### 3. HackerNews Stories
**Endpoint**: `GET /api/hackernews`

**Response**:
```json
{
  "stories": [
    {
      "id": 123456,
      "title": "Example Tech Story",
      "url": "https://example.com",
      "score": 150,
      "timeFormatted": "2024-11-15T10:30:00.000Z",
      "type": "story",
      "by": "username"
    }
  ],
  "count": 5,
  "fetchedAt": "2024-11-15T10:30:00.000Z"
}
```

### 4. Save Analysis
**Endpoint**: `POST /api/save-analysis`

**Request Body**:
```json
{
  "targetRole": "Backend Developer",
  "currentSkills": "Java, SQL, Git",
  "skillGapResult": { "..." },
  "roadmapResult": { "..." }
}
```

**Response**:
```json
{
  "success": true,
  "message": "Analysis saved successfully",
  "id": "analysis_1234567890_abc123",
  "totalAnalyses": 5
}
```

**Endpoint**: `GET /api/save-analysis`

**Response**:
```json
{
  "analyses": [
    {
      "id": "analysis_1234567890_abc123",
      "timestamp": "2024-11-22T10:30:00.000Z",
      "targetRole": "Backend Developer",
      "currentSkills": "Java, SQL, Git",
      "skillGapResult": { "..." },
      "roadmapResult": { "..." }
    }
  ],
  "count": 5
}
```

**Storage**: All analyses are automatically saved to `data/user-analyses.json`

## 🎯 How to Use

1. **Enter Career Information**
   - Select or type your target role (e.g., Frontend Developer)
   - Enter your current skills separated by commas (e.g., HTML, CSS, JavaScript)
   - Click "Analyze My Career Path"

2. **View Results Dashboard**
   - Review your skill gap analysis with match percentage
   - See which skills you have and which are missing
   - Explore the phase-by-phase career roadmap
   - Check out the latest tech news from HackerNews
   - Use the "Go Back" button to return or "New Analysis" to start fresh

3. **Plan Your Learning**
   - Follow the suggested learning order for missing skills
   - Use the roadmap milestones as checkpoints
   - Apply the career tips and recommendations provided
   - Track estimated time for each learning phase

4. **View Analysis History**
   - Click "View Analysis History" link on the home page
   - Browse all previously saved analyses
   - Review past results and track your progress
   - All data is stored in `data/user-analyses.json`

## 🔧 Key Implementation Details

### Architecture
- **Next.js App Router**: Modern React patterns with built-in API routes
- **Server-Side API Routes**: Backend logic on server for better security
- **Session Storage**: Temporary data persistence between page navigation
- **File System Storage**: JSON file for persistent analysis history

### Data Management
- **JSON File Storage**: All analyses automatically saved to `data/user-analyses.json`
- **Persistent Storage**: Data survives server restarts
- **No Database Required**: Simple file-based storage system
- **In-Memory Role Definitions**: Predefined roles stored in API route files

### Styling & UX
- **Tailwind CSS v4**: Utility-first CSS framework
- **Dark Mode Support**: Built-in dark mode compatibility
- **Responsive Design**: Mobile-first approach
- **Visual Feedback**: Progress indicators, badges, and hover effects
- **Loading States**: Spinner and status messages for better UX

### Error Handling
- API validation for required fields
- Try-catch blocks for external API calls
- User-friendly error messages
- Graceful fallbacks for missing data
- 404 handling for invalid routes

## 🎨 Design Features

- **Clean Interface**: Focus on functionality and clarity
- **Color Coding**: Visual distinction between different sections
- **Progress Visualization**: Percentage bars and skill badges
- **Accessible Design**: Semantic HTML and proper contrast ratios
- **Smooth Transitions**: Hover effects and loading animations
- **Mobile Responsive**: Optimized for all screen sizes

## 📝 Technical Notes

1. **Predefined Roles**: Three main roles (Frontend, Backend, Data Scientist) with support for custom roles
2. **Skill Matching**: Case-insensitive comparison for flexibility
3. **Generic Roadmaps**: Custom roles receive generic 3-phase roadmaps
4. **Session-Based Navigation**: Data persists during browser session
5. **HackerNews API**: Fetches top 5 stories using Firebase API
6. **File Storage**: Analyses saved to `data/user-analyses.json` with unique IDs

**Career Path Analyzer - Your personalized tech career guide**

