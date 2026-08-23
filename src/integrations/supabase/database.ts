import type { Database as GeneratedDatabase } from './types';

/**
 * Compatibility layer around the generated Supabase types.
 *
 * The generated snapshot currently contains only part of the production schema.
 * Keeping this widening here (instead of editing `types.ts`) lets existing tables
 * continue to compile while preserving strong generated types for tables that are
 * already present in the snapshot.
 *
 * Remove this compatibility layer after regenerating `types.ts` from the complete
 * production Supabase schema and confirming all application tables/RPCs are covered.
 */
type LegacyTable = {
  Row: Record<string, any>;
  Insert: Record<string, any>;
  Update: Record<string, any>;
  Relationships: [];
};

type LegacyFunction = {
  Args: Record<string, any>;
  Returns: any;
};

type PublicSchema = GeneratedDatabase['public'];

export type Database = Omit<GeneratedDatabase, 'public'> & {
  public: Omit<PublicSchema, 'Tables' | 'Functions'> & {
    Tables: PublicSchema['Tables'] & Record<string, LegacyTable>;
    Functions: PublicSchema['Functions'] & Record<string, LegacyFunction>;
  };
};
