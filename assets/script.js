const responses = [
  "Check your oil and stop revving like a lunatic!",
  "That rattle? Probably your ego.",
  "You want horsepower? Try walking faster.",
  "Another day, another dodgy carburettor."
];

document.getElementById("askDel").addEventListener("click", () => {
  const responseBox = document.getElementById("response");
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  responseBox.textContent = `Del says: ${randomResponse}`;

  // Speak the response
  const utterance = new SpeechSynthesisUtterance(randomResponse);
  utterance.voice = speechSynthesis.getVoices().find(v => v.name.includes("UK") || v.lang === "en-GB");
  utterance.rate = 1;
  speechSynthesis.speak(utterance);

  // Trigger gesture animation
  const avatar = document.getElementById("delAvatar");
  avatar.animationName = "Wave"; // Replace with actual animation name from del.glb
  setTimeout(() => {
    avatar.animationName = "Idle";
  }, 3000);
});