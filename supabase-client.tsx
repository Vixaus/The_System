import { createClient } from "@supabase/supabase-js"

export const supabase = createClient(
    "https://naztftozrjsleetukuas.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5henRmdG96cmpzbGVldHVrdWFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzMzEyMDAsImV4cCI6MjA2MDkwNzIwMH0.wCIxxJLMddzVFdG7sD16-35F6j7eOkiH7qRfYfbCpps"
)