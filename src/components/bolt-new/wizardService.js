
export async function sendCommandToWizard(command) {
  // Simulate the Wizard's response (In a real setup, this would connect to an AI backend)
  const responses = {
    hello: "Greetings, traveler! How may I assist you?",
    assimilator: "Ah, the Assimilator! A powerful tool for your application.",
    magic: "Magic is simply advanced logic... Let me demonstrate!",
  };

  // Simulate a delay and return the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(responses[command.toLowerCase()] || "I didn't understand that command. Try again!");
    }, 1000);
  });
}
