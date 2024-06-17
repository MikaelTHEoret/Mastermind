import sqlite3
from datetime import datetime

class LoggingSystem:
    def __init__(self, db_path='logs.db'):
        self.conn = sqlite3.connect(db_path)
        self.create_log_table()

    def create_log_table(self):
        query = """
        CREATE TABLE IF NOT EXISTS Log (
            id INTEGER PRIMARY KEY,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            user TEXT,
            action TEXT,
            details TEXT
        )
        """
        self.conn.execute(query)
        self.conn.commit()

    def log_action(self, user, action, details):
        query = """
        INSERT INTO Log (user, action, details) VALUES (?, ?, ?)
        """
        self.conn.execute(query, (user, action, details))
        self.conn.commit()

    def get_logs(self):
        query = 'SELECT * FROM Log'
        cursor = self.conn.execute(query)
        return cursor.fetchall()