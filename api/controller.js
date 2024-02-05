const { getTranscription } = require("./services/transcriber");

async function transcribe(req, res) {
  const audioFile = req.file;

  let transcription = await getTranscription(audioFile);

  res.json({
    transcription,
  });
}

module.exports = { transcribe };

