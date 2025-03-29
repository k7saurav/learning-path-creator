
import React, { useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import LearningGoalForm from '@/components/LearningGoalForm';
import LearningPath, { LearningModule } from '@/components/LearningPath';
import { toast } from '@/components/ui/use-toast';
import { generateLearningPathWithAI, LearningPath as LearningPathType } from '@/lib/gemini';

const Index = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [learningPath, setLearningPath] = useState<LearningPathType | null>(null);

  const handleGoalSubmit = async (data: {
    goal: string;
    skillLevel: string;
    timeAvailability: string;
  }) => {
    try {
      setIsGenerating(true);
      const generatedPath = await generateLearningPathWithAI(data);
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
