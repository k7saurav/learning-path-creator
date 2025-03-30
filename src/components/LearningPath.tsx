
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, CircleEllipsis, Circle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export type LearningModule = {
  id: string;
  title: string;
  description: string;
  status: 'not-started' | 'in-progress' | 'completed';
  estimatedHours: number;
  resources: Array<{
    type: 'video' | 'article' | 'course';
    title: string;
    url: string;
  }>;
};

type LearningPathProps = {
  title: string;
  description: string;
  modules: LearningModule[];
  onModuleStatusChange: (moduleId: string, status: LearningModule['status']) => void;
  isSaved?: boolean; // New prop to determine if the path is saved
  pathId?: string; // Path ID for local storage key
};

const StatusIcon = ({ status }: { status: LearningModule['status'] }) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-6 w-6 text-green-600" />;
    case 'in-progress':
      return <CircleEllipsis className="h-6 w-6 text-blue-600" />;
    case 'not-started':
    default:
      return <Circle className="h-6 w-6 text-gray-400" />;
  }
};

const getStatusClass = (status: LearningModule['status']) => {
  switch (status) {
    case 'completed':
      return 'status-completed';
    case 'in-progress':
      return 'status-in-progress';
    case 'not-started':
    default:
      return 'status-not-started';
  }
};

const LearningPath: React.FC<LearningPathProps> = ({
  title,
  description,
  modules,
  onModuleStatusChange,
  isSaved = false,
  pathId = '',
}) => {
  // Load module statuses from local storage on component mount
  useEffect(() => {
    if (isSaved && pathId) {
      const storageKey = `learning-path-${pathId}`;
      const savedStatuses = localStorage.getItem(storageKey);
      
      if (savedStatuses) {
        try {
          const statusData = JSON.parse(savedStatuses);
          // Update each module's status from local storage
          for (const [moduleId, status] of Object.entries(statusData)) {
            onModuleStatusChange(moduleId, status as LearningModule['status']);
          }
        } catch (error) {
          console.error('Error loading module statuses from local storage:', error);
        }
      }
    }
  }, [isSaved, pathId, onModuleStatusChange]);

  // Save module statuses to local storage when they change
  useEffect(() => {
    if (isSaved && pathId) {
      const storageKey = `learning-path-${pathId}`;
      const statusData: Record<string, LearningModule['status']> = {};
      
      modules.forEach(module => {
        statusData[module.id] = module.status;
      });
      
      localStorage.setItem(storageKey, JSON.stringify(statusData));
    }
  }, [modules, isSaved, pathId]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center max-w-3xl mx-auto mb-8">
        <h2 className="text-3xl font-bold">{title}</h2>
        <p className="text-muted-foreground mt-2">{description}</p>
      </div>

      <div className="space-y-6">
        {modules.map((module) => (
          <Card key={module.id} className={`learn-card ${getStatusClass(module.status)}`}>
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <StatusIcon status={module.status} />
                  {module.title}
                </CardTitle>
                <CardDescription className="mt-1">
                  Estimated time: {module.estimatedHours} hours
                </CardDescription>
              </div>
              {/* Only show status buttons for saved paths */}
              {isSaved && (
                <div className="space-x-2">
                  <Button
                    variant={module.status === 'not-started' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onModuleStatusChange(module.id, 'not-started')}
                  >
                    Not Started
                  </Button>
                  <Button
                    variant={module.status === 'in-progress' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onModuleStatusChange(module.id, 'in-progress')}
                  >
                    In Progress
                  </Button>
                  <Button
                    variant={module.status === 'completed' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onModuleStatusChange(module.id, 'completed')}
                  >
                    Completed
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <p className="mb-4">{module.description}</p>
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Recommended Resources:</h4>
                <ul className="space-y-2">
                  {module.resources.map((resource, index) => (
                    <li key={index} className="flex gap-2">
                      <Badge variant="outline" className="capitalize">
                        {resource.type}
                      </Badge>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:underline"
                      >
                        {resource.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LearningPath;
