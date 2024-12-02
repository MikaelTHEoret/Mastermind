import { EventEmitter } from 'events';
import { DatabaseManager } from '../database/DatabaseManager';
import { VectorDatabaseManager } from '../database/VectorDatabaseManager';
import { LLMManager } from '../LLMManager';
import { IndexNode } from './types/IndexTypes';
import { IndexClassifier } from './IndexClassifier';
import { IndexRelationManager } from './IndexRelationManager';
import { IndexSearchEngine } from './IndexSearchEngine';

export class IndexSystem extends EventEmitter {
  private classifier: IndexClassifier;
  private relationManager: IndexRelationManager;
  private searchEngine: IndexSearchEngine;

  constructor(
    private db: DatabaseManager,
    private vectorDb: VectorDatabaseManager,
    private llm: LLMManager
  ) {
    super();
    this.classifier = new IndexClassifier(llm);
    this.relationManager = new IndexRelationManager(db);
    this.searchEngine = new IndexSearchEngine(vectorDb);
    this.initialize();
  }

  private async initialize(): Promise<void> {
    await this.ensureIndexTables();
    await this.loadBaseCategories();
  }

  private async ensureIndexTables(): Promise<void> {
    const queries = [
      `CREATE TABLE IF NOT EXISTS index_nodes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        metadata TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(type, name)
      )`,
      `CREATE TABLE IF NOT EXISTS index_relations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source_id INTEGER NOT NULL,
        target_id INTEGER NOT NULL,
        relation_type TEXT NOT NULL,
        weight REAL DEFAULT 1.0,
        metadata TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(source_id) REFERENCES index_nodes(id),
        FOREIGN KEY(target_id) REFERENCES index_nodes(id)
      )`,
      `CREATE TABLE IF NOT EXISTS index_vectors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        node_id INTEGER NOT NULL,
        vector TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(node_id) REFERENCES index_nodes(id)
      )`
    ];

    for (const query of queries) {
      await this.db.query(query);
    }
  }

  private async loadBaseCategories(): Promise<void> {
    const baseCategories = [
      { type: 'root', name: 'entities', description: 'Base category for all entities' },
      { type: 'root', name: 'actions', description: 'Base category for all actions' },
      { type: 'root', name: 'properties', description: 'Base category for all properties' },
      { type: 'root', name: 'relations', description: 'Base category for all relations' },
      { type: 'root', name: 'events', description: 'Base category for all events' }
    ];

    for (const category of baseCategories) {
      await this.addNode(category);
    }
  }

  async addNode(node: Omit<IndexNode, 'id'>): Promise<number> {
    try {
      const result = await this.db.query(
        `INSERT OR IGNORE INTO index_nodes (type, name, description, metadata)
         VALUES (?, ?, ?, ?)
         RETURNING id`,
        [node.type, node.name, node.description, JSON.stringify(node.metadata || {})]
      );

      const nodeId = result.rows[0]?.id;
      if (nodeId) {
        this.emit('node:added', { ...node, id: nodeId });
      }

      return nodeId;
    } catch (error) {
      this.emit('error', { operation: 'addNode', error });
      throw error;
    }
  }

  async classifyEntity(entity: any): Promise<string[]> {
    try {
      const classifications = await this.classifier.classify(entity);
      const nodeIds = await Promise.all(
        classifications.map(c => this.ensureClassification(c))
      );
      return nodeIds;
    } catch (error) {
      this.emit('error', { operation: 'classifyEntity', error });
      throw error;
    }
  }

  private async ensureClassification(classification: string): Promise<string> {
    const existing = await this.db.query(
      'SELECT id FROM index_nodes WHERE type = ? AND name = ?',
      ['classification', classification]
    );

    if (existing.rows.length > 0) {
      return existing.rows[0].id;
    }

    return this.addNode({
      type: 'classification',
      name: classification,
      description: `Auto-generated classification: ${classification}`
    });
  }

  async addRelation(sourceId: number, targetId: number, type: string, weight: number = 1.0): Promise<void> {
    try {
      await this.db.query(
        `INSERT INTO index_relations (source_id, target_id, relation_type, weight)
         VALUES (?, ?, ?, ?)`,
        [sourceId, targetId, type, weight]
      );

      this.emit('relation:added', { sourceId, targetId, type, weight });
    } catch (error) {
      this.emit('error', { operation: 'addRelation', error });
      throw error;
    }
  }

  async search(query: string, options: { limit?: number; threshold?: number } = {}): Promise<IndexNode[]> {
    return this.searchEngine.search(query, options);
  }

  async findRelated(nodeId: number, options: { types?: string[]; limit?: number } = {}): Promise<IndexNode[]> {
    return this.relationManager.findRelated(nodeId, options);
  }

  async generateVector(content: string): Promise<number[]> {
    return this.searchEngine.generateVector(content);
  }

  async analyzePatterns(): Promise<any> {
    return this.relationManager.analyzePatterns();
  }
}