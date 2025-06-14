import { AssemblyAI } from "assemblyai"

// Initialize AssemblyAI client
const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY,
})

// Transcribe voice reviews or feedback
export async function transcribeVoiceReview(audioUrl: string) {
  try {
    const config = {
      audio_url: audioUrl,
      speaker_labels: true,
      sentiment_analysis: true,
      entity_detection: true,
      language_detection: true,
    }

    const transcript = await client.transcripts.transcribe(config)

    if (transcript.status === "error") {
      return {
        transcription: null,
        error: transcript.error || "Transcription failed",
      }
    }

    return {
      transcription: {
        text: transcript.text,
        sentiment: transcript.sentiment_analysis_results,
        entities: transcript.entities,
        speakers: transcript.utterances,
        confidence: transcript.confidence,
      },
      error: null,
    }
  } catch (error) {
    console.error("Error transcribing audio:", error)
    return {
      transcription: null,
      error: "Failed to transcribe audio",
    }
  }
}

// Transcribe phone orders or reservations
export async function transcribePhoneCall(audioUrl: string) {
  try {
    const config = {
      audio_url: audioUrl,
      speaker_labels: true,
      punctuate: true,
      format_text: true,
      dual_channel: true,
      entity_detection: true,
    }

    const transcript = await client.transcripts.transcribe(config)

    if (transcript.status === "error") {
      return {
        transcription: null,
        error: transcript.error || "Transcription failed",
      }
    }

    // Extract order details using entity detection
    const orderEntities = transcript.entities?.filter((entity) =>
      ["food", "drink", "quantity", "time", "person"].includes(entity.entity_type.toLowerCase()),
    )

    return {
      transcription: {
        text: transcript.text,
        speakers: transcript.utterances,
        entities: orderEntities,
        confidence: transcript.confidence,
      },
      error: null,
    }
  } catch (error) {
    console.error("Error transcribing phone call:", error)
    return {
      transcription: null,
      error: "Failed to transcribe phone call",
    }
  }
}

// Real-time transcription for live customer service
export async function startRealtimeTranscription() {
  try {
    const rt = client.realtime.createService({
      sampleRate: 16000,
      wordBoost: ["restaurant", "order", "reservation", "menu", "special"],
    })

    // Set up event handlers
    rt.on("open", () => {
      console.log("Real-time transcription started")
    })

    rt.on("transcript", (transcript) => {
      console.log("Transcript:", transcript.text)
      // Process transcript in real-time
    })

    rt.on("error", (error) => {
      console.error("Real-time transcription error:", error)
    })

    return {
      service: rt,
      error: null,
    }
  } catch (error) {
    console.error("Error starting real-time transcription:", error)
    return {
      service: null,
      error: "Failed to start real-time transcription",
    }
  }
}

export { client as assemblyAI }
