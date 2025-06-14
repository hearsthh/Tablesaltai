import { AssemblyAI } from "assemblyai"

// Initialize AssemblyAI client
const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY,
})

// Transcribe voice reviews or feedback
export async function transcribeVoiceReview(audioUrl: string) {
  return {
    transcription: null,
    error: "AssemblyAI disabled for deployment",
  }
}

// Transcribe phone orders or reservations
export async function transcribePhoneCall(audioUrl: string) {
  return {
    transcription: null,
    error: "AssemblyAI disabled for deployment",
  }
}

// Real-time transcription for live customer service
export async function startRealtimeTranscription() {
  return {
    service: null,
    error: "AssemblyAI disabled for deployment",
  }
}

export { client as assemblyAI }
