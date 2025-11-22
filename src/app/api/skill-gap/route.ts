
import { NextRequest, NextResponse } from "next/server";

const SKILLS: Record<string, string[]> ={
    "Frontend Developer": ["HTML", "CSS", "JavaScript", "React", "Git"],
    "Backend Developer": ["Java", "Spring Boot", "SQL", "APIs", "Git"],
    "Data Scientist": ["Excel", "SQL", "Python", "Dashboards", "Statistics"]
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { role, targetRole, currentSkills } = body;

       
        const userRole = role || targetRole;

        if(!userRole || !currentSkills) {
            return NextResponse.json(
                {error : "role (or targetRole) and currentSkills are required"},
                { status : 400}
            )
        }

        const normalrole = userRole.trim();
        const normalskills = Array.isArray(currentSkills)?currentSkills.map((skill: string)=> skill.trim())
        :currentSkills.split(",").map((skill: string) => skill.trim());

        const requiredskills = SKILLS[normalrole];
        
        if(!requiredskills) {
            return NextResponse.json( {
                targetRole: normalrole,
                matchedSkills: [],
                missingSkills: [],
                recommendations: [
                    `The role "${normalrole}" is not recognized. Please provide a valid role.`
                ],
                suggestedLearningOrder: [],
                matchPercentage: 0,
            });
        }
        const matchedSkills = requiredskills.filter(reqskill=> normalskills.some((skill: string) => skill.toLowerCase() === reqskill.toLowerCase()));
        const missingSkills = requiredskills.filter(reqskill => !normalskills.some((nskill: string) => nskill.toLowerCase() === reqskill.toLowerCase()));

        const Percentage = Math.round((matchedSkills.length / requiredskills.length) * 100);

        const recommendations = generateReccomendations(normalrole, missingSkills, Percentage);
        const learningOrder = generateLearningOrder(normalrole, missingSkills);

        return NextResponse.json({
            targetRole: normalrole,
            matchedSkills,
            missingSkills,
            recommendations,
            suggestedLearningOrder: learningOrder,
            matchPercentage: Percentage,
        });

    } catch(error) {
        return NextResponse.json(
            { error: "An unexpected error occurred." },
            { status: 500 }
        );
    }
}

function generateReccomendations(role:string,missingSkills:string[],Percentage: number):string[] {
    const reccommendations: string[] =[]
    if (Percentage === 100) {
    reccommendations.push(`Congratulations! You have all the required skills for ${role}.`);
    reccommendations.push("Focus on building projects and gaining practical experience.");
    reccommendations.push("Consider learning advanced topics to stand out.");
  } else if (Percentage >= 60) {
    reccommendations.push(`You're ${Percentage}% ready for the ${role} role!`);
    reccommendations.push(`Focus on learning: ${missingSkills.join(', ')}`);
    reccommendations.push("You can start applying for junior positions while learning.");
  } else if (Percentage >= 40) {
    reccommendations.push(`You have a good foundation (${Percentage}% match).`);
    reccommendations.push(`Priority skills to learn: ${missingSkills.slice(0, 3).join(', ')}`);
    reccommendations.push("Dedicate 2-3 months of focused learning before applying.");
  } else {
    reccommendations.push(`You're at the beginning of your ${role} journey (${Percentage}% match).`);
    reccommendations.push("Follow the suggested learning order below.");
    reccommendations.push("Expect 4-6 months of dedicated learning.");
  }

  return reccommendations;
}

//Helper function
function generateLearningOrder(role:string,missingSkills:string[]):string[] {
    const learningProperties: Record<string,Record<string,number>> = {
      "Frontend Developer": {
      "HTML": 1,
      "CSS": 2,
      "JavaScript": 3,
      "Git": 4,
      "React": 5
    },
    "Backend Developer": {
      "Java": 1,
      "Git": 2,
      "SQL": 3,
      "APIs": 4,
      "Spring Boot": 5
    },
    "Data Analyst": {
      "Excel": 1,
      "Statistics": 2,
      "SQL": 3,
      "Python": 4,
      "Dashboards": 5
    }
    }
    const roleLearningProperties = learningProperties[role];
    
    return missingSkills.sort((a,b) => {
        const orderA = roleLearningProperties[a] || Number.MAX_VALUE;
        const orderB = roleLearningProperties[b] || Number.MAX_VALUE;
        return orderA - orderB;
    })
}