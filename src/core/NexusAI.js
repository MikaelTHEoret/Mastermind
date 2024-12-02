
class NexusAI {
  constructor() {
    this.moduleRegistry = {};
    this.assimilatedFeatures = {};
    console.log("NexusAI: The Great Wizard is online!");
  }

  // Dynamically load a module
  async loadModule(moduleName, modulePath) {
    try {
      const module = await import(modulePath);
      this.moduleRegistry[moduleName] = module;
      console.log(`Module '${moduleName}' loaded successfully.`);

      // Automatically assimilate features
      this.assimilateFeatures(module, moduleName);
    } catch (error) {
      console.error(`Failed to load module '${moduleName}':`, error);
    }
  }

  // Assimilate features from a module
  assimilateFeatures(module, moduleName) {
    Object.keys(module).forEach((featureName) => {
      if (this.assimilatedFeatures[featureName]) {
        console.warn(
          `Feature conflict: '${featureName}' already exists. Keeping the existing feature.`
        );
      } else {
        this.assimilatedFeatures[featureName] = module[featureName];
        console.log(`Feature '${featureName}' from '${moduleName}' assimilated.`);
      }
    });
  }

  // Call an assimilated feature
  callFeature(featureName, ...args) {
    const feature = this.assimilatedFeatures[featureName];
    if (feature) {
      return feature(...args);
    } else {
      console.error(`Feature '${featureName}' not found.`);
    }
  }

  // List all assimilated features
  listFeatures() {
    return Object.keys(this.assimilatedFeatures);
  }

  // List all loaded modules
  listModules() {
    return Object.keys(this.moduleRegistry);
  }
}

// Singleton instance
const NexusAIInstance = new NexusAI();
export default NexusAIInstance;
