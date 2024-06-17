import importlib
import os

class ExpansionFramework:
    def __init__(self, expansions_dir='expansions'):
        self.expansions_dir = expansions_dir
        self.modules = self.load_expansions()

    def load_expansions(self):
        modules = {}
        for filename in os.listdir(self.expansions_dir):
            if filename.endswith('.py'):
                module_name = filename[:-3]
                module = importlib.import_module(f'{self.expansions_dir}.{module_name}')
                modules[module_name] = module
        return modules

    def get_module(self, module_name):
        return self.modules.get(module_name)
