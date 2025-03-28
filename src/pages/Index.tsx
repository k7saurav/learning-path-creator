
import React, { useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import LearningGoalForm from '@/components/LearningGoalForm';
import LearningPath, { LearningModule } from '@/components/LearningPath';
import { toast } from '@/components/ui/use-toast';

// Mock data service - simulating API call
const generateLearningPath = async (goal: string, skillLevel: string, timeAvailability: string) => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  // This would be replaced by a real API call in production
  const modules: LearningModule[] = [
    {
      id: "1",
      title: `${goal} Fundamentals`,
      description: `Learn the core concepts of ${goal} suitable for a ${skillLevel} level learner.`,
      status: "not-started",
      estimatedHours: timeAvailability === 'low' ? 2 : timeAvailability === 'medium' ? 4 : 6,
      resources: [
        {
          type: "video",
          title: `Introduction to ${goal}`,
          url: "https://example.com/intro",
        },
        {
          type: "article",
          title: "Getting Started Guide",
          url: "https://example.com/guide",
        },
      ],
    },
    {
      id: "2",
      title: `${goal} Practical Application`,
      description: "Apply what you've learned in real-world scenarios.",
      status: "not-started",
      estimatedHours: timeAvailability === 'low' ? 3 : timeAvailability === 'medium' ? 5 : 8,
      resources: [
        {
          type: "course",
          title: "Hands-on Workshop",
          url: "https://example.com/workshop",
        },
        {
          type: "video",
          title: "Step-by-Step Tutorial",
          url: "https://example.com/tutorial",
        },
      ],
    },
    {
      id: "3",
      title: "Advanced Techniques",
      description: "Master advanced concepts and specialized knowledge.",
      status: "not-started",
      estimatedHours: timeAvailability === 'low' ? 4 : timeAvailability === 'medium' ? 7 : 10,
      resources: [
        {
          type: "article",
          title: "Expert Guidelines",
          url: "https://example.com/expert",
        },
        {
          type: "course",
          title: "Masterclass",
          url: "https://example.com/masterclass",
        },
      ],
    },
  ];

  return {
    title: `Your ${goal} Learning Journey`,
    description: `A personalized learning path for ${skillLevel} level students with ${timeAvailability} time availability.`,
    modules,
  };
};

const Index = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [learningPath, setLearningPath] = useState<{
    title: string;
    description: string;
    modules: LearningModule[];
  } | null>(null);

  const handleGoalSubmit = async (data: {
    goal: string;
    skillLevel: string;
    timeAvailability: string;
  }) => {
    try {
      setIsGenerating(true);
      const generatedPath = await generateLearningPath(
        data.goal,
        data.skillLevel,
        data.timeAvailability
      );
      setLearningPath(generatedPath);
      toast({
        title: "Learning path created!",
        description: "Your personalized learning journey is ready.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate learning path. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleModuleStatusChange = (moduleId: string, status: LearningModule['status']) => {
    if (learningPath) {
      const updatedModules = learningPath.modules.map((module) =>
        module.id === moduleId ? { ...module, status } : module
      );
      setLearningPath({
        ...learningPath,
        modules: updatedModules,
      });
      
      toast({
        title: "Progress updated",
        description: `Module status changed to ${status}.`,
      });
    }
  };

  const handleGetStarted = () => {
    const formElement = document.getElementById('learning-goal-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section - Only show when no learning path is generated */}
        {!learningPath && <Hero onGetStarted={handleGetStarted} />}
        
        {/* Learning Goal Form - Only show when no learning path is generated */}
        {!learningPath && (
          <section id="learning-goal-form" className="py-16 container">
            <LearningGoalForm onSubmit={handleGoalSubmit} isLoading={isGenerating} />
          </section>
        )}
        
        {/* Learning Path Display - Show after generation */}
        {learningPath && (
          <section className="py-16 container">
            <div className="mb-8 flex justify-end">
              <button
                onClick={() => setLearningPath(null)}
                className="text-brand-purple hover:text-primary hover:underline flex items-center gap-1"
              >
                Create New Learning Path
              </button>
            </div>
            <LearningPath
              title={learningPath.title}
              description={learningPath.description}
              modules={learningPath.modules}
              onModuleStatusChange={handleModuleStatusChange}
            />
          </section>
        )}
      </main>
      
      {/* Footer */}
      <footer className="border-t py-6 bg-background">
        <div className="container text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} Learning Path Creator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
