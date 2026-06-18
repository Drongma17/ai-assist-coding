// todo app with add, remove, and list functions
class Todo {
    constructor() {
        this.todos = [];
    }

    add(todo) {
        this.todos.push(todo);
    }

    remove(index) {
        if (index >= 0 && index < this.todos.length) {
            this.todos.splice(index, 1);                    
        }
    }

    list() {
        return this.todos;
    }
}       