-- Update the profiles table schema with improved migration and constraints
-- 1. First, migrate existing data from full_name to email field where email is null
UPDATE public.profiles 
SET full_name = (
  SELECT email FROM auth.users WHERE auth.users.id = profiles.id
)
WHERE full_name IS NULL OR full_name = '';

-- 2. Rename full_name to email
ALTER TABLE public.profiles RENAME COLUMN full_name TO email;

-- 3. Add NOT NULL and UNIQUE constraints to email
ALTER TABLE public.profiles ALTER COLUMN email SET NOT NULL;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_email_unique UNIQUE (email);

-- 4. Update the role field constraint to allow 'user', 'creator', 'buyer'
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('user', 'creator', 'buyer'));

-- 5. Update the default value for role to 'user'
ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'user';

-- 6. Remove the columns we don't need
ALTER TABLE public.profiles DROP COLUMN IF EXISTS is_verified;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS stripe_customer_id;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS razorpay_customer_id;

-- 7. Add the new is_public column
ALTER TABLE public.profiles ADD COLUMN is_public BOOLEAN DEFAULT false;

-- 8. Update the handle_new_user function with improved error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username, role, is_public)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, 'unknown@example.com'),
    COALESCE(
      NULLIF(LOWER(SPLIT_PART(COALESCE(NEW.email, 'user'), '@', 1)), ''),
      'user_' || SUBSTRING(NEW.id::text, 1, 8)
    ),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
    false
  );
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;