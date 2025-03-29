
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import MyPaths from '@/components/MyPaths';
import { useAuth } from '@/contexts/AuthContext';
import { getUserLearningPaths, deleteLearningPath } from '@/lib/learningPathService';
import { LearningPath as LearningPathType } from '@/lib/gemini';
import { toast } from '@/components/ui/use-toast';

const MyPathsPage: React.FC = () => {
  const [paths, setPaths] = useState<LearningPathType[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPaths();
  }, [user]);

  const fetchPaths = async () => {
    if (!user) return;
    
    setIsLoading(true);
    const { data, error } = await getUserLearningPaths(user.id);
    
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load your learning paths',
        variant: 'destructive',
      });
      console.error(error);
    } else {
      setPaths(data);
    }
    
    setIsLoading(false);
  };

  const handleSelectPath = (path: LearningPathType) => {
    navigate('/', { state: { selectedPath: path } });
  };

  const handleDeletePath = async (pathId: string) => {
    const { error } = await deleteLearningPath(pathId);
    
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete the learning path',
        variant: 'destructive',
      });
      throw error;
    } else {
      toast({
        title: 'Success',
        description: 'Learning path deleted successfully',
      });
      fetchPaths();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <MyPaths 
          paths={paths} 
          onSelectPath={handleSelectPath}
          onDeletePath={handleDeletePath}
          isLoading={isLoading} 
        />
      </main>
      
      <footer className="border-t py-6 bg-background">
        <div className="container text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} Learning Path Creator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MyPathsPage;
