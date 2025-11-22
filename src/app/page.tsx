'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [role,SettargetRole] = useState("");
  const [skills,SetcurrentSkills] = useState("");
  const [error,errorMessage] = useState("");

  const predefinedRoles: string[] = [
    "Frontend Developer",
    "Backend Developer",
    "Data Scientist"
  ]

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    errorMessage("");
    if(!role || !skills) {
      errorMessage("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const inputData = {
        targetRole: role.trim(),
        currentSkills: skills.trim()
      }
      localStorage.setItem('careerInput',JSON.stringify(inputData));
      router.push('/dashboard')
    }catch(error) {
      errorMessage('Something went wrong. Please try again.');
      setLoading(false);
    }
  }
    return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Career Path Analyzer
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover your skill gaps, get a personalized roadmap, and stay updated with the latest tech news
          </p>
          <div className="mt-4">
            <a
              href="/history"
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              View Analysis History (JSON File Storage)
            </a>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
            Let's Analyze Your Career Path
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Target Role Input */}
            <div>
              <label htmlFor="targetRole" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Target Role *
              </label>
              <select
                id="targetRole"
                value={role}
                onChange={(e) => SettargetRole(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
              >
                <option value="">Select a role or type your own below</option>
                {predefinedRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>

              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">Or enter custom role:</div>
              <input
                type="text"
                value={role}
                onChange={(e) => SettargetRole(e.target.value)}
                placeholder="e.g., Full Stack Developer, DevOps Engineer"
                className="mt-2 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
              />
            </div>

            
            <div>
              <label htmlFor="currentSkills" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Skills *
              </label>
              <textarea
                id="currentSkills"
                value={skills}
                onChange={(e) => SetcurrentSkills(e.target.value)}
                placeholder="Enter your skills separated by commas (e.g., HTML, CSS, JavaScript, Python)"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition resize-none"
              />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Separate multiple skills with commas
              </p>
            </div>

           
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </span>
              ) : (
                'Analyze My Career Path'
              )}
            </button>
          </form>

          
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-2">What you'll get:</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span>Detailed skill gap analysis</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span>Personalized learning roadmap with phases</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span>Career tips and recommendations</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span>Latest tech news from HackerNews</span>
              </li>
            </ul>
          </div>
        </div>

        
        <div className="text-center mt-12 text-gray-600 dark:text-gray-400">
          <p className="text-sm">Built with Next.js, TypeScript, and Tailwind CSS</p>
        </div>
      </div>
    </div>
  );
};