
import { supabase } from '@/lib/supabase';
import { LearningPath } from '@/lib/gemini';

export async function saveLearningPath(path: LearningPath, userId: string) {
  try {
    const { data, error } = await supabase
      .from('learning_paths')
      .insert({
        user_id: userId,
        title: path.title,
        description: path.description,
        modules: path.modules,
        created_at: new Date().toISOString(),
      })
      .select();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error saving learning path:', error);
    return { data: null, error };
  }
}

export async function getUserLearningPaths(userId: string) {
  try {
    const { data, error } = await supabase
      .from('learning_paths')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error getting user learning paths:', error);
    return { data: null, error };
  }
}

export async function deleteLearningPath(pathId: string) {
  try {
    const { error } = await supabase
      .from('learning_paths')
      .delete()
      .eq('id', pathId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting learning path:', error);
    return { error };
  }
}
