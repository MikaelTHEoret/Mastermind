export class SpeechSynthesisManager {
  private synthesis: SpeechSynthesis;

  constructor() {
    this.synthesis = window.speechSynthesis;
  }

  speak(text: string) {
    if (this.synthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      this.synthesis.speak(utterance);
    }
  }
}