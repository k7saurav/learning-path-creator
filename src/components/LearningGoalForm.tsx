
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

type LearningGoalFormProps = {
  onSubmit: (data: LearningGoalData) => void;
  isLoading?: boolean;
};

export type LearningGoalData = {
  goal: string;
  skillLevel: string;
  timeAvailability: string;
};

const LearningGoalForm: React.FC<LearningGoalFormProps> = ({ onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState<LearningGoalData>({
    goal: '',
    skillLevel: 'beginner',
    timeAvailability: 'medium',
  });

  const handleChange = (field: keyof LearningGoalData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Create Your Learning Path</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="goal">What do you want to learn?</Label>
            <Input
              id="goal"
              placeholder="e.g. Web Development, Machine Learning, Digital Marketing..."
              value={formData.goal}
              onChange={(e) => handleChange('goal', e.target.value)}
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="skillLevel">Your current skill level</Label>
            <Select
              value={formData.skillLevel}
              onValueChange={(value) => handleChange('skillLevel', value)}
            >
              <SelectTrigger className="w-full" id="skillLevel">
                <SelectValue placeholder="Select your skill level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner (No experience)</SelectItem>
                <SelectItem value="intermediate">Intermediate (Some knowledge)</SelectItem>
                <SelectItem value="advanced">Advanced (Solid foundation)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeAvailability">How much time can you dedicate?</Label>
            <Select
              value={formData.timeAvailability}
              onValueChange={(value) => handleChange('timeAvailability', value)}
            >
              <SelectTrigger className="w-full" id="timeAvailability">
                <SelectValue placeholder="Select time availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low (1-3 hours/week)</SelectItem>
                <SelectItem value="medium">Medium (4-7 hours/week)</SelectItem>
                <SelectItem value="high">High (8+ hours/week)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Learning Path'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LearningGoalForm;
