-- Create a table for storing interview sessions
create table interviews (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  feedback text,
  transcript jsonb,
  recording_path text,
  duration integer
);

-- Set up Row Level Security (RLS)
alter table interviews enable row level security;

create policy "Users can view their own interviews"
  on interviews for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own interviews"
  on interviews for insert
  with check ( auth.uid() = user_id );

-- Create a storage bucket for recordings
insert into storage.buckets (id, name, public)
values ('recordings', 'recordings', true);

-- Set up storage policies
create policy "Authenticated users can upload recordings"
  on storage.objects for insert
  with check ( bucket_id = 'recordings' and auth.role() = 'authenticated' );

create policy "Public access to recordings"
  on storage.objects for select
  using ( bucket_id = 'recordings' );
