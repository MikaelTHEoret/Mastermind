
import { MongoClient } from 'mongodb';
import { EventEmitter } from 'events';

interface IndexedOperation {
  id: string;
  timestamp: Date;
  type: string;
  source: string;
  target: string;
  context: Record<string, unknown>;
  parentId?: string;
  metadata: Record<string, unknown>;
}

export class BackendIndexer extends EventEmitter {
  private client: MongoClient;
  private db: any;

  constructor(private uri: string, private dbName: string) {
    super();
    this.client = new MongoClient(uri);
  }

  async connect() {
    try {
      await this.client.connect();
      this.db = this.client.db(this.dbName);
      console.log('Connected to MongoDB successfully!');
    } catch (err) {
      console.error('Error connecting to MongoDB:', err);
    }
  }

  async getRecentOperations(type: string, id: string) {
    try {
      const result = await this.db.collection('operation_index').find({
        type,
        id: { $ne: id },
        timestamp: { $gt: new Date(Date.now() - 60 * 60 * 1000) },
      })
      .sort({ timestamp: -1 })
      .limit(10)
      .toArray();
      return result;
    } catch (err) {
      console.error('Error retrieving operations:', err);
      return [];
    }
  }

  async insertOrUpdateOperationRelation(
    sourceId: string,
    targetId: string,
    relationType: string,
    weight: number
  ) {
    try {
      const result = await this.db.collection('operation_relations').updateOne(
        { sourceId, targetId },
        { $set: { relationType, weight } },
        { upsert: true }
      );
      return result;
    } catch (err) {
      console.error('Error inserting/updating operation relation:', err);
    }
  }

  async getRelationsBySourceId(sourceId: string) {
    try {
      const relations = await this.db.collection('operation_relations').aggregate([
        {
          $match: { sourceId },
        },
        {
          $lookup: {
            from: 'operation_index',
            localField: 'targetId',
            foreignField: 'id',
            as: 'targetDetails',
          },
        },
      ]).toArray();
      return relations;
    } catch (err) {
      console.error('Error retrieving relations:', err);
      return [];
    }
  }
  
  async closeConnection() {
    try {
      await this.client.close();
      console.log('Connection to MongoDB closed successfully!');
    } catch (err) {
      console.error('Error closing MongoDB connection:', err);
    }
  }
}
