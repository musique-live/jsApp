/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

// Shortcuts to DOM Elements.
var messageForm = document.getElementById('message-form');
var bandForm = document.getElementById('band-form');
var venueForm = document.getElementById('venue-form');

var messageInput = document.getElementById('new-post-message');
var priceInput = document.getElementById('new-post-price');
var titleInput = document.getElementById('new-post-title');
var bandIDInput = document.getElementById('new-post-band-id');
var venueIDInput = document.getElementById('new-post-venue-id');
var timeInput = document.getElementById('new-post-time');
var eventLinkInput = document.getElementById('new-post-event-link');
var eventImageInput = document.getElementById('new-post-event-image');


var bandNameInput = document.getElementById('new-band-band-title');
var bandImageInput = document.getElementById('new-band-band-image');
var bandTagsInput = document.getElementById('new-band-band-genre');
var bandDancingInput = document.getElementById('new-band-band-dancing');
var bandYoutubeInput = document.getElementById('new-band-band-youtube');
var bandWebsiteInput = document.getElementById('new-band-band-website');
var bandFacebookInput = document.getElementById('new-band-band-facebook');
var bandDescriptionInput = document.getElementById('new-band-band-description');

var venueNameInput = document.getElementById('new-venue-venue-title');
var venueYelpInput = document.getElementById('new-venue-venue-yelp');
var venueImageInput = document.getElementById('new-venue-venue-image');
var venueFacebookInput = document.getElementById('new-venue-venue-facebook');
var venueAddressInput = document.getElementById('new-venue-venue-address');
var venueDancingInput = document.getElementById('new-venue-venue-dancing');


var signInButton = document.getElementById('sign-in-button');
var signOutButton = document.getElementById('sign-out-button');
var splashPage = document.getElementById('page-splash');

var addPost = document.getElementById('add-post');
var addButton = document.getElementById('add');

var addBand = document.getElementById('add-band');
var addBandButton = document.getElementById('add-band-button');

var addVenue = document.getElementById('add-venue');
var addVenueButton = document.getElementById('add-venue-button');

var recentPostsSection = document.getElementById('recent-posts-list');
var bandsSection = document.getElementById('bands-list');
var venuesSection = document.getElementById('venues-list');

var recentMenuButton = document.getElementById('menu-recent');
var bandsMenuButton = document.getElementById('menu-bands');
var venuesMenuButton = document.getElementById('menu-venues');


var listeningFirebaseRefs = [];


/**
 * Saves a new post to the Firebase DB.
 */
// [START write_fan_out]
function writeNewPost(uid, username, picture, title, body, bandid, venueid, time, eventlink, eventimage, price) {
  // A post entry.
  var postData = {
    author: username,
    uid: uid,
    body: body,
    title: title,
    starCount: 0,
    authorPic: picture,
    bandid:bandid, venueid:venueid, time:time, eventlink:eventlink, eventimage:eventimage, price:price
  };

  // Get a key for a new Post.
  var newPostKey = firebase.database().ref().child('posts').push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates['/posts/' + newPostKey] = postData;
  updates['/venues/' + venueid + '/events/' + newPostKey] = postData;
  updates['/bands/' + bandid + '/events/' + newPostKey] = postData;

  return firebase.database().ref().update(updates);
}

function writeNewBand(uid, username, band, image, tags, dancing, youtube, website, facebook, description) {
  // A post entry.
  var postData = {
    author: username,
    uid: uid,
    band: band,
    image: image,
    tags: tags, 
    dancing: dancing, 
    youtube: youtube, 
    website: website, 
    facebook: facebook, 
    description: description
  };

  // Get a key for a new Post.
  var newPostKey = firebase.database().ref().child('bands').push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates['/bands/' + newPostKey + '/info'] = postData;

  return firebase.database().ref().update(updates);
}

function writeNewVenue(uid, username, venue, yelp, image, facebook, address, dancing) {
  // A post entry.
  var postData = {
    author: username,
    uid: uid,
    venue: venue, 
    yelp: yelp, 
    image: image, 
    facebook: facebook, 
    address: address, 
    dancing: dancing
  };

  // Get a key for a new Post.
  var newPostKey = firebase.database().ref().child('venues').push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates['/venues/' + newPostKey + '/info'] = postData;

  return firebase.database().ref().update(updates);
}

function createPostElement(postId, title, text, author, authorId, authorPic, band, venue, eventlink, eventimage, price, time) {
  var uid = firebase.auth().currentUser.uid;

  var html =
      '<div class="post mdl-cell mdl-cell--12-col ' +
                  'mdl-cell--6-col-tablet mdl-cell--4-col-desktop mdl-grid mdl-grid--no-spacing">' +
        '<div class="mdl-card mdl-shadow--2dp">' +
          '<div class="mdl-card__title mdl-color--light-blue-600 mdl-color-text--white">' +
            '<h4 class="mdl-card__title-text"></h4>' +
          '</div>' +
          '<img class ="theImage" src="" style="width:320px;height:200px;">'+
          '<div class="text"></div>' +
          '<div class="band"></div>' +
          '<div class="venue"></div>' +
          '<a class ="eventLink" href="">Link</a>'+

          '</div>' +
        '</div>' +
      '</div>';


  var div = document.createElement('div');
  div.innerHTML = html;
  var postElement = div.firstChild;

  postElement.getElementsByClassName("theImage")[0].src=eventimage;
  postElement.getElementsByClassName('text')[0].innerText = text;
  postElement.getElementsByClassName('band')[0].innerText = price;
  postElement.getElementsByClassName('venue')[0].innerText = time;
  postElement.getElementsByClassName("eventLink")[0].href=eventlink;
  postElement.getElementsByClassName('mdl-card__title-text')[0].innerText = title;

 


  return postElement;
}


function createVenueElement(venue, address, image, facebook, yelp) {
  var uid = firebase.auth().currentUser.uid;

  var html =
      '<div class="post mdl-cell mdl-cell--12-col ' +
                  'mdl-cell--6-col-tablet mdl-cell--4-col-desktop mdl-grid mdl-grid--no-spacing">' +
        '<div class="mdl-card mdl-shadow--2dp">' +
          '<div class="mdl-card__title mdl-color--light-blue-600 mdl-color-text--white">' +
            '<h4 class="mdl-card__title-text"></h4>' +
          '</div>' +
          '<img class ="theImage" src="" style="width:320px;height:200px;">'+
          '<div class="text"></div>' +
          '<a class ="band" href="">Facebook</a>'+
          '<a class ="venue" href="">Yelp</a>'+
          '<div class="eventLink"></div>' +

          '</div>' +
        '</div>' +
      '</div>';


  // Create the DOM element from the HTML.
  var div = document.createElement('div');
  div.innerHTML = html;
  var postElement = div.firstChild;

  postElement.getElementsByClassName("theImage")[0].src=image;
  postElement.getElementsByClassName('text')[0].innerText = address;
  postElement.getElementsByClassName("band")[0].href=facebook;
  postElement.getElementsByClassName("venue")[0].href=yelp;
  postElement.getElementsByClassName('mdl-card__title-text')[0].innerText = venue;

 


  return postElement;
}

function createBandElement(band, description, facebook, image, tags, website, youtube) {
  var uid = firebase.auth().currentUser.uid;

  var html =
      '<div class="post mdl-cell mdl-cell--12-col ' +
                  'mdl-cell--6-col-tablet mdl-cell--4-col-desktop mdl-grid mdl-grid--no-spacing">' +
        '<div class="mdl-card mdl-shadow--2dp">' +
          '<div class="mdl-card__title mdl-color--light-blue-600 mdl-color-text--white">' +
            '<h4 class="mdl-card__title-text"></h4>' +
          '</div>' +
          '<img class ="theImage" src="" style="width:320px;height:200px;">'+
          '<div class="text"></div>' +
          '<a class ="band" href="">Facebook</a>'+
          '<a class ="venue" href="">Website</a>'+
          '<a class ="youtube" href="">Youtube</a>'+
          '<div class="tags"></div>' +
          '<div class="eventLink"></div>' +

          '</div>' +
        '</div>' +
      '</div>';


  // Create the DOM element from the HTML.
  var div = document.createElement('div');
  div.innerHTML = html;
  var postElement = div.firstChild;

  postElement.getElementsByClassName("theImage")[0].src=image;
  postElement.getElementsByClassName('text')[0].innerText = tags;
  postElement.getElementsByClassName("band")[0].href=facebook;
  postElement.getElementsByClassName("venue")[0].href=website;
  postElement.getElementsByClassName("youtube")[0].href=youtube;
  postElement.getElementsByClassName('tags')[0].innerText = description;
  postElement.getElementsByClassName('mdl-card__title-text')[0].innerText = band;

 


  return postElement;
}

function startDatabaseQueries() {
  var myUserId = firebase.auth().currentUser.uid;

  var recentPostsRef = firebase.database().ref('posts').limitToLast(100);
  var recentVenuesRef = firebase.database().ref('venues').limitToLast(100);
  var recentBandsRef = firebase.database().ref('bands').limitToLast(100);

  var fetchPosts = function(postsRef, sectionElement) {
    postsRef.on('child_added', function(data) {
      var author = data.val().author || 'Anonymous';
      var containerElement = sectionElement.getElementsByClassName('posts-container')[0];
      containerElement.insertBefore(
          createPostElement(data.key, data.val().title, data.val().body, author, data.val().uid, data.val().authorPic, data.val().bandid, data.val().venueid, data.val().eventlink, data.val().eventimage, data.val().price, data.val().time),
          containerElement.firstChild);
    });
  };

  var fetchVenues = function(postsRef, sectionElement) {
    // postsRef.on('child_added', function(data) {
    //   var author = data.val().author || 'Anonymous';
    //   var containerElement = sectionElement.getElementsByClassName('venues-container')[0];
    //   containerElement.insertBefore(
    //       createVenueElement(data.val().venue, data.val().address, data.val().image, data.val().facebook, data.val().yelp),
    //       containerElement.firstChild);
    // });
  };

  var fetchBands = function(postsRef, sectionElement) {
    // postsRef.on('child_added', function(data) {
    //   var author = data.val().author || 'Anonymous';
    //   var containerElement = sectionElement.getElementsByClassName('bands-container')[0];
    //   containerElement.insertBefore(
    //       createBandElement(data.val().band, data.val().description, data.val().facebook, data.val().image, data.val().tags, data.val().website, data.val().youtube),
    //       containerElement.firstChild);
    // });
  };

  fetchBands(recentBandsRef, bandsSection)

  fetchVenues(recentVenuesRef, venuesSection)

  fetchPosts(recentPostsRef, recentPostsSection);

  listeningFirebaseRefs.push(recentPostsRef);
}


function writeUserData(userId, name, email, imageUrl) {
  firebase.database().ref('users/' + userId).set({
    username: name,
    email: email,
    profile_picture : imageUrl
  });
}













var currentUID;

function newPostForCurrentUser(title, text, bandid, venueid, time, eventlink, eventimage, price) {
  var userId = firebase.auth().currentUser.uid;
  return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
    var username = snapshot.val().username;
    return writeNewPost(firebase.auth().currentUser.uid, username,
        firebase.auth().currentUser.photoURL,
        title, text, bandid, venueid, time, eventlink, eventimage, price);
  });
}

function newBandForCurrentUser(band, image, tags, dancing, youtube, website, facebook, description) {
  var userId = firebase.auth().currentUser.uid;
  return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
    var username = snapshot.val().username;
    return writeNewBand(firebase.auth().currentUser.uid, username,
        band, image, tags, dancing, youtube, website, facebook, description);
  });
}

function newVenueForCurrentUser(venue, yelp, image, facebook, address, dancing) {
  var userId = firebase.auth().currentUser.uid;
  return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
    var username = snapshot.val().username;
    return writeNewVenue(firebase.auth().currentUser.uid, username,
        venue, yelp, image, facebook, address, dancing);
  });
}









function showSection(sectionElement, buttonElement) {
  recentPostsSection.style.display = 'none';
  venuesSection.style.display = 'none';
  bandsSection.style.display = 'none';
  addPost.style.display = 'none';
  addBand.style.display = 'none';
  addVenue.style.display = 'none'; 
  recentMenuButton.classList.remove('is-active');
  bandsMenuButton.classList.remove('is-active');
  venuesMenuButton.classList.remove('is-active');

  if (sectionElement) {
    sectionElement.style.display = 'block';
  }
  if (buttonElement) {
    buttonElement.classList.add('is-active');
  }
}









function onAuthStateChanged(user) {
  if (user && currentUID === user.uid || !user && currentUID === null) {
    return;
  }
  currentUID = user ? user.uid : null;
  cleanupUi();
  if (user) {
    splashPage.style.display = 'none';
    writeUserData(user.uid, user.displayName, user.email, user.photoURL);
    startDatabaseQueries();
  } else {
    splashPage.style.display = '';
  }
}

function cleanupUi() {
  recentPostsSection.getElementsByClassName('posts-container')[0].innerHTML = '';

  listeningFirebaseRefs.forEach(function(ref) {
    ref.off();
  });
  listeningFirebaseRefs = [];
}








window.addEventListener('load', function() {
  signInButton.addEventListener('click', function() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
  });
  signOutButton.addEventListener('click', function() {
    firebase.auth().signOut();
  });
  firebase.auth().onAuthStateChanged(onAuthStateChanged);




  messageForm.onsubmit = function(e) {
    e.preventDefault();
    var text = messageInput.value;
    var title = titleInput.value;
    var bandID = bandIDInput.value;
    var price = priceInput.value;
    var venueID = venueIDInput.value;
    var time = timeInput.value;
    var eventLink = eventLinkInput.value;
    var eventImage = eventImageInput.value;
    if (text && title) {
      newPostForCurrentUser(title, text, bandID, venueID, time, eventLink, eventImage, price).then(function() {
        recentMenuButton.click();
      });
      messageInput.value = '';
      titleInput.value = '';
    }
  };

  bandForm.onsubmit = function(e) {
    e.preventDefault();
    var text = "test"
    var title = "test"
    var band = bandNameInput.value
    var image = bandImageInput.value
    var tags = bandTagsInput.value
    var dancing = bandDancingInput.value
    var youtube = bandYoutubeInput.value
    var website = bandWebsiteInput.value
    var facebook = bandFacebookInput.value
    var description = bandDescriptionInput.value
    if (text && title) {
      newBandForCurrentUser(band, image, tags, dancing, youtube, website, facebook, description).then(function() {
        recentMenuButton.click();
      });
      messageInput.value = '';
      titleInput.value = '';
    }
  };

  venueForm.onsubmit = function(e) {
    e.preventDefault();
    var text = "test"
    var title = "test"
    var venue = venueNameInput.value
    var yelp = venueYelpInput.value
    var image = venueImageInput.value
    var facebook = venueFacebookInput.value
    var address = venueAddressInput.value
    var dancing = venueDancingInput.value

    if (text && title) {
      newVenueForCurrentUser(venue, yelp, image, facebook, address, dancing).then(function() {
        recentMenuButton.click();
      });
      messageInput.value = '';
      titleInput.value = '';
    }
  };


  recentMenuButton.onclick = function() {
    showSection(recentPostsSection, recentMenuButton);
  };
  bandsMenuButton.onclick = function() {
    showSection(bandsSection, bandsMenuButton);
  };
  venuesMenuButton.onclick = function() {
    showSection(venuesSection, venuesMenuButton);
  };
  addButton.onclick = function() {
    showSection(addPost);
    messageInput.value = '';
    titleInput.value = '';
  };
  addBandButton.onclick = function() {
    showSection(addBand);
    messageInput.value = '';
    titleInput.value = '';
  };
  addVenueButton.onclick = function() {
    showSection(addVenue);
    messageInput.value = '';
    titleInput.value = '';
  };
  recentMenuButton.onclick();
}, false);
