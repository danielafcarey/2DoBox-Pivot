//// remove comments
//// move event listeners to top 
//// SOOOO MANY LOOSEY GOOSEY EQUALS! 😱
//// lots of unnamed functions that should be named 
//// need save button to be disabled if no title and/or no input

//Local Variables
var ideas = [];

////maybe not necessary since localStorageKey and the string 'loaclStorageKey' is basically the same. 
var localStorageKey = "localStorageKey";

//On load
$(document).ready(function() {
  grabIdea();
  createTemplate();
})

//Idea constructor
function IdeaObjectCreator(saveIdeaTitle, saveIdeaBody) {
  this.title = saveIdeaTitle;
  this.body = saveIdeaBody;
  this.quality = 'swill';
  this.id = Date.now();
}

// Saves idea and updates local storage array
function saveIdea() {
  var saveIdeaTitle = $('#title-field').val();
  var saveIdeaBody = $('#body-field').val();
  var idNumber = new IdeaObjectCreator(saveIdeaTitle, saveIdeaBody);
  ideas.push(idNumber);
  console.log(ideas);

  //// move below into function since you run it multiple times
  var stringIdeas = JSON.stringify(ideas);
  localStorage.setItem(localStorageKey, stringIdeas);
}

//Grabs idea out of local storage and updates array
function grabIdea() {
  var storedIdea = localStorage.getItem(localStorageKey);
  var parsedIdea = JSON.parse(storedIdea);
  console.log(parsedIdea);
  ideas = parsedIdea || [];
}

//Event Listeners
$('#save-btn').on('click', attachTemplate);
$('#idea-placement').on('click', '.delete-button', deleteIdea);
$('#idea-placement').on('click', '.up-arrow', upVoteIdeaStorage);
$('#idea-placement').on('click', '.down-arrow', downVoteIdeaStorage);

// Template creator
function createTemplate() {
  $('#idea-placement').html('');
  ideas.forEach(function(object) {
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
  });
}

// prepend the template function
function attachTemplate() {
  event.preventDefault();
  saveIdea();
  grabIdea();
  createTemplate();
  clearInputs();
}

// clear inputs
function clearInputs() {
  $('#title-field').val('');
  $('#body-field').val('');
  $('#title-field').focus();
}

function deleteIdea() {
  //// below seems a little aggressive with the multiple .parents. prob a better way
  var grandParentId = $(this).parent().parent().attr('id');
  for (var i = 0; i < ideas.length; i++) {
    var ideaId = ideas[i].id
    if (grandParentId == ideaId) {
      ideas.splice(i, 1);
      var stringIdeas = JSON.stringify(ideas);
      localStorage.setItem(localStorageKey, stringIdeas);
    }
  }

  //// very close to grandParentId line above, maybe do variable for getting this element and manipulating it. 
  $(this).parent().parent().remove();
}

// Arrow button functionality
//// unnamed function! Should pull out and rename. 
$('#idea-placement').on('click', '.up-arrow', function() {

  ////this event listener is very confusing. 
  var thisIdeaQuality = $(this).closest('div').siblings('p').children(
    'span');
  upVoteIdea(thisIdeaQuality);
});

function upVoteIdea(ideaQuality) {

  //// LOOSEY GOOSEY EQUALS! 😱
  if (ideaQuality.text() == 'swill') {
    ideaQuality.text('plausible');
  } else if (ideaQuality.text() == 'plausible') {
    ideaQuality.text('genius');
  }
}

//// unnamed function!
$('#idea-placement').on('click', '.down-arrow', function() {
  var thisIdeaQuality = $(this).siblings('p').children('span');
  downVoteIdea(thisIdeaQuality);
});

function downVoteIdea(ideaQuality) {
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
    localStorage.setItem(localStorageKey, stringIdeas);
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
    localStorage.setItem(localStorageKey, stringIdeas);
  }
}

//Search function and Event
//// OMG unnamed function inception! get that outta here 👋
$('#search-field').on('keyup', function() {
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
});

// Editable
//// Editable doesn't work on enter key - only on click or tab out
$('#idea-placement').on('blur', '.entry-title', function(e) {
    var newTitle = $(this).text();
    editableTitle(this, newTitle);
});

function editableTitle(location, newText) {
    var objectId = $(location).parent().parent().attr('id');
    ideas = JSON.parse(localStorage.getItem(localStorageKey));
    ideas.forEach(function(object) {
        if (object.id == objectId) {
            object.title = newText;
            return object.title;
        }
    });
    stringIdeas = JSON.stringify(ideas);
    localStorage.setItem(localStorageKey, stringIdeas);
}

$('#idea-placement').on('blur', '.entry-body', function(e) {
    var newBody = $(this).text();
    editableBody(this, newBody);
});

//// this function is super similar to the one above, seems like we could pass in an extra param for either body or text to do both in one. 
function editableBody(location, newText) {
    var objectId = $(location).parent().attr('id');
    ideas = JSON.parse(localStorage.getItem(localStorageKey));
    ideas.forEach(function(object) {
        if (object.id == objectId) {
            object.body = newText;
            return object.body;
        }
    });
    stringIdeas = JSON.stringify(ideas);
    localStorage.setItem(localStorageKey, stringIdeas);
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
