const speech = require("@google-cloud/speech");

async function getTranscription(file) {
  const client = new speech.SpeechClient();

  const config = {
    model: "default",
    encoding: "WEBM_OPUS",
    sampleRateHertz: 48000,
    audioChannelCount: 1,
    enableWordTimeOffsets: true,
    languageCode: "en-US",
  };

  const audio = {
    content: file.buffer.toString("base64"),
  };

  const request = {
    config: config,
    audio: audio,
  };

  const [operation] = await client.longRunningRecognize(request);
  const [response] = await operation.promise();

  return response.results
    .map((result) => result.alternatives[0].transcript)
    .join("\n");
}

module.exports = { getTranscription };

