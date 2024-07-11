import os
import importlib

def load_modules(app):
    module_dir = os.path.dirname(__file__)
    for filename in os.listdir(module_dir):
        if filename.endswith('.py') and filename != '__init__.py':
            module_name = filename[:-3]
            try:
                module = importlib.import_module(f'modules.{module_name}')
                if hasattr(module, 'init_app'):
                    module.init_app(app)
            except ImportError as e:
                print(f"Error importing module {module_name}: {e}")
