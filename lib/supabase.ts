import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// Check if credentials are placeholders or incomplete
const isPlaceholder = (url: string, key: string) => {
  return (
    !url || 
    !key || 
    url.includes("your-project-id") || 
    key.includes("...") || 
    key.length < 20
  );
};

// Chainable mock client for database queries during evaluation/development
const createMockClient = () => {
  const queryChain = {
    select: function() { return this; },
    eq: function() { return this; },
    neq: function() { return this; },
    order: function() { return this; },
    limit: function() { return this; },
    single: async function() { return { data: null, error: null }; },
    then: function(onfulfilled: any) {
      return Promise.resolve({ data: [], error: null }).then(onfulfilled);
    }
  };

  return {
    from: () => queryChain,
    storage: {
      from: () => ({
        upload: async () => ({ data: null, error: new Error("Supabase is running in mock fallback mode.") }),
        getPublicUrl: () => ({ data: { publicUrl: "" } }),
      }),
    },
  };
};

let supabaseClient: any;
let supabaseAdminClient: any;

if (isPlaceholder(supabaseUrl, supabaseAnonKey)) {
  console.warn("Using Mock Supabase Client (credentials are placeholders or missing). configure .env.local to connect to a live db.");
  supabaseClient = createMockClient();
} else {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.error("Failed to initialize public Supabase client:", err);
    supabaseClient = createMockClient();
  }
}

if (isPlaceholder(supabaseUrl, supabaseServiceRoleKey)) {
  supabaseAdminClient = createMockClient();
} else {
  try {
    supabaseAdminClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  } catch (err) {
    console.error("Failed to initialize admin Supabase client:", err);
    supabaseAdminClient = createMockClient();
  }
}

// Public client for client-side queries (anonymous access)
export const supabase = supabaseClient;

// Administrative client for Server-only operations (bypassing RLS for admin dashboards/Server Actions)
export const supabaseAdmin = supabaseAdminClient;
