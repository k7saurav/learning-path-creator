
// Google Gemini API integration for learning paths
import { toast } from "@/components/ui/use-toast";

const GEMINI_API_KEY = "AIzaSyDv550bKhRfnZkVHXhEMnpRNvTFXBSBrxI";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

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
  title: string;
  description: string;
  modules: LearningModule[];
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

    // Make API request to Gemini
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
          topK: 40,
          topP: 0.95,
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
    
    // Extract the text from the Gemini response
    const generatedText = responseData.candidates[0].content.parts[0].text;
    
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
