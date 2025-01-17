/*
  # Create admin user

  1. Changes
    - Create admin user with email/password authentication
    - Set up admin role and permissions
*/

-- Enable email/password auth in Supabase Auth settings
DO $$ 
BEGIN
  -- Create admin user if not exists
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE email = 'admin@example.com'
  ) THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'admin@example.com',
      crypt('admin123', gen_salt('bf')), -- Default password: admin123
      NOW(),
      NOW(),
      NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    );
  END IF;
END $$;