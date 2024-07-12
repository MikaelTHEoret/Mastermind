
import importlib.util
import os
import sys

class ModuleManager:
    def __init__(self):
        self.modules = []

    def load_module(self, module_name):
        module_path = os.path.join('modules', module_name)
        if os.path.isdir(module_path):
            spec = importlib.util.spec_from_file_location(module_name, os.path.join(module_path, '__init__.py'))
            module = importlib.util.module_from_spec(spec)
            sys.modules[module_name] = module
            spec.loader.exec_module(module)
            self.modules.append(module)
            return module
        else:
            raise FileNotFoundError(f"Module {module_name} not found")

    def initialize_modules(self):
        for module in self.modules:
            if hasattr(module, 'initialize'):
                module.initialize()

# Initialize the module manager and load modules
module_manager = ModuleManager()
module_manager.load_module('gpt_pilot')
module_manager.initialize_modules()
    