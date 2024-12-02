export class SpeechRecognitionManager {
  private recognition: any;
  private onCommandCallback: (command: string) => Promise<void>;

  constructor(onCommand: (command: string) => Promise<void>) {
    this.onCommandCallback = onCommand;
    
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new window.webkitSpeechRecognition();
      this.setupRecognition();
    }
  }

  private setupRecognition() {
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    
    this.recognition.onresult = async (event: any) => {
      const command = event.results[event.results.length - 1][0].transcript;
      await this.onCommandCallback(command);
    };
  }

  start() {
    if (this.recognition) {
      this.recognition.start();
    }
  }

  stop() {
    if (this.recognition) {
      this.recognition.stop();
    }
  }
}