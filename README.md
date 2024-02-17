# POC Talk AI

Poc desenvolvida para entender como funciona alguns conceitos:

## Gravação de média 

  * [MediaRecorder](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder)
  * [MediaDevices: getUserMedia() method](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)


  ```js

function setup() {
  if (!deviceIsSupported()) {
    elements.micButton.disabled = true;
    return;
  }

  navigator.mediaDevices.getUserMedia({ audio: true }).then(
    (stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      let chunks = [];

      mediaRecorder.ondataavailable = async (e) => {
        chunks.push(e.data);
        const transcription = await transcribe(chunks);
        chunks = [];
        elements.messageTextArea.value = transcription;
      };

      elements.micButton.onclick = async () => {
        const micButton = elements.micButton;
        const pressed = micButton.getAttribute("aria-pressed") === "true";
        micButton.setAttribute("aria-pressed", !pressed);

        if (!pressed) {
          mediaRecorder.start();
          return;
        }
        mediaRecorder.stop();
      };
    },
    (err) => {
      console.error("The following error occured: " + err);
    }
  );
}
```

## Utilização da api @google-cloud/speech

```javascript
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
```


## To Do

* [ ] Falta integrar o GPT-4
* [ ] Implementar @google-cloud/text-to-speech
