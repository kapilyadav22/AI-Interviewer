import { createClient } from "@supabase/supabase-js";
import { config } from "../../config";

const supabaseUrl = config.supabaseUrl;
const supabaseAnonKey = config.supabaseAnonKey;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Missing Supabase URL or Anon Key. Authentication will not work."
  );
}

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export const uploadRecording = async (userId, blob) => {
  if (!supabase) throw new Error("Supabase is not configured.");
  const fileName = `${userId}/${Date.now()}.webm`;
  const { data, error } = await supabase.storage
    .from("recordings")
    .upload(fileName, blob);

  if (error) throw error;
  return data.path;
};

export const getRecordingUrl = (path) => {
  if (!supabase) return "";
  const { data } = supabase.storage.from("recordings").getPublicUrl(path);
  return data.publicUrl;
};

export const saveInterview = async (interviewData) => {
  if (!supabase) throw new Error("Supabase is not configured.");
  // interviewData should now include { ratings, topics }
  const { data, error } = await supabase
    .from("interviews")
    .insert(interviewData)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Delete a single interview by its ID and optionally its recording
export const deleteInterview = async (interviewId, recordingPath) => {
  if (!supabase) throw new Error("Supabase is not configured.");
  // Delete the interview record
  const { error: delError } = await supabase
    .from("interviews")
    .delete()
    .eq("id", interviewId);
  if (delError) throw delError;
  // Delete associated recording if path provided
  if (recordingPath) {
    const { error: recError } = await supabase.storage
      .from("recordings")
      .remove([recordingPath]);
    if (recError) console.warn("Failed to delete recording:", recError);
  }
  return true;
};

export const getInterviews = async (userId) => {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("interviews")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};
