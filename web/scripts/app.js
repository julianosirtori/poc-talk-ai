import { visualize } from "./visualize.js";
import { transcribe } from "./fetch.js";

const record = document.querySelector("#record-button");
const stop = document.querySelector("#stop-button");
const audios = document.querySelector(".audios");

stop.disabled = true;

function deviceIsSupported() {
  return navigator.mediaDevices.getUserMedia;
}

if (deviceIsSupported) {
  function onSuccessUserMedia(stream) {
    visualize(stream);

    let chunks = [];
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = function (e) {
      chunks.push(e.data);
    };

    record.onclick = function () {
      mediaRecorder.start();
      console.log(mediaRecorder.state);
      console.log("Recorder started.");
      record.style.background = "red";

      stop.disabled = false;
      record.disabled = true;
    };

    stop.onclick = function () {
      console.log(chunks);
      mediaRecorder.stop();
      console.log(mediaRecorder.state);
      console.log("Recorder stopped.");
      record.style.background = "";
      record.style.color = "";

      stop.disabled = true;
      record.disabled = false;

      const audio = document.createElement("audio");
      audio.controls = true;

      const blob = new Blob(chunks, { type: "audio/mp3" });
      chunks = [];

      const audioURL = window.URL.createObjectURL(blob);
      audio.src = audioURL;
      console.log(audioURL);
      audios.appendChild(audio);

      const formData = new FormData();
      //add the Blob to formData
      formData.append("audio", blob, "recording.mp3");

      transcribe(formData);
    };
  }

  function onErrorUserMedia(err) {
    console.error("The following error occured: " + err);
  }

  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then(onSuccessUserMedia, onErrorUserMedia);
}

