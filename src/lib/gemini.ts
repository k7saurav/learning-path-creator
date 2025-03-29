
// Google Gemini API integration for learning paths
import { toast } from "@/components/ui/use-toast";

const GEMINI_API_KEY = "AIzaSyDv550bKhRfnZkVHXhEMnpRNvTFXBSBrxI";
// Updated API URL to use the correct endpoint format
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent";

export type LearningResource = {
  type: 'video' | 'article' | 'course';
  title: string;
  url: string;
};

export type LearningModule = {
  id: string;
  title: string;
  description: string;
  status: 'not-started' | 'in-progress' | 'completed';
  estimatedHours: number;
  resources: LearningResource[];
};

export type LearningPath = {
  id?: string;
  title: string;
  description: string;
  modules: LearningModule[];
  created_at?: string;
  user_id?: string;
};

export type LearningGoalData = {
  goal: string;
  skillLevel: string;
  timeAvailability: string;
};

export async function generateLearningPathWithAI(data: LearningGoalData): Promise<LearningPath> {
  try {
    // Prepare the prompt for Gemini
    const prompt = `
      Create a detailed learning path for ${data.goal} for someone with a ${data.skillLevel} skill level 
      and ${data.timeAvailability} time availability (${data.timeAvailability === 'low' ? '1-3' : data.timeAvailability === 'medium' ? '4-7' : '8+'} hours per week).
      
      Format the response as a JSON object with the following structure:
      {
        "title": "Learning Path Title",
        "description": "Brief description of the learning path",
        "modules": [
          {
            "id": "unique_id_1",
            "title": "Module Title",
            "description": "Module description",
            "estimatedHours": number_of_hours,
            "resources": [
              {
                "type": "video|article|course",
                "title": "Resource Title",
                "url": "https://example.com"
              }
            ]
          }
        ]
      }
      
      Please include 3-5 modules with 2-3 resources per module. Make sure the resources are realistic and relevant to the skill level.
      Adjust the estimated hours based on the time availability.
    `;

    // Make API request to Gemini with updated request format
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", errorData);
      throw new Error("Failed to generate learning path");
    }

    const responseData = await response.json();
    
    // Extract the text from the Gemini response - updated for the v1 API structure
    const generatedText = responseData.candidates[0].content.parts[0].text;
    
    // For debugging
    console.log("Generated response:", generatedText);
    
    // Find the JSON object in the text
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error("Could not parse learning path from AI response");
    }
    
    // Parse the JSON
    const learningPathData = JSON.parse(jsonMatch[0]);
    
    // Add status to each module
    const learningPath: LearningPath = {
      ...learningPathData,
      modules: learningPathData.modules.map((module: any) => ({
        ...module,
        status: 'not-started',
      }))
    };
    
    return learningPath;
  } catch (error) {
    console.error("Error generating learning path:", error);
    throw error;
  }
}

// Fallback function if API fails
export function generateFallbackLearningPath(data: LearningGoalData): LearningPath {
  // Generate a basic fallback learning path
  const fallbackPath: LearningPath = {
    title: `${data.goal} Learning Path`,
    description: `A learning path for ${data.goal} tailored for ${data.skillLevel} level with ${data.timeAvailability} time availability.`,
    modules: [
      {
        id: "module_1",
        title: "Getting Started",
        description: "Introduction to the fundamentals.",
        status: "not-started",
        estimatedHours: data.timeAvailability === 'low' ? 2 : (data.timeAvailability === 'medium' ? 4 : 6),
        resources: [
          {
            type: "article",
            title: "Introduction Guide",
            url: "https://example.com/intro-guide"
          },
          {
            type: "video",
            title: "Beginner Tutorial",
            url: "https://example.com/beginner-tutorial"
          }
        ]
      },
      {
        id: "module_2",
        title: "Core Concepts",
        description: "Essential principles and ideas.",
        status: "not-started",
        estimatedHours: data.timeAvailability === 'low' ? 3 : (data.timeAvailability === 'medium' ? 5 : 8),
        resources: [
          {
            type: "course",
            title: "Core Principles Course",
            url: "https://example.com/core-course"
          },
          {
            type: "article",
            title: "Best Practices Guide",
            url: "https://example.com/best-practices"
          }
        ]
      },
      {
        id: "module_3",
        title: "Advanced Topics",
        description: "Taking your skills to the next level.",
        status: "not-started",
        estimatedHours: data.timeAvailability === 'low' ? 3 : (data.timeAvailability === 'medium' ? 6 : 10),
        resources: [
          {
            type: "video",
            title: "Advanced Techniques",
            url: "https://example.com/advanced-techniques"
          },
          {
            type: "article",
            title: "Expert Tips and Tricks",
            url: "https://example.com/expert-tips"
          }
        ]
      }
    ]
  };
  
  return fallbackPath;
}
