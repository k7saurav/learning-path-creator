import { supabase } from '@/lib/supabase';
import { LearningPath } from '@/lib/gemini';
import { toast } from '@/components/ui/use-toast';

// Check if learning_paths table exists and create it if it doesn't
export async function ensureLearningPathsTable() {
  try {
    // Check if the table exists by trying to query it
    let { data, error: checkError } = await supabase
      .from('learning_paths')
      .select('id')
      .limit(1);
    
    // If data is not null, the table exists
    if (data !== null) {
      console.log('learning_paths table exists');
      return { error: null };
    }
    
    // If we get an error about the table not existing, we'll create it
    if (checkError && checkError.code === '42P01') {
      console.log('learning_paths table does not exist, creating it...');
      
      // Create the table using SQL
      const { error: createError } = await supabase.rpc('create_learning_paths_table');
      
      if (createError) {
        console.error('Error creating learning_paths table:', createError);
        // Try to create the function that creates the table
        const { error: funcError } = await supabase.rpc('create_rpc_function_for_table');
        
        if (funcError) {
          console.error('Error creating RPC function:', funcError);
          return { error: funcError };
        }
        
        // Try creating the table again
        const { error: retryError } = await supabase.rpc('create_learning_paths_table');
        if (retryError) {
          console.error('Error creating learning_paths table on retry:', retryError);
          return { error: retryError };
        }
      }
      
      console.log('learning_paths table created successfully');
    }
    
    return { error: null };
  } catch (error) {
    console.error('Error checking/creating learning_paths table:', error);
    return { error };
  }
}

export async function saveLearningPath(path: LearningPath, userId: string) {
  try {
    // Ensure the table exists before trying to insert
    const { error: tableError } = await ensureLearningPathsTable();
    if (tableError) throw tableError;
    
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
    // Ensure the table exists before trying to select
    const { error: tableError } = await ensureLearningPathsTable();
    if (tableError) throw tableError;
    
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

// Modify the setupSupabaseRPC function to handle the case where the table already exists
export async function setupSupabaseRPC() {
  try {
    // First, check if the table already exists
    let { data } = await supabase
      .from('learning_paths')
      .select('id')
      .limit(1);
    
    // If we can query the table, it exists and we don't need to do anything
    if (data !== null) {
      console.log('learning_paths table already exists, no setup needed');
      return { error: null };
    }
    
    // Create RPC function for table creation
    const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION create_rpc_function_for_table()
      RETURNS void
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        -- Create the function that will create our table
        CREATE OR REPLACE FUNCTION create_learning_paths_table()
        RETURNS void
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $func$
        BEGIN
          CREATE TABLE IF NOT EXISTS public.learning_paths (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            modules JSONB NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            CONSTRAINT fk_user
              FOREIGN KEY(user_id)
              REFERENCES auth.users(id)
              ON DELETE CASCADE
          );
          
          -- Set up RLS policies
          ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;
          
          -- Create policies
          CREATE POLICY "Users can view their own learning paths"
            ON public.learning_paths
            FOR SELECT
            USING (auth.uid() = user_id);
            
          CREATE POLICY "Users can insert their own learning paths"
            ON public.learning_paths
            FOR INSERT
            WITH CHECK (auth.uid() = user_id);
            
          CREATE POLICY "Users can update their own learning paths"
            ON public.learning_paths
            FOR UPDATE
            USING (auth.uid() = user_id);
            
          CREATE POLICY "Users can delete their own learning paths"
            ON public.learning_paths
            FOR DELETE
            USING (auth.uid() = user_id);
        END;
        $func$;
      END;
      $$;
    `;

    // Execute SQL to create the function
    const { error } = await supabase.rpc('exec_sql', { sql: createFunctionSQL });
    
    if (error) {
      // If we can't create the function using RPC, we'll inform the user
      console.error('Error creating RPC setup function:', error);
      return { error };
    }
    
    // Now call our newly created function
    const { error: rpcError } = await supabase.rpc('create_rpc_function_for_table');
    
    if (rpcError) {
      console.error('Error executing RPC setup function:', rpcError);
      return { error: rpcError };
    }
    
    // Finally, create the table
    const { error: tableError } = await supabase.rpc('create_learning_paths_table');
    
    if (tableError) {
      console.error('Error creating learning_paths table:', tableError);
      return { error: tableError };
    }
    
    return { error: null };
  } catch (error) {
    console.error('Error setting up Supabase RPC:', error);
    return { error };
  }
}
