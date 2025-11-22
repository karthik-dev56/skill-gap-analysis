'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface SkillGapData {
  targetRole: string;
  matchedSkills: string[];
  missingSkills: string[];
  recommendations: string[];
  suggestedLearningOrder: string[];
  matchPercentage: number;
}

interface RoadmapPhase {
  phase: number;
  title: string;
  duration: string;
  skills: string[];
  description: string;
  milestones: string[];
}

interface RoadmapData {
  targetRole: string;
  phases: RoadmapPhase[];
  totalDuration: string;
  careerTips: string[];
  note?: string;
}

interface HackerNewsStory {
  id: number;
  title: string;
  url: string;
  score: number;
  timeFormatted: string;
  type: string;
  by: string;
}

interface HackerNewsData {
  stories: HackerNewsStory[];
  count: number;
  fetchedAt: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [skillGapData, setSkillGapData] = useState<SkillGapData | null>(null);
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
  const [newsData, setNewsData] = useState<HackerNewsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasSaved, setHasSaved] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
       
        const storedData = sessionStorage.getItem('careerInput');
        if (!storedData) {
          router.push('/');
          return;
        }

        const inputData = JSON.parse(storedData);
        const { targetRole, currentSkills } = inputData;

      
        const [skillGapResponse, roadmapResponse, newsResponse] = await Promise.all([
          fetch('/api/skill-gap', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ targetRole, currentSkills })
          }),
          fetch('/api/roadmap', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ targetRole })
          }),
          fetch('/api/hackernews')
        ]);

        if (!skillGapResponse.ok || !roadmapResponse.ok || !newsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const skillGap = await skillGapResponse.json();
        const roadmap = await roadmapResponse.json();
        const news = await newsResponse.json();

        setSkillGapData(skillGap);
        setRoadmapData(roadmap);
        setNewsData(news);

        
        if (!hasSaved) {
          try {
            await fetch('/api/save-analysis', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                targetRole,
                currentSkills,
                skillGapResult: skillGap,
                roadmapResult: roadmap
              })
            });
            setHasSaved(true);
            console.log('Analysis saved to file storage');
          } catch (saveError) {
            console.error('Failed to save analysis:', saveError);
            
          }
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again.');
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Analyzing your career path...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
     
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/')}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="font-medium">Go Back</span>
              </button>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  Career Analysis Results
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm">
                  Target Role: <span className="font-semibold">{skillGapData?.targetRole}</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push('/')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm"
            >
              New Analysis
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
         
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                1
              </span>
              Skill Gap Analysis
            </h2>

           
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Match Percentage</span>
                <span className="text-sm font-bold text-blue-600">{skillGapData?.matchPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${skillGapData?.matchPercentage}%` }}
                ></div>
              </div>
            </div>

            
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Matched Skills ({skillGapData?.matchedSkills.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {skillGapData?.matchedSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
                {skillGapData?.matchedSkills.length === 0 && (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No matched skills yet</p>
                )}
              </div>
            </div>

           
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
                <span className="text-orange-500 mr-2">⚠</span>
                Missing Skills ({skillGapData?.missingSkills.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {skillGapData?.missingSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
                {skillGapData?.missingSkills.length === 0 && (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">You have all required skills!</p>
                )}
              </div>
            </div>

           
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Recommendations</h3>
              <ul className="space-y-2">
                {skillGapData?.recommendations.map((rec, index) => (
                  <li key={index} className="text-gray-700 dark:text-gray-300 text-sm flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            
            {skillGapData?.suggestedLearningOrder && skillGapData.suggestedLearningOrder.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Suggested Learning Order</h3>
                <ol className="space-y-2">
                  {skillGapData.suggestedLearningOrder.map((skill, index) => (
                    <li key={index} className="text-gray-700 dark:text-gray-300 text-sm flex items-center">
                      <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3">
                        {index + 1}
                      </span>
                      {skill}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <span className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                2
              </span>
              Career Roadmap
            </h2>

            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Duration: <span className="font-semibold text-gray-900 dark:text-white">{roadmapData?.totalDuration}</span>
              </p>
            </div>

          
            <div className="space-y-4 mb-6">
              {roadmapData?.phases.map((phase, index) => (
                <div key={index} className="border-l-4 border-purple-500 pl-4 py-2">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">
                        Phase {phase.phase}: {phase.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{phase.duration}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{phase.description}</p>
                  
                 
                  <div className="mb-2">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Skills to learn:</p>
                    <div className="flex flex-wrap gap-1">
                      {phase.skills.map((skill, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Milestones */}
                  <div>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Milestones:</p>
                    <ul className="space-y-1">
                      {phase.milestones.map((milestone, idx) => (
                        <li key={idx} className="text-xs text-gray-700 dark:text-gray-300 flex items-start">
                          <span className="text-purple-500 mr-1">▸</span>
                          <span>{milestone}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Career Tips */}
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Career Tips</h3>
              <ul className="space-y-1">
                {roadmapData?.careerTips.map((tip, index) => (
                  <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
                    <span className="text-purple-500 mr-2">💡</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {roadmapData?.note && (
              <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-300">{roadmapData.note}</p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section: Latest Tech News */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <span className="bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300 rounded-full w-8 h-8 flex items-center justify-center mr-3">
              3
            </span>
            Latest Tech News from HackerNews
          </h2>

          <div className="space-y-4">
            {newsData?.stories.map((story, index) => (
              <div
                key={story.id}
                className="border-l-4 border-orange-500 pl-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <a
                      href={story.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition"
                    >
                      {index + 1}. {story.title}
                    </a>
                    <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center">
                        <span className="font-semibold mr-1">Score:</span> {story.score}
                      </span>
                      <span className="flex items-center">
                        <span className="font-semibold mr-1">By:</span> {story.by}
                      </span>
                      <span className="flex items-center">
                        <span className="font-semibold mr-1">Time:</span> {story.timeFormatted}
                      </span>
                      <span className="flex items-center">
                        <span className="font-semibold mr-1">Type:</span> {story.type}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {newsData && newsData.stories.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">No stories available at the moment.</p>
          )}
        </div>
      </div>
    </div>
  );
}
