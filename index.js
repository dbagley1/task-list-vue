const app = Vue.createApp({
  template: `

    <div class="d-flex justify-content-between align-items-center">
      <app-header title="Task List"></app-header>
      <add-button text="Add Task" :showAddTask="showAddTask" color="" @click="() => showAddTask = !showAddTask"></add-button>
    </div>
    <div v-show="showAddTask">
      <add-task @add-task="addTask"></add-task>
    </div>
    <task-list :tasks="tasks" @delete-task="deleteTask" @toggle-reminder="toggleReminder"></task-list>
    
  `,
  data() {
    return {
      tasks: [],
      showAddTask: false,
      defaultTasks: [
        {
          id: 1,
          title: 'Go to the store',
          day: 'Monday',
          reminder: true,
          completed: true
        },
        {
          id: 2,
          title: 'Finish screencast',
          day: 'Monday',
          reminder: false,
          completed: false
        },
        {
          id: 3,
          title: 'Clear inbox',
          day: 'Tuesday',
          reminder: true,
          completed: false
        },
        {
          id: 4,
          title: 'Make dinner',
          day: 'Wednesday',
          reminder: false,
          completed: false
        },
        {
          id: 5,
          title: 'Clean room',
          day: 'Thursday',
          reminder: true,
          completed: true
        }
      ],
    };
  },
  created() {
    this.tasks = this.loadTasks()?.length ? this.loadTasks() : this.defaultTasks;
  },
  methods: {
    deleteTask(id) {
      console.log('deleteTask', id);
      this.tasks = this.tasks.filter(task => task.id !== id);
      this.storeTasks(this.tasks);
    },
    toggleReminder(id) {
      console.log('toggleReminder', id);
      const task = this.tasks.find(task => task.id === id);
      console.log(task);
      task.reminder = !task.reminder;
      this.storeTasks(this.tasks);
    },
    addTask(task) {
      this.tasks.push(task);
      this.storeTasks(this.tasks);
    },
    storeTasks(tasks) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    },
    loadTasks() {
      const load = localStorage.getItem('tasks');
      return load ? JSON.parse(load) : null;
    },
  },
});

app.component('app-header', {
  template: '<h1 class="m-0">{{title}}</h1>',
  props: {
    title: String,
  },
});

app.component('add-button', {
  template: `
  
    <button @click="onClick()" :style="{ backgroundColor: color, borderColor: color }" class="shadow-none btn btn-outline-primary">
      {{text}} <i class="ms-1 fas" :class="[showAddTask ? 'fa-chevron-down' : 'fa-chevron-right']"></i>
    </button>
  
  `,
  props: {
    text: String,
    color: String,
    showAddTask: Boolean,
  },
  methods: {
    onClick() {
      console.log('I was clicked!');
    }
  }
});

app.component('task-list', {
  template: `

    <div class="task-list">
      <div v-for="task in tasks" :key="task.id">
        <task :task="task" @delete-task="$emit('delete-task', task.id)"
          @toggle-reminder="$emit('toggle-reminder', task.id)"></task>
      </div>
    </div>
  
  `,
  props: {
    tasks: Array,
  },
});

app.component('task', {
  template: `

    <div @dblclick="$emit('toggle-reminder', task.id)" class="task" :class="[task.reminder ? 'reminder' : 'no-remind']">
      <div class="task-title">
        <h3>{{ task.title }}</h3>
        <i class="fas fa-times" @click="$emit('delete-task', task.id)"></i>
      </div>
      <p>{{ task.day }}</p>
    </div>

  `,
  props: {
    task: Object,
  },
  methods: {
  },
});

app.component('add-task', {
  template: `

  <form @submit="onSubmit" class="add-form" autocomplete="off">
    <div>
      <label for="text">Task</label>
      <input class="form-control" type="text" name="text" placeholder="Add Task" v-model="text" />
    </div>
    <div>
      <label for="day">Due Date</label>
      <input class="form-control" type="date" name="day" v-model="day" />
    </div>
    <div class="d-flex">
      <input class="form-check me-1" type="checkbox" name="reminder" id="reminder" v-model="reminder" />
      <label for="reminder">Set Reminder?</label>
    </div>
    <div className="d-grid">
      <input type="submit" value="Save Task" class="btn btn-primary" />
    </div>
  </form>

  `,
  data() {
    return {
      text: '',
      day: '',
      reminder: false,
    };
  },
  methods: {
    onSubmit(e) {
      e.preventDefault();
      console.log('onSubmit');

      if (!this.text) {
        alert('Please enter a task');
        return;
      }

      const newTask = {
        id: Math.floor(Math.random() * 100000),
        title: this.text,
        day: this.day,
        reminder: this.reminder,
      };
      this.text = '';
      this.day = '';
      this.reminder = false;

      console.log(newTask);

      this.$emit('add-task', newTask);
    }
  }
});

app.mount('#app');
