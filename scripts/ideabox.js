
//// save button to be disabled if no title and/or no input
$('#save-btn').on('click', createCard);
$('#idea-placement').on('click', '.delete-button', deleteIdea);
$('#idea-placement').on('click', '.up-arrow', changeCardQuality); 
$('#idea-placement').on('click', '.down-arrow', changeCardQuality); 
$('#idea-placement').on('blur', '.entry-title', editableText);
$('#idea-placement').on('blur', '.entry-body', editableText); 
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
    var retrievedIdeas = localStorage.getItem(localStorage.key(i));
    var parsedIdeas = JSON.parse(retrievedIdeas);
    prependCard(parsedIdeas);
  };
})
function IdeaObjectCreator(title, body) {
  this.title = title;
  this.body = body;
  this.quality = 'Normal';
  this.id = Date.now();
}
function createCard(event) {
  event.preventDefault();
  var inputTitleValue = $('#title-field').val();
  var inputBodyValue = $('#task-field').val();
  var ideaObject = new IdeaObjectCreator(inputTitleValue, inputBodyValue);
  setInLocalStorage(ideaObject.id, ideaObject);
  prependCard(ideaObject);
  clearInputs();
}
// Set/retrieve local storage. Should we shorten?
function setInLocalStorage(cardId, updatedIdeaObject) {
  var stringifiedIdea = JSON.stringify(updatedIdeaObject);
  localStorage.setItem(cardId, stringifiedIdea);
}
function getIdeaFromStorage(cardId) {
  var retrievedIdeas = localStorage.getItem(cardId);
  var parsedIdeas = JSON.parse(retrievedIdeas);
  return parsedIdeas;
}
function prependCard(object) {
  $('#idea-placement').prepend(
    `<article aria-label="Idea card" class="object-container" id="${object.id}">
      <h2 class="entry-title" contenteditable="true">${object.title}</h2>
      <input type="button" class="delete-button"></input>
      <p class="entry-body" contenteditable="true">${object.body}</p>
      <input type="button" class="up-arrow" alt="upvote button" name="upvote"></input>
      <input type="button" class="down-arrow" alt="downvote button"></input>
      <p class="quality-rank">quality: 
        <span class="open-sans">${object.quality}</span>
      </p>
    </article>`
  );
};  
function clearInputs() {
  $('#title-field').val('');
  $('#task-field').val('');
  $('#title-field').focus();
  $('#save-btn').attr('disabled', true)
}
function deleteIdea() {
  var cardId = $(this).parent().attr('id');
  localStorage.removeItem(cardId);
  $(this).closest('article').remove();
}
// fix this weird loop problem
function getNewCardQuality(currentQuality, voteDirection) {
  var qualitiesArray = [
    'None', 
    'Low', 
    'Normal',
    'High',
    'Critical'
    ]
  var currentQualityIndex = qualitiesArray.indexOf(currentQuality);
  if (voteDirection === 'up-arrow') {
    return qualitiesArray[currentQualityIndex + 1]
  } else if (voteDirection === 'down-arrow') {
    return qualitiesArray[currentQualityIndex - 1]
  }
}
function changeCardQuality() {
  var cardId = $(this).parents().attr('id'); //this is only used once so you can remove line to get under 8 lines
  var clickedBtn = $(this).attr('class');
  var currentCard = getIdeaFromStorage(cardId);
  if ((currentCard.quality !== 'Critical') && (clickedBtn === 'up-arrow')) {
    currentCard.quality = getNewCardQuality(currentCard.quality, clickedBtn);
  } else if ((currentCard.quality !== 'None') && (clickedBtn === 'down-arrow')) {
    currentCard.quality = getNewCardQuality(currentCard.quality, clickedBtn);
  }
  setInLocalStorage(cardId, currentCard)
  $(this).siblings('p').children().text(currentCard.quality);
}
//// Editable doesn't work on enter key - only on click or tab out
function editableText() {
  var newText = $(this).text()
  var changeLocation = $(this).attr('class')
  var cardId = $(this).parents().attr('id');
  var currentCard = getIdeaFromStorage(cardId);
  if (changeLocation === 'entry-title') {
    currentCard.title = newText;
  } else if (changeLocation === 'entry-body') {
    currentCard.body = newText;
  }
  setInLocalStorage(cardId, currentCard)
}
function search() {
  var searchInput = $('#filter-field').val();
  var searcher = new RegExp(searchInput, 'gim');
  $('.object-container').each(function() {
    var title = $(this).find(".entry-title").text();
    var body = $(this).find(".entry-body").text();
    var match = (title.match(searcher) || body.match(searcher));
    if (!match) {
      $(this).hide();
    } else {
      $(this).show();
    }
  })
};


