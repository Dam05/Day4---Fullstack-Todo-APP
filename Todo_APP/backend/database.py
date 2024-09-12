import sqlite3

def create_table():
    connection = sqlite3.connect('todo.db')  # Creates the database file
    cursor = connection.cursor()

    # Create a table for tasks if it doesn't exist
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            task TEXT NOT NULL,
            completed BOOLEAN NOT NULL CHECK (completed IN (0, 1))
        )
    ''')

    connection.commit()
    connection.close()

if __name__ == '__main__':
    create_table()
