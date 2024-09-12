from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# Configure the database URI (SQLite in this case)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database
db = SQLAlchemy(app)

# Define the Task model
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    task = db.Column(db.String(200), nullable=False)

    def to_dict(self):
        return {'id': self.id, 'task': self.task}

# Create database tables
with app.app_context():
    db.create_all()

# Route to serve the HTML page
@app.route('/')
def index():
    return render_template('index.html')

# Route to get all tasks
@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    tasks = Task.query.all()
    return jsonify([task.to_dict() for task in tasks])

# Route to add a new task
@app.route('/api/tasks', methods=['POST'])
def add_task():
    task_text = request.json.get('task')
    if task_text:
        new_task = Task(task=task_text)
        db.session.add(new_task)
        db.session.commit()
        return jsonify({"message": "Task added successfully"}), 201
    return jsonify({"error": "Task is required"}), 400

# Route to delete a task
@app.route('/api/tasks/<int:id>', methods=['DELETE'])
def delete_task(id):
    task = Task.query.get(id)
    if task:
        db.session.delete(task)
        db.session.commit()
        return jsonify({"message": "Task deleted successfully"}), 200
    return jsonify({"error": "Task not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)
