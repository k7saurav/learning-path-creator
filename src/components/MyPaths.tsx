
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Folder, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { deleteLearningPath } from '@/lib/learningPathService';
import { LearningPath as LearningPathType } from '@/lib/gemini';
import { toast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

interface ExtendedLearningPath extends LearningPathType {
  isSaved?: boolean;
}

type MyPathsProps = {
  paths: LearningPathType[] | null;
  onSelectPath: (path: ExtendedLearningPath) => void;
  onDeletePath: (pathId: string) => void;
  isLoading: boolean;
};

const MyPaths: React.FC<MyPathsProps> = ({ 
  paths, 
  onSelectPath,
  onDeletePath,
  isLoading 
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pathToDelete, setPathToDelete] = useState<{id: string, title: string} | null>(null);
  const navigate = useNavigate();

  const handleDeleteClick = (pathId: string, title: string) => {
    setPathToDelete({ id: pathId, title });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!pathToDelete) return;
    
    try {
      await onDeletePath(pathToDelete.id);
      setDeleteDialogOpen(false);
      setPathToDelete(null);
    } catch (error) {
      console.error('Error deleting path:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete the learning path.',
        variant: 'destructive',
      });
    }
  };

  const handleSelectPath = (path: LearningPathType) => {
    const pathWithSavedFlag = {
      ...path,
      isSaved: true
    } as ExtendedLearningPath;
    onSelectPath(pathWithSavedFlag);
  };

  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <p>Loading your learning paths...</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h2 className="text-2xl font-bold mb-6">My Learning Paths</h2>
      
      {paths && paths.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paths.map((path) => (
            <Card key={path.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="line-clamp-1">{path.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {path.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">
                  {path.modules.length} modules
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelectPath(path)}
                >
                  <Folder className="mr-2 h-4 w-4" />
                  Open
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteClick(path.id, path.title)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <Folder className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No learning paths yet</h3>
          <p className="text-muted-foreground mb-6">
            Create your first personalized learning path to get started.
          </p>
          <Button onClick={() => navigate('/')}>Create Learning Path</Button>
        </div>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Learning Path</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{pathToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyPaths;
