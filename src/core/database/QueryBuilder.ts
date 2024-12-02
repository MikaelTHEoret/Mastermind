type WhereCondition = {
  column: string;
  operator: string;
  value: any;
};

type OrderBy = {
  column: string;
  direction: 'ASC' | 'DESC';
};

export class QueryBuilder {
  private table: string = '';
  private columns: string[] = ['*'];
  private whereConditions: WhereCondition[] = [];
  private orderByColumns: OrderBy[] = [];
  private limitValue?: number;
  private offsetValue?: number;
  private params: any[] = [];

  constructor(table: string) {
    this.table = table;
  }

  select(columns: string[]): this {
    this.columns = columns;
    return this;
  }

  where(column: string, operator: string, value: any): this {
    this.whereConditions.push({ column, operator, value });
    this.params.push(value);
    return this;
  }

  orderBy(column: string, direction: 'ASC' | 'DESC' = 'ASC'): this {
    this.orderByColumns.push({ column, direction });
    return this;
  }

  limit(limit: number): this {
    this.limitValue = limit;
    return this;
  }

  offset(offset: number): this {
    this.offsetValue = offset;
    return this;
  }

  build(): { sql: string; params: any[] } {
    let sql = `SELECT ${this.columns.join(', ')} FROM ${this.table}`;

    if (this.whereConditions.length > 0) {
      sql += ' WHERE ' + this.whereConditions
        .map(({ column, operator }) => `${column} ${operator} ?`)
        .join(' AND ');
    }

    if (this.orderByColumns.length > 0) {
      sql += ' ORDER BY ' + this.orderByColumns
        .map(({ column, direction }) => `${column} ${direction}`)
        .join(', ');
    }

    if (this.limitValue !== undefined) {
      sql += ` LIMIT ${this.limitValue}`;
    }

    if (this.offsetValue !== undefined) {
      sql += ` OFFSET ${this.offsetValue}`;
    }

    return {
      sql,
      params: this.params
    };
  }
}