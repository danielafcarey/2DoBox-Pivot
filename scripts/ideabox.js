
//// remove comments
//// SOOOO MANY LOOSEY GOOSEY EQUALS! 😱
//// save button to be disabled if no title and/or no input

$('#save-btn').on('click', createCard);
$('#idea-placement').on('click', '.delete-button', deleteIdea);
$('#idea-placement').on('click', '.up-arrow', upVoteIdeaStorage);
$('#idea-placement').on('click', '.down-arrow', downVoteIdeaStorage);
$('#idea-placement').on('click', '.up-arrow', upVoteIdea); 
$('#idea-placement').on('click', '.down-arrow', downVoteIdea); 
$('#idea-placement').on('blur', '.entry-title', editableTitle);
$('#idea-placement').on('blur', '.entry-body', editableBody); 
$('#search-field').on('keyup', search);

//On load
$(document).ready(function() {
  getIdeaFromStorage();
  ideas.forEach(function(object) {
    prependCard(object);
  });
})

//Idea constructor
function IdeaObjectCreator(saveIdeaTitle, saveIdeaBody) {
  this.title = saveIdeaTitle;
  this.body = saveIdeaBody;
  this.quality = 'swill';
  this.id = Date.now();
}

// Saves idea and updates local storage array
function createCard() {
  var saveIdeaTitle = $('#title-field').val();
  var saveIdeaBody = $('#body-field').val();
  var idNumber = new IdeaObjectCreator(saveIdeaTitle, saveIdeaBody);
  ideas.push(idNumber);

  setInLocalStorage(ideas)
  prependCard(ideas)
}

function setInLocalStorage(ideas) {
  localStorage.setItem('localStorageKey', JSON.stringify(ideas));
}

function getIdeaFromStorage() {
  var storedIdea = localStorage.getItem('localStorageKey');
  var parsedIdea = JSON.parse(storedIdea);
  ideas = parsedIdea;
}

function prependCard(object) {
  $('#idea-placement').prepend(
    `
    <article aria-label="Idea card" class="object-container" id="${object.id}">
      <div class="flex-container">
        <h2 class="entry-title" contenteditable="true">${object.title}</h2>
        <div role="button" class="delete-button"></div>
      </div>
      <p class="entry-body" contenteditable="true">${object.body}</p>
      <div role="button" class="up-arrow" alt="upvote button"></div>
      <div role="button" class="down-arrow" alt="downvote button"></div>
      <p class="quality-rank">quality: <span class="open-sans">${object.quality}</span></p>
    </article>`
  );
};  

// function clearInputs() {
//   $('#title-field').val('');
//   $('#body-field').val('');
//   $('#title-field').focus();
// }

function deleteIdea() {
  //// below seems a little aggressive with the multiple .parents. prob a better way
  var grandParentId = $(this).parent().parent().attr('id');
  for (var i = 0; i < ideas.length; i++) {
    var ideaId = ideas[i].id
    if (grandParentId == ideaId) {
      ideas.splice(i, 1);
      var stringIdeas = JSON.stringify(ideas);
      localStorage.setItem('localStorageKey', stringIdeas);
    }
  }

  //// very close to grandParentId line above, maybe do variable for getting this element and manipulating it. 
  $(this).parent().parent().remove();
}

// Arrow button functionality
//// unnamed function! Should pull out and rename. 

function upVoteIdea() {
  var ideaQuality = $(this).closest('div').siblings('p').children(
    'span');
  //// LOOSEY GOOSEY EQUALS! 😱
  if (ideaQuality.text() == 'swill') {
    ideaQuality.text('plausible');
  } else if (ideaQuality.text() == 'plausible') {
    ideaQuality.text('genius');
  }
}

//// unnamed function!

function downVoteIdea() {
  var ideaQuality = $(this).siblings('p').children('span');
  if (ideaQuality.text() == 'genius') {
    ideaQuality.text('plausible');
  } else if (ideaQuality.text() == 'plausible') {
    ideaQuality.text('swill');
  }
}


//// this function seems to be doing extra work - you already checked the conditional in the DOM, you just need to replace it in local storage
function upVoteIdeaStorage(ideaQuality) {
  var grandParentId = $(this).parent()[0].id;
  for (var i = 0; i < ideas.length; i++) {
    var ideaId = ideas[i].id;
    if (grandParentId == ideaId && ideas[i].quality == 'swill') {
      ideas[i].quality = 'plausible';
    } else if (grandParentId == ideaId && ideas[i].quality == 'plausible') {
      ideas[i].quality = 'genius';
    }
    var stringIdeas = JSON.stringify(ideas);
    localStorage.setItem('localStorageKey', stringIdeas);
  }
}


//// same as above: this if/else if doesn't need to happen again
function downVoteIdeaStorage() {
  var grandParentId = $(this).parent()[0].id;
  for (var i = 0; i < ideas.length; i++) {
    var ideaId = ideas[i].id;
    if (grandParentId == ideaId && ideas[i].quality == 'genius') {
      ideas[i].quality = 'plausible';
    } else if (grandParentId == ideaId && ideas[i].quality == 'plausible') {
      ideas[i].quality = 'swill';
    }
    var stringIdeas = JSON.stringify(ideas);
    localStorage.setItem('localStorageKey', stringIdeas);
  }
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

// Editable
//// Editable doesn't work on enter key - only on click or tab out

function editableTitle() {
    var newTitle = $(this).text();
    var objectId = $(this).parent().parent().attr('id');
    ideas = JSON.parse(localStorage.getItem('localStorageKey'));
    ideas.forEach(function(object) {
        if (object.id == objectId) {
            object.title = newTitle;
            return object.title;
        }
    });
    stringIdeas = JSON.stringify(ideas);
    localStorage.setItem('localStorageKey', stringIdeas);
}

//// this function is super similar to the one above, seems like we could pass in an extra param for either body or text to do both in one. 
function editableBody() {
    var newBody = $(this).text();
    var objectId = $(this).parent().attr('id');
    ideas = JSON.parse(localStorage.getItem('localStorageKey'));
    ideas.forEach(function(object) {
        if (object.id == objectId) {
            object.body = newBody;
            return object.body;
        }
    });
    stringIdeas = JSON.stringify(ideas);
    localStorage.setItem('localStorageKey', stringIdeas);
}

// Expanding Text Area
//// do this with the css/html 
var expandingTextArea = (function(){
  var textAreaTag = document.querySelectorAll('textarea')
  for (var i=0; i<textAreaTag.length; i++){
    textAreaTag[i].addEventListener('paste',autoExpand);
    textAreaTag[i].addEventListener('input',autoExpand);
    textAreaTag[i].addEventListener('keyup',autoExpand);
  }
  function autoExpand(e,el){
    var el = el || e.target;
    el.style.height = 'inherit';
    el.style.height = el.scrollHeight+'px';
  }
})()


//// DON'T NEED THIS FUNCTION
// function attachTemplate(event) {
//   event.preventDefault();
//   createCard();
//   // getIdeaFromStorage();
//   // prependCard();
//   clearInputs();
//   console.log('attach template ran');
// }
