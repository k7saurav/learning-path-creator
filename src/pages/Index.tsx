import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import LearningGoalForm from '@/components/LearningGoalForm';
import LearningPath, { LearningModule } from '@/components/LearningPath';
import { toast } from '@/components/ui/use-toast';
import { 
  generateLearningPathWithAI, 
  generateFallbackLearningPath,
  LearningPath as LearningPathType 
} from '@/lib/gemini';
import { useAuth } from '@/contexts/AuthContext';
import { saveLearningPath } from '@/lib/learningPathService';
import { Button } from '@/components/ui/button';
import { Folder, Save } from 'lucide-react';

interface ExtendedLearningPath extends LearningPathType {
  isSaved?: boolean;
}

const Index = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [learningPath, setLearningPath] = useState<ExtendedLearningPath | null>(null);
  const [isPathSaved, setIsPathSaved] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user && location.pathname === '/' && !location.state?.selectedPath) {
      navigate('/dashboard');
      return;
    }
    
    if (location.state?.selectedPath) {
      const selectedPath = location.state.selectedPath;
      if (selectedPath.isSaved === undefined) {
        selectedPath.isSaved = true;
      }
      setLearningPath(selectedPath);
      setIsPathSaved(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state, user, navigate, location.pathname]);

  const handleGoalSubmit = async (data: {
    goal: string;
    skillLevel: string;
    timeAvailability: string;
  }) => {
    try {
      setIsGenerating(true);
      let generatedPath;
      
      try {
        generatedPath = await generateLearningPathWithAI(data);
      } catch (apiError) {
        console.error("API Error, using fallback:", apiError);
        generatedPath = generateFallbackLearningPath(data);
        toast({
          title: "Using offline mode",
          description: "We couldn't connect to our AI. Using a basic learning path instead.",
          variant: "destructive",
        });
      }
      
      generatedPath.isSaved = false;
      setLearningPath(generatedPath);
      setIsPathSaved(false);
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

  const handleSaveLearningPath = async () => {
    if (!user || !learningPath) return;
    
    try {
      const { error } = await saveLearningPath(learningPath, user.id);
      
      if (error) {
        throw error;
      }
      
      setLearningPath({
        ...learningPath,
        isSaved: true
      });
      setIsPathSaved(true);
      toast({
        title: "Success",
        description: "Learning path saved successfully!",
      });
    } catch (error) {
      console.error("Error saving learning path:", error);
      toast({
        title: "Error",
        description: "Failed to save learning path.",
        variant: "destructive",
      });
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
      
      if (isPathSaved) {
        setIsPathSaved(false);
      }
    }
  };

  const handleGetStarted = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    const formElement = document.getElementById('learning-goal-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewMyPaths = () => {
    navigate('/my-paths');
  };

  const renderDashboardContent = () => {
    return (
      <>
        {!learningPath && (
          <section id="learning-goal-form" className="py-16 container">
            <LearningGoalForm onSubmit={handleGoalSubmit} isLoading={isGenerating} />
          </section>
        )}
        
        {learningPath && (
          <section className="py-16 container">
            <div className="mb-8 flex justify-between">
              <Button
                onClick={handleViewMyPaths}
                variant="outline"
                className="flex items-center gap-1"
              >
                <Folder className="h-4 w-4" />
                View My Paths
              </Button>
              
              <div className="flex gap-4">
                {user && !learningPath.isSaved && !isPathSaved && (
                  <Button
                    onClick={handleSaveLearningPath}
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    <Save className="h-4 w-4" />
                    Save Path
                  </Button>
                )}
                <Button
                  onClick={() => setLearningPath(null)}
                  className="text-brand-purple hover:text-primary hover:underline"
                  variant="ghost"
                >
                  Create New Learning Path
                </Button>
              </div>
            </div>
            <LearningPath
              title={learningPath.title}
              description={learningPath.description}
              modules={learningPath.modules}
              onModuleStatusChange={handleModuleStatusChange}
              isSaved={learningPath.isSaved || isPathSaved}
              pathId={learningPath.id}
            />
          </section>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {(!user || location.pathname === '/') && !learningPath && (
          <Hero onGetStarted={handleGetStarted} />
        )}
        
        {(location.pathname === '/dashboard') && renderDashboardContent()}
        
        {user && location.pathname === '/' && learningPath && renderDashboardContent()}
      </main>
      
      <footer className="border-t py-6 bg-background">
        <div className="container text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} Learning Path Creator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
