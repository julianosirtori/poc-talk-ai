export async function transcribe(chunks) {
  try {
    const blob = new Blob(chunks, { type: "audio/mp3" });

    const formData = new FormData();
    formData.append("audio", blob, "recording.mp3");
    const response = await fetch("http://localhost:3001/transcribe", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    return data.transcription;
  } catch (err) {
    console.error(err);
    return "";
  }
}

