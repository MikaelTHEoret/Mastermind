from PyQt5.QtWidgets import QDialog, QVBoxLayout, QLabel, QLineEdit, QCheckBox, QPushButton

class PermissionDialog(QDialog):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setWindowTitle("Permissions Configuration")
        self.setGeometry(100, 100, 400, 300)

        layout = QVBoxLayout(self)

        self.path_label = QLabel("File Path:", self)
        layout.addWidget(self.path_label)
        self.path_input = QLineEdit(self)
        layout.addWidget(self.path_input)

        self.create_checkbox = QCheckBox("Allow Create", self)
        layout.addWidget(self.create_checkbox)

        self.delete_checkbox = QCheckBox("Allow Delete", self)
        layout.addWidget(self.delete_checkbox)

        self.edit_checkbox = QCheckBox("Allow Edit", self)
        layout.addWidget(self.edit_checkbox)

        self.save_button = QPushButton("Save", self)
        self.save_button.clicked.connect(self.save_permissions)
        layout.addWidget(self.save_button)

    def save_permissions(self):
        path = self.path_input.text()
        create = self.create_checkbox.isChecked()
        delete = self.delete_checkbox.isChecked()
        edit = self.edit_checkbox.isChecked()
        with open("permissions.txt", "a") as f:
            f.write(f"{path},{create},{delete},{edit}\n")
        self.accept()
