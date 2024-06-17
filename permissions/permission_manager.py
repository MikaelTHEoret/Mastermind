import os

class PermissionManager:
    def __init__(self):
        self.permissions = {}
        self.load_permissions()

    def load_permissions(self):
        if os.path.exists("permissions.txt"):
            with open("permissions.txt", "r") as f:
                for line in f:
                    path, create, delete, edit = line.strip().split(',')
                    self.permissions[path] = {
                        'create': create == 'True',
                        'delete': delete == 'True',
                        'edit': edit == 'True'
                    }

    def set_permission(self, path, create, delete, edit):
        self.permissions[path] = {
            'create': create,
            'delete': delete,
            'edit': edit
        }
        with open("permissions.txt", "a") as f:
            f.write(f"{path},{create},{delete},{edit}\n")

    def check_permission(self, path, action):
        if path in self.permissions and self.permissions[path].get(action, False):
            return True
        return False

    def create_file(self, path, content):
        if self.check_permission(path, 'create'):
            with open(path, 'w') as file:
                file.write(content)
            return "File created successfully."
        return "Permission denied."

    def delete_file(self, path):
        if self.check_permission(path, 'delete') and os.path.exists(path):
            os.remove(path)
            return "File deleted successfully."
        return "Permission denied."

    def edit_file(self, path, content):
        if self.check_permission(path, 'edit') and os.path.exists(path):
            with open(path, 'w') as file:
                file.write(content)
            return "File edited successfully."
        return "Permission denied."
