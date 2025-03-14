

function todoApp() {
    return {

        todos: [],

        // Initialize the data from local storage if available
        init() {
            const savedTodos = JSON.parse(localStorage.getItem('todos'));
            if (savedTodos) {
                this.todos = savedTodos;
            }
            this.startTimer();
        },

        // This function will update currentTime every second using x-effect
        startTimer() {
            // Create an interval that will update the currentTime every second
            setInterval(() => {
                this.currentTime = Date.now(); // Update the current time every second
            }, 1000);
        },

        // Add a new todo item
        addTodo() {
            newTodo = prompt('Enter new todo')
            if (newTodo.trim() === '') return;
            this.todos.push({
                content: newTodo.trim(),
                slots: []
            });
            this.saveToLocalStorage();
        },

        deleteAll() {
            this.todos = [];
            localStorage.removeItem('todos')
        },

        resetTodo(todo) {
            todo.slots = []
            todo.started_at = null
        },

        resetAll() {
            this.todos.forEach(t => this.resetTodo(t))
        },

        // Remove a todo item
        removeTodo(index) {
            this.todos.splice(index, 1);
            this.saveToLocalStorage();
        },

        startTodo(todo) {
            this.todos.filter(t => t.started_at && t != todo).forEach(t => this.stopTodo(t))
            todo.started_at = Date.now()
            this.saveToLocalStorage();
        },

        stopTodo(todo) {
            todo.slots.push({
                from: todo.started_at,
                to: Date.now()
            })
            todo.started_at = null
            // this.todos.splice(index, 1);
            this.saveToLocalStorage();
        },

        toggle(todo) {
            if (!todo.started_at || todo.started_at == null) {
                this.startTodo(todo)
            } else {
                this.stopTodo(todo)
            }
        },

        get timeTxt() {
            return this.todos.map((todo) => {
                const prev = todo.slots.map((s) => s.to - s.from).reduce((c, i) => c + i, 0);
                const td = prev + ((!todo.started_at) ? 0 : (this.currentTime - todo.started_at));

                // console.log(prev, td, prev + td)
                const hh = Math.floor(td / (1000 * 60 * 60)); // 1 hour = 1000 * 60 * 60 milliseconds
                const mm = Math.floor((td % (1000 * 60 * 60)) / (1000 * 60)); // 1 minute = 1000 * 60 milliseconds
                const ss = Math.floor((td % (1000 * 60)) / 1000);

                // Format hours and minutes as "hh:mm"
                return [hh > 0  ? `${hh}h` : '', mm > 0 ? `${mm}m`:'', ss > 0 ? `${ss}s`: ''].filter(s => s != '').join(' ');
                
            })
        },

        get isEmpty() {
            return this.todos.length === 0;
        },

        // Save todos to local storage
        saveToLocalStorage() {
            localStorage.setItem('todos', JSON.stringify(this.todos));
        }
    };
}
