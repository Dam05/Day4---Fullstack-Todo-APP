from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

def get_db_connection():
    connection = sqlite3.connect('todo.db')
    connection.row_factory = sqlite3.Row
    return connection

# Fetch all tasks
@app.route('/todos', methods=['GET'])
def get_todos():
    connection = get_db_connection()
    tasks = connection.execute('SELECT * FROM tasks').fetchall()
    connection.close()

    todos = [dict(task) for task in tasks]
    return jsonify(todos)

# Add a new task
@app.route('/todos', methods=['POST'])
def add_todo():
    new_task = request.json['task']
    connection = get_db_connection()
    connection.execute('INSERT INTO tasks (task, completed) VALUES (?, ?)', (new_task, False))
    connection.commit()
    connection.close()

    return jsonify({'status': 'Task added successfully!'}), 201

# Update a task's completion status
@app.route('/todos/<int:id>', methods=['PUT'])
def update_todo(id):
    completed = request.json['completed']
    connection = get_db_connection()
    connection.execute('UPDATE tasks SET completed = ? WHERE id = ?', (completed, id))
    connection.commit()
    connection.close()

    return jsonify({'status': 'Task updated successfully!'})

# Delete a task
@app.route('/todos/<int:id>', methods=['DELETE'])
def delete_todo(id):
    connection = get_db_connection()
    connection.execute('DELETE FROM tasks WHERE id = ?', (id,))
    connection.commit()
    connection.close()

    return jsonify({'status': 'Task deleted successfully!'})

if __name__ == '__main__':
    app.run(debug=True)
