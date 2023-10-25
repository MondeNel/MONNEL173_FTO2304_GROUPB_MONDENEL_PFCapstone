
import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const supabase = createClient(
    'https://igynxubifbjsmyvigeem.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlneW54dWJpZmJqc215dmlnZWVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTgyMTk3NjAsImV4cCI6MjAxMzc5NTc2MH0.NAVh_AIJF1HrSisklewWSFvCpL-Xpl1kftBE4xVPDrA'

)

export default supabase