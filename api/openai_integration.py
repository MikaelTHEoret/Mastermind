import openai
import os
import logging

class OpenAIIntegration:
    def __init__(self):
        self.logger = logging.getLogger('ChatGPTSandbox.OpenAIIntegration')
        self.load_config()

    def load_config(self):
        if os.path.exists("config.txt"):
            with open("config.txt", "r") as f:
                config = dict(line.strip().split('=') for line in f)
                self.api_key = config.get("OPENAI_API_KEY")
                self.model = config.get("MODEL", "text-davinci-003")
                openai.api_key = self.api_key
                self.logger.info("Configuration loaded successfully.")
        else:
            self.api_key = None
            self.model = "text-davinci-003"
            self.logger.warning("Configuration file not found. Using default settings.")

    def generate_response(self, prompt):
        if not self.api_key:
            self.logger.error("API key is not set.")
            return "API key is not set."
        
        try:
            response = openai.Completion.create(
                engine=self.model,
                prompt=prompt,
                max_tokens=150
            )
            self.logger.info("Response generated successfully.")
            return response.choices[0].text.strip()
        except Exception as e:
            self.logger.error(f"Failed to generate response: {e}")
            return f"Error: {e}"
