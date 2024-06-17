from PyQt5.QtWidgets import QMainWindow, QVBoxLayout, QWidget, QAction, QMenuBar, QTextEdit
from ui.chat_interface import ChatInterface
from ui.config_dialog import ConfigDialog
from ui.permission_dialog import PermissionDialog
import logging

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Chat-GPT Sandbox")
        self.setGeometry(100, 100, 800, 600)

        self.central_widget = QWidget()
        self.setCentralWidget(self.central_widget)

        self.layout = QVBoxLayout(self.central_widget)

        self.chat_interface = ChatInterface(self)
        self.layout.addWidget(self.chat_interface)

        self.console = QTextEdit(self)
        self.console.setReadOnly(True)
        self.layout.addWidget(self.console)

        self.init_menu()
        self.init_logger()
        self.logger.info("Logging system initialized.")

    def init_menu(self):
        menubar = QMenuBar(self)
        self.setMenuBar(menubar)

        settings_menu = menubar.addMenu('Settings')

        config_action = QAction('OpenAI Configuration', self)
        config_action.triggered.connect(self.open_config_dialog)
        settings_menu.addAction(config_action)

        permission_action = QAction('Permissions', self)
        permission_action.triggered.connect(self.open_permission_dialog)
        settings_menu.addAction(permission_action)

    def open_config_dialog(self):
        dialog = ConfigDialog(self)
        dialog.exec_()

    def open_permission_dialog(self):
        dialog = PermissionDialog(self)
        dialog.exec_()

    def init_logger(self):
        self.logger = logging.getLogger('ChatGPTSandbox')
        self.logger.setLevel(logging.DEBUG)
        
        ch = logging.StreamHandler(self.console_handler())
        ch.setLevel(logging.DEBUG)
        
        fh = logging.FileHandler('sandbox.log')
        fh.setLevel(logging.DEBUG)
        
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        ch.setFormatter(formatter)
        fh.setFormatter(formatter)
        
        self.logger.addHandler(ch)
        self.logger.addHandler(fh)

    def console_handler(self):
        class QTextEditHandler(logging.Handler):
            def __init__(self, widget):
                super().__init__()
                self.widget = widget
            
            def emit(self, record):
                msg = self.format(record)
                self.widget.append(msg)

        return QTextEditHandler(self.console)
