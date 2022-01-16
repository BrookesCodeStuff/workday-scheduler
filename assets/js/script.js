var tasks = {};
var today = moment();

var createTask = function (taskTime, taskText) {
  // Create elements that make up an Event block
  var taskRow = $('<div>').addClass('row no-gutters border-top border-bottom');
  var timeEl = $('<span>')
    .addClass('col-2 text-right pt-2 pr-2 border-right flex-fill')
    .text(taskTime);
  var textEl = $('<p>').addClass('col-8 p-2').text(taskText);
  var saveEl = $('<i>').addClass(
    'fas fa-save fa-3x col-2 align-self-center text-center p-3 bg-info text-white'
  );

  // Append task elements to container row
  taskRow.append(timeEl, textEl, saveEl);

  // Append the task row(s) to the container
  $('.container').append(taskRow);
  saveTasks();
};

var saveTasks = function () {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

var loadTasks = function () {
  console.log(today);
  $('#currentDay').text(today.format('dddd, MMMM Do'));
  tasks = JSON.parse(localStorage.getItem('tasks'));

  if (!tasks) {
    tasks = [];
    for (var i = 6; i <= 18; i++) {
      tasks.push({ time: moment(i, ['HH']).format('h A'), text: '' });
    }
  }

  // loop over object properties
  tasks.forEach((task) => createTask(task.time, task.text));
};

loadTasks();
