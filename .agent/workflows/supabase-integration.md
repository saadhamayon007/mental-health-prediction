---
description: how to connect Supabase to the Next.js frontend
---

# Supabase Integration Steps

Follow these steps to connect your Mental Health Prediction frontend to Supabase for Authentication and Data storage.

### 1. Setup Supabase Project
1. Go to [Supabase Dashboard](https://supabase.com/dashboard).
2. Create a new project named `mental-health-app`.
3. Save your **Database Password** carefully.

### 2. Configure Environment Variables
1. In your Supabase Dashboard, go to **Project Settings** > **API**.
2. Copy the `Project URL` and `anon public` key.
3. Open your `.env.local` file (create it if it doesn't exist) and add:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_public_key_here
```

### 3. Install Dependencies
Run the following command in your terminal:
```bash
npm install @supabase/supabase-js
```

### 4. Create Supabase Client
Create a new file at `lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### 5. Use Auth in your Login Page
In `app/login/page.tsx`, you can now import the client:
```typescript
import { supabase } from '@/lib/supabase'

// Example usage:
const handleLogin = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
}
```

> [!TIP]
> For advanced Next.js App Router support (SSR), consider using `@supabase/ssr` in the future.
