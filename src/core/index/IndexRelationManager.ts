import { DatabaseManager } from '../database/DatabaseManager';
import { IndexNode, IndexRelation } from './types/IndexTypes';

export class IndexRelationManager {
  constructor(private db: DatabaseManager) {}

  async findRelated(nodeId: number, options: { types?: string[]; limit?: number } = {}): Promise<IndexNode[]> {
    const { types = [], limit = 10 } = options;
    
    let query = `
      SELECT n.*
      FROM index_nodes n
      JOIN index_relations r ON (r.target_id = n.id OR r.source_id = n.id)
      WHERE (r.source_id = ? OR r.target_id = ?)
        AND n.id != ?
    `;

    const params = [nodeId, nodeId, nodeId];

    if (types.length > 0) {
      query += ` AND n.type IN (${types.map(() => '?').join(',')})`;
      params.push(...types);
    }

    query += ` ORDER BY r.weight DESC LIMIT ?`;
    params.push(limit);

    const result = await this.db.query(query, params);
    return result.rows;
  }

  async analyzePatterns(): Promise<any> {
    const patterns = await this.db.query(`
      SELECT 
        r.relation_type,
        n1.type as source_type,
        n2.type as target_type,
        COUNT(*) as frequency,
        AVG(r.weight) as avg_weight
      FROM index_relations r
      JOIN index_nodes n1 ON r.source_id = n1.id
      JOIN index_nodes n2 ON r.target_id = n2.id
      GROUP BY r.relation_type, n1.type, n2.type
      HAVING frequency > 1
      ORDER BY frequency DESC, avg_weight DESC
    `);

    return patterns.rows;
  }

  async updateRelationWeight(relationId: number, newWeight: number): Promise<void> {
    await this.db.query(
      'UPDATE index_relations SET weight = ? WHERE id = ?',
      [newWeight, relationId]
    );
  }
}