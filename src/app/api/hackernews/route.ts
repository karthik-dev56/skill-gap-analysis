import { NextResponse } from "next/server";

interface HackerNewsItem {
  id: number;
  title: string;
  url?: string;
  score: number;
  time: number;
  type: string;
  by: string;
}

export async function GET() {
    try {
      const topStoriesResponse = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json',{cache: 'no-store'});  
      const topstoryId: number[] = await topStoriesResponse.json();
      const top5Ids = topstoryId.slice(0, 5);

      const storyPromises = top5Ids.map(async (id) => {
        const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`,{cache: 'no-store'});
        return response.json();
      })
      const stories: HackerNewsItem[] = await Promise.all(storyPromises);   
      const formattedStories = stories.map((story) => ({
        id: story.id,
        title: story.title,
        url: story.url || '#',
        score: story.score,
        timeFormatted: new Date(story.time * 1000).toISOString(),
        type: story.type,
        by: story.by,
      })); 
      return NextResponse.json({ 
        stories: formattedStories,
        count: formattedStories.length,
        fetchedAt: new Date().toISOString() 
      });
    }catch (error) {
        return NextResponse.json(
            { error: "An unexpected error occurred." },
            { status: 500 }
        );
    }
}