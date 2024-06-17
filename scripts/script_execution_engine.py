class ScriptExecutionEngine:
    def __init__(self, permission_manager):
        self.permission_manager = permission_manager

    def execute_script(self, script):
        try:
            exec(script)
            return "Script executed successfully."
        except Exception as e:
            return f"Script execution failed: {e}"
