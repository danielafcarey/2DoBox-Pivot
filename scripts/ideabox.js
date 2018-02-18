
//// remove comments
//// SOOOO MANY LOOSEY GOOSEY EQUALS! 😱
//// save button to be disabled if no title and/or no input

$('#save-btn').on('click', createCard);
$('#idea-placement').on('click', '.delete-button', deleteIdea);
$('#idea-placement').on('click', '.up-arrow', upvoteCardQuality); 
$('#idea-placement').on('click', '.down-arrow', downvoteCardQuality); 
$('#idea-placement').on('blur', '.entry-title', editableTitle);
$('#idea-placement').on('blur', '.entry-body', editableBody); 
$('#search-field').on('keyup', search);

//On load (should we condense variabeles)
$(document).ready(function() {
  for (var i = 0; i < localStorage.length; i++) {
  var retrievedIdeas = localStorage.getItem(localStorage.key(i));
  var parsedIdeas = JSON.parse(retrievedIdeas);
  prependCard(parsedIdeas);
  };
  // changeCardQuality();
})

//Idea constructor
function IdeaObjectCreator(title, body) {
  this.title = title;
  this.body = body;
  this.quality = 'None';
  this.id = Date.now();
}

// Saves idea and updates local storage array
function createCard(event) {
  event.preventDefault();
  var inputTitleValue = $('#title-field').val();
  var inputBodyValue = $('#body-field').val();
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
      <div class="flex-container">
        <h2 class="entry-title" contenteditable="true">${object.title}</h2>
        <div role="button" class="delete-button"></div>
      </div>
      <p class="entry-body" contenteditable="true">${object.body}</p>
      <div role="button" class="up-arrow" alt="upvote button"></div>
      <div role="button" class="down-arrow" alt="downvote button"></div>
      <p class="quality-rank">quality: 
        <span class="open-sans">${object.quality}</span>
      </p>
    </article>`
  );
};  

function clearInputs() {
  $('#title-field').val('');
  $('#body-field').val('');
  $('#title-field').focus();
}

function deleteIdea() {
  var cardId = $(this).parent().parent().attr('id');
  localStorage.removeItem(cardId);
  $(this).closest('article').remove();
}

function getNewCardQuality(currentQuality, voteDirection) {
  var qualitiesArray = [
    'None', 
    'Low', 
    'Normal',
    'High',
    'Critical'
    ]

  var currentQualityIndex = qualitiesArray.indexOf(currentQuality);
  console.log(currentQualityIndex);
  if ((voteDirection === 'upvote') && (0 <= currentQualityIndex <= 3)) {
    console.log('up is true');
    return qualitiesArray[currentQualityIndex + 1]
  } else if ((voteDirection === 'downvote') && (currentQualityIndex > 0)) {
    console.log('down is true');
    return qualitiesArray[currentQualityIndex - 1]
  }
}
 
function upvoteCardQuality() {
  var cardId = $(this).parents().attr('id');
  var currentCard = getIdeaFromStorage(cardId);
  currentCard.quality = getNewCardQuality(currentCard.quality, 'upvote');
  setInLocalStorage(cardId, currentCard)
  $(this).siblings('p').children().text(currentCard.quality);
  
}

function downvoteCardQuality() {
  var cardId = $(this).parents().attr('id');
  var currentCard = getIdeaFromStorage(cardId);
  currentCard.quality = getNewCardQuality(currentCard.quality, 'downvote');
  setInLocalStorage(cardId, currentCard)
  $(this).siblings('p').children().text(currentCard.quality);
}

//Search function and Event
//// OMG unnamed function inception! get that outta here 👋

function search() {
  var searchInput = $('#search-field').val();
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

//// Editable doesn't work on enter key - only on click or tab out
function editableTitle() {
  var newTitle = $(this).text();
  var cardId = $(this).parent().parent().attr('id');
  var currentCard = getIdeaFromStorage(cardId)
  currentCard.title = newTitle
  setInLocalStorage(cardId, currentCard)
}

//// this function is super similar to the one above, seems like we could pass in an extra param for either body or text to do both in one. 
function editableBody() {
  var newBody = $(this).text();
  var cardId = $(this).parent().attr('id');
  var currentCard = getIdeaFromStorage(cardId)
  currentCard.body = newBody
  setInLocalStorage(cardId, currentCard)
}

// Expanding Text Area
//// do this with the css/html 
// var expandingTextArea = (function(){
//   var textAreaTag = document.querySelectorAll('textarea')
//   for (var i=0; i<textAreaTag.length; i++){
//     textAreaTag[i].addEventListener('paste',autoExpand);
//     textAreaTag[i].addEventListener('input',autoExpand);
//     textAreaTag[i].addEventListener('keyup',autoExpand);
//   }
//   function autoExpand(e,el){
//     var el = el || e.target;
//     el.style.height = 'inherit';
//     el.style.height = el.scrollHeight+'px';
//   }
// })


//// DON'T NEED THIS FUNCTION
// function attachTemplate(event) {
//   event.preventDefault();
//   createCard();
//   // getIdeaFromStorage();
//   // prependCard();
//   clearInputs();
//   console.log('attach template ran');
// }
