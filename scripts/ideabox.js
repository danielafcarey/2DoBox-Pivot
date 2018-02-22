
$('#save-btn').on('click', createCard);
$('.todo-input').on('keyup', enableBtn);
$('.completed').on('click', showCompleted);
$('#filter-field').on('keyup', filterCards);
$('.checked').on('click', filterImportance);
$('.checked').on('click', toggleShowMoreButton);
$('#card-placement').on('click', '.delete-button', deleteCard);
$('#card-placement').on('click', '.up-arrow', changeCardImportance); 
$('#card-placement').on('click', '.down-arrow', changeCardImportance); 
$('#card-placement').on('blur', '.entry-title', editText);
$('#card-placement').on('blur', '.entry-task', editText); 
$('#card-placement').on('keydown', '.entry-title', saveOnEnterKey);
$('#card-placement').on('keydown', '.entry-task', saveOnEnterKey);
$('#card-placement').on('click', '.complete-task', markAsComplete);
$('.more-cards-button').on('click', showTenMoreCards);

$(document).ready(function() {
  for (var i = 0; i < localStorage.length; i++) {
    var retrievedTask = localStorage.getItem(localStorage.key(i));
    var parsedTask = JSON.parse(retrievedTask);
    if (parsedTask.completed === 'mark as complete') {
      prependCard(parsedTask);
    }
  } 
  $('.object-container:gt(9)').hide();
});

function enableBtn() {
  if ($('#title-field').val() !== '' && $('#task-field').val() !== '' && $('#completed').is(':not(:checked)')) {
    $('#save-btn').attr('disabled', false)
  } else {
    $('#save-btn').attr('disabled', true)
  }
};

function TaskObjectCreator(title, task) {
  this.title = title;
  this.task = task;
  this.importance = 'normal';
  this.id = Date.now();
  this.completed = 'mark as complete';
};

function createCard(event) {
  event.preventDefault();
  var inputTitleValue = $('#title-field').val();
  var inputTaskValue = $('#task-field').val();
  var taskObject = new TaskObjectCreator(inputTitleValue, inputTaskValue);

  setInLocalStorage(taskObject.id, taskObject);
  prependCard(taskObject);
  clearInputs();
};

function setInLocalStorage(cardId, updatedTaskObject) {
  var stringifiedTask = JSON.stringify(updatedTaskObject);

  localStorage.setItem(cardId, stringifiedTask);
};

function getTaskFromStorage(cardId) {
  var retrievedTask = localStorage.getItem(cardId);
  var parsedTask = JSON.parse(retrievedTask);

  return parsedTask;
};

function prependCard(object) {
  $('#card-placement').prepend(
    `<article aria-label="Task card" class="object-container" id="${object.id}">
      <h2 class="entry-title" contenteditable="true">${object.title}</h2>
      <input type="button" class="delete-button">
      <p class="entry-task" contenteditable="true">${object.task}</p>
      <input type="button" class="up-arrow" aria-label="upvote button" name="upvote">
      <input type="button" class="down-arrow" aria-label="downvote button">
      <p class="importance-rank">importance: 
        <span class="set-importance">${object.importance}</span>
      </p>
      <input value="${object.completed}" name="complete-button" type="button" class="complete-task" aria-label="complete-task">
      <hr>
    </article>`
  );

  $('.object-container:gt(9)').hide();
};

function clearInputs() {
  $('#title-field').val('');
  $('#task-field').val('');
  $('#title-field').focus();
  enableBtn();
};

function deleteCard() {
  var cardId = $(this).parent().attr('id');

  localStorage.removeItem(cardId);
  $(this).closest('article').remove();
};

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
};

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
};

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

  setInLocalStorage(cardId, currentCard);
};

function saveOnEnterKey(event) {
  if (event.keyCode === 13) {
    $(this).blur();
  }
};

function filterCards() {
  var filterInputValue = $('#filter-field').val();
  var filterObject = new RegExp(filterInputValue, 'gim');

  $('.object-container').each(function() {
    var title = $(this).find(".entry-title").text();
    var task = $(this).find(".entry-task").text();
    var match = (title.match(filterObject) || task.match(filterObject));
    if (!match) {
      $(this).hide();
    } else {
      $(this).show();
    }
  });
};

function markAsComplete() {
  var cardId = $(this).parents().attr('id');
  var currentCard = getTaskFromStorage(cardId);

  if (currentCard.completed === 'mark as complete') {
    currentCard.completed = 'completed';
    $(this).attr('value', 'completed');
    $(this).closest('article').toggleClass('marked-as-complete');
  }

  setInLocalStorage(cardId, currentCard);
};

function showTenMoreCards() {
  var cardListSize = $('.object-container').size();
  var hiddenCardListSize = $('.object-container:hidden').size();
  var amountToShow = cardListSize - hiddenCardListSize + 9

  $('.object-container').show()
  $(`.object-container:gt(${amountToShow})`).hide();
};

function showCompleted() {
  $('.object-container').remove();
  for (var i = 0; i < localStorage.length; i++) {
    var retrievedTask = localStorage.getItem(localStorage.key(i));
    var parsedTask = JSON.parse(retrievedTask);
    if ($(this).is(':checked') && parsedTask.completed === 'completed') {
      prependCard(parsedTask);
    } else if ($(this).is(':not(:checked)') && parsedTask.completed === 'mark as complete'){
      prependCard(parsedTask);
    }
  } 

  enableBtn();
};     

function filterImportance() {
  var impLevelVal = $(this).val();

  if ($(this).is(':checked')) {
    $('.set-importance:contains("' + impLevelVal + '")').closest('.object-container').show();
    $('.set-importance:not(:contains("' + impLevelVal + '"))').closest('.object-container').hide();
  } else {
    $('.set-importance').closest('.object-container:lt(10)').show();
  }
};

function toggleShowMoreButton() {
  if ($(this).is(':checked')) {
    $('.more-cards-button').hide();
  } else {
    $('.more-cards-button').show();
  }
};


