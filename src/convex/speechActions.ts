import { v } from "convex/values";
import { action } from "./_generated/server";

function extensionFor(mimeType: string): string {
  if (mimeType.includes("webm")) return "webm";
  if (mimeType.includes("ogg")) return "ogg";
  if (mimeType.includes("wav")) return "wav";
  if (mimeType.includes("mp4") || mimeType.includes("m4a")) return "m4a";
  return "webm";
}

export const transcribe = action({
  args: { audio: v.bytes(), mimeType: v.string() },
  handler: async (_ctx, args): Promise<{ transcript: string }> => {
    const apiKey = process.env.SARVAM_API_KEY;
    if (!apiKey) throw new Error("SARVAM_API_KEY is not configured");

    const blob = new Blob([args.audio], { type: args.mimeType });
    const form = new FormData();
    form.append("file", blob, `recording.${extensionFor(args.mimeType)}`);
    form.append("model", "saarika:v2.5");
    form.append("language_code", "unknown");

    const res = await fetch("https://api.sarvam.ai/speech-to-text", {
      method: "POST",
      headers: { "api-subscription-key": apiKey },
      body: form,
    });

    if (!res.ok) {
      throw new Error(`Sarvam speech-to-text error: ${res.status} ${await res.text()}`);
    }

    const data = await res.json();
    const transcript = data?.transcript;
    return { transcript: typeof transcript === "string" ? transcript : "" };
  },
});
