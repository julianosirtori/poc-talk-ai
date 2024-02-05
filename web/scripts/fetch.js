export function transcribe(formData) {
  return fetch("http://localhost:3001/transcribe", {
    method: "POST",
    body: formData,
  });
}

