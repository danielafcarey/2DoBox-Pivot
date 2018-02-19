
//// save button to be disabled if no title and/or no input
$('#save-btn').on('click', createCard);
$('#card-placement').on('click', '.delete-button', deleteCard);
$('#card-placement').on('click', '.up-arrow', changeCardImportance); 
$('#card-placement').on('click', '.down-arrow', changeCardImportance); 
$('#card-placement').on('blur', '.entry-title', editText);
$('#card-placement').on('blur', '.entry-task', editText); 
$('#card-placement').on('keydown', '.entry-title', saveOnEnterKey);
$('#card-placement').on('keydown', '.entry-task', saveOnEnterKey);
$('#filter-field').on('keyup', search);
$('.todo-input').on('keyup', enableBtn);




function enableBtn() {
  if ($('#title-field').val() !== '' && $('#task-field').val() !== '') {
    $('#save-btn').attr('disabled', false)
  } else {
    $('#save-btn').attr('disabled', true)
  }
}

//On load (should we condense variabeles?)
$(document).ready(function() {
  for (var i = 0; i < localStorage.length; i++) {
    var retrievedTasks = localStorage.getItem(localStorage.key(i));
    var parsedTasks = JSON.parse(retrievedTasks);
    prependCard(parsedTasks);
  };
})
function TaskObjectCreator(title, task) {
  this.title = title;
  this.task = task;
  this.importance = 'normal';
  this.id = Date.now();
}
function createCard(event) {
  event.preventDefault();
  var inputTitleValue = $('#title-field').val();
  var inputTaskValue = $('#task-field').val();
  var taskObject = new TaskObjectCreator(inputTitleValue, inputTaskValue);
  setInLocalStorage(taskObject.id, taskObject);
  prependCard(taskObject);
  clearInputs();
}
// Set/retrieve local storage. Should we shorten?
function setInLocalStorage(cardId, updatedTaskObject) {
  var stringifiedTask = JSON.stringify(updatedTaskObject);
  localStorage.setItem(cardId, stringifiedTask);
}
function getTaskFromStorage(cardId) {
  var retrievedTasks = localStorage.getItem(cardId);
  var parsedTasks = JSON.parse(retrievedTasks);
  return parsedTasks;
}
function prependCard(object) {
  $('#card-placement').prepend(
    `<article aria-label="Task card" class="object-container" id="${object.id}">
      <h2 class="entry-title" contenteditable="true">${object.title}</h2>
      <input type="button" class="delete-button"></input>
      <p class="entry-task" contenteditable="true">${object.task}</p>
      <input type="button" class="up-arrow" alt="upvote button" name="upvote"></input>
      <input type="button" class="down-arrow" alt="downvote button"></input>
      <p class="importance-rank">importance: 
        <span class="open-sans">${object.importance}</span>
      </p>
      <hr>
    </article>`
  );
};  
function clearInputs() {
  $('#title-field').val('');
  $('#task-field').val('');
  $('#title-field').focus();
  $('#save-btn').attr('disabled', true)
}
function deleteCard() {
  var cardId = $(this).parent().attr('id');
  localStorage.removeItem(cardId);
  $(this).closest('article').remove();
}
function getNewCardImportance(currentImportance, voteDirection) {
  var importanceLevelsArray = [
    'none', 
    'low', 
    'normal',
    'high',
    'critical'
    ]
  var currentImportanceIndex = importanceLevelsArray.indexOf(currentImportance);
  if (voteDirection === 'up-arrow') {
    return importanceLevelsArray[currentImportanceIndex + 1]
  } else if (voteDirection === 'down-arrow') {
    return importanceLevelsArray[currentImportanceIndex - 1]
  }
}
function changeCardImportance() {
  var cardId = $(this).parents().attr('id');
  var clickedBtn = $(this).attr('class');
  var currentCard = getTaskFromStorage(cardId);
  if ((currentCard.importance !== 'critical') && (clickedBtn === 'up-arrow')) {
    currentCard.importance = getNewCardImportance(currentCard.importance, clickedBtn);
  } else if ((currentCard.importance !== 'none') && (clickedBtn === 'down-arrow')) {
    currentCard.importance = getNewCardImportance(currentCard.importance, clickedBtn);
  }
  setInLocalStorage(cardId, currentCard)
  $(this).siblings('p').children().text(currentCard.importance);
}
//// Editable doesn't work on enter key - only on click or tab out
function editText() {
  var newText = $(this).text()
  var changeLocation = $(this).attr('class')
  var cardId = $(this).parents().attr('id');
  var currentCard = getTaskFromStorage(cardId);
  if (changeLocation === 'entry-title') {
    currentCard.title = newText;
  } else if (changeLocation === 'entry-task') {
    currentCard.task = newText;
  }
  setInLocalStorage(cardId, currentCard)
}

function saveOnEnterKey(event) {
  if (event.keyCode === 13) {
       $(this).blur();
   }
}

function search() {
  var searchInput = $('#filter-field').val();
  var searcher = new RegExp(searchInput, 'gim');
  $('.object-container').each(function() {
    var title = $(this).find(".entry-title").text();
    var task = $(this).find(".entry-task").text();
    var match = (title.match(searcher) || task.match(searcher));
    if (!match) {
      $(this).hide();
    } else {
      $(this).show();
    }
  })
};


