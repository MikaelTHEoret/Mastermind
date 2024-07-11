import os
import importlib

def load_modules(app):
    modules_dir = os.path.dirname(__file__)
    for filename in os.listdir(modules_dir):
        if filename.endswith('.py') and filename != '__init__.py':
            module_name = f'modules.{filename[:-3]}'
            module = importlib.import_module(module_name)
            if hasattr(module, 'init_app'):
                module.init_app(app)
