from PyQt5.QtWidgets import QWidget, QVBoxLayout, QTextEdit, QPushButton, QLabel
from api.openai_integration import OpenAIIntegration

class ChatInterface(QWidget):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.layout = QVBoxLayout(self)

        self.chat_log = QTextEdit(self)
        self.chat_log.setReadOnly(True)
        self.layout.addWidget(self.chat_log)

        self.user_input = QTextEdit(self)
        self.layout.addWidget(self.user_input)

        self.send_button = QPushButton("Send", self)
        self.send_button.clicked.connect(self.send_message)
        self.layout.addWidget(self.send_button)

        self.status_label = QLabel(self)
        self.layout.addWidget(self.status_label)

        self.openai_integration = OpenAIIntegration()

    def send_message(self):
        user_message = self.user_input.toPlainText()
        self.chat_log.append(f"User: {user_message}")
        self.user_input.clear()
        self.status_label.setText("Sending message to Chat-GPT...")
        response = self.openai_integration.generate_response(user_message)
        self.chat_log.append(f"Chat-GPT: {response}")
        self.status_label.setText("Response received.")
