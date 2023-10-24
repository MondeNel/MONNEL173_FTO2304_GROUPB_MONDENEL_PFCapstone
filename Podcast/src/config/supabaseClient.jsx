
import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const supabase = createClient(
    'https://oeumvrbjfgyydfcpagjs.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ldW12cmJqZmd5eWRmY3BhZ2pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTgxNjk3NTksImV4cCI6MjAxMzc0NTc1OX0.Y4ROaEq-TDJIf6YSSeWXNTxO9ytHYa1vOgYMjMVhCpg'
)


export default supabase