var tasks = {};
var today = moment();
var data;

var createTask = function (taskTime, taskText) {
  // Create elements that make up an Event block
  var taskRow = $('<div>').addClass('row no-gutters border-top border-bottom');
  var timeEl = $('<span>')
    .addClass('col-2 text-right pt-2 pr-2 border-right flex-fill')
    .text(moment(taskTime).format('h A'));
  var textEl = $('<p>').addClass('col-8 p-2').text(taskText);
  var saveEl = $('<i>').addClass(
    'fas fa-save fa-3x col-2 align-self-center text-center p-3 bg-info text-white'
  );

  // Append task elements to container row
  taskRow.append(timeEl, textEl, saveEl);

  // Audit tasks when created
  auditTask(taskRow);

  // Append the task row(s) to the container
  $('.container').append(taskRow);
  saveTasks();
};

// Edit and save tasks
// Task text was clicked
$('.container').on('click', 'p', function () {
  // Get the current text (if any)
  var text = $(this).text().trim();
  // Save it in case the change is canceled
  data = text;
  var textInput = $('<textarea>').addClass('form-control col-8 p-2').val(text);
  $(this).replaceWith(textInput);
  // Save the current text in case the change isn't saved
  textInput.trigger('focus');
});

$('.container').on('click', '.fa-save', function () {
  if ($(this).siblings('textarea').length != 0) {
    // Get the textarea's current value/text
    var text = $(this).siblings('textarea').val().trim();

    // Get the task's position in the list of other elements
    var index = $(this).closest('.row').index();

    tasks[index].text = text;
    saveTasks();

    var taskText = $('<p>').addClass('col-8 p-2').text(text);
    $(this).siblings('textarea').replaceWith(taskText);
  } else {
    return;
  }
});

// If the task lost focus without the save button being clicked,
// keep current text
$('.container').on('blur', 'textarea', function () {
  // If the save button was what caused the blur, trigger the
  // save click
  if (event.explicitOriginalTarget.classList.contains('fa-save')) {
    $('.fa-save').trigger('click');
  } else {
    // The blur event was not caused by clicking the save button
    // do not save the changed text
    var taskText = $('<p>').addClass('col-8 p-2').text(data);
    $(this).replaceWith(taskText);
  }
});

var auditTask = function (taskEl) {
  // Get hour from task element
  var taskTime = $(taskEl).find('span').text().trim();

  // Turn it back into a time string
  var time = moment(taskTime, 'LT');

  // Remove any old classes from the element
  $(taskEl).removeClass('alert-danger alert-warning');

  // Apply new class if task if near/over due date
  if (moment().isAfter(time)) {
    $(taskEl).addClass('alert-danger');
  } else if (Math.abs(moment().diff(time, 'hours')) <= 1) {
    $(taskEl).addClass('alert-warning');
  } else {
    $(taskEl).addClass('alert-success');
  }
};

// Save tasks
var saveTasks = function () {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

// Load tasks
var loadTasks = function () {
  // Set the date in the scheduler's header
  $('#currentDay').text(today.format('dddd, MMMM Do'));
  tasks = JSON.parse(localStorage.getItem('tasks'));
  // console.log(moment('YYYY M D').diff(moment(tasks[0].time), 'days'));
  var dateDiff = moment(moment(), 'YYYY-MM-DD').diff(
    moment(tasks[0].time, 'YYYY-MM-DD'),
    'days'
  );

  if (!tasks || dateDiff >= 1) {
    tasks = [];
    for (var i = 6; i <= 18; i++) {
      tasks.push({ time: moment(i, ['HH']), text: '' });
    }
  }

  // loop over object properties
  tasks.forEach((task) => createTask(task.time, task.text));
};

loadTasks();

setInterval(function () {
  $('.row').each(function (index, el) {
    auditTask(el);
  });
}, 60000);
