
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import MyPaths from '@/components/MyPaths';
import { useAuth } from '@/contexts/AuthContext';
import { getUserLearningPaths, deleteLearningPath, setupSupabaseRPC } from '@/lib/learningPathService';
import { LearningPath as LearningPathType } from '@/lib/gemini';
import { toast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ExclamationTriangleIcon } from 'lucide-react';

const MyPathsPage: React.FC = () => {
  const [paths, setPaths] = useState<LearningPathType[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [databaseError, setDatabaseError] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPaths();
  }, [user]);

  const fetchPaths = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setDatabaseError(false);
    
    try {
      // Try to set up the database if needed
      await setupSupabaseRPC();
      
      const { data, error } = await getUserLearningPaths(user.id);
      
      if (error) {
        console.error(error);
        if (error.code === '42P01') {
          setDatabaseError(true);
        }
        toast({
          title: 'Error',
          description: 'Failed to load your learning paths',
          variant: 'destructive',
        });
      } else {
        setPaths(data);
      }
    } catch (error) {
      console.error("Error in fetchPaths:", error);
      toast({
        title: 'Error',
        description: 'Failed to load your learning paths',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPath = (path: LearningPathType) => {
    navigate('/', { state: { selectedPath: path } });
  };

  const handleDeletePath = async (pathId: string) => {
    try {
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
    } catch (error) {
      console.error("Error in handleDeletePath:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {databaseError && (
          <Alert variant="destructive" className="max-w-3xl mx-auto my-4">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertTitle>Database Setup Required</AlertTitle>
            <AlertDescription>
              The learning_paths table doesn't exist in your Supabase database. Please go to your Supabase 
              dashboard and create this table or contact your administrator.
            </AlertDescription>
          </Alert>
        )}
        
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
