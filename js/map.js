'use strict';

var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var TYPES = ['flat', 'house', 'bungalo'];
var TIMES = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var WHITE_SPADE_HEIGHT = 18;
var BUBBLE_HEIGHT = 44;
var ENTER_KEYCODE = 13;
var ESC_KEYCODE = 27;

var buttonTemplate = document.querySelector('template').content.querySelector('.map__pin');
var article = document.querySelector('template').content.querySelector('article.map__card');
var adsArray = [];

var getRandomArbitrary = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

var generateAd = function (iterator) {
  var locationX = getRandomArbitrary(300, 900);
  var locationY = getRandomArbitrary(100, 500);
  var features = FEATURES.slice();
  features.length = getRandomArbitrary(0, FEATURES.length);
  adsArray.push({
    'author': {
      'avatar': 'img/avatars/user0' + (iterator + 1) + '.png'
    },
    'offer': {
      'title': TITLES[iterator],
      'address': '' + locationX + ', ' + locationY,
      'price': getRandomArbitrary(1000, 1000000),
      'type': TYPES[getRandomArbitrary(0, TYPES.length)],
      'rooms': getRandomArbitrary(1, 5),
      'guests': getRandomArbitrary(1, 30),
      'checkin': TIMES[getRandomArbitrary(0, TYPES.length)],
      'checkout': TIMES[getRandomArbitrary(0, TYPES.length)],
      'features': features,
      'description': '',
      'photos': []
    },
    'location': {
      'x': locationX,
      'y': locationY
    },
    'id': iterator
  });
};

var renderButton = function (elementData) {
  var instanceButton = buttonTemplate.cloneNode(true);
  instanceButton.setAttribute('style', 'left: ' + elementData.location.x + 'px; top: ' + (elementData.location.y - BUBBLE_HEIGHT / 2 - WHITE_SPADE_HEIGHT) + 'px;');
  instanceButton.querySelector('img').src = elementData.author.avatar;
  instanceButton.dataset.id = elementData.id;
  instanceButton.addEventListener('click', function (evt) {
    secondaryPinClickHandler(evt);
  });
  return instanceButton;
};

var removeChilds = function (element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
};

var renderAd = function (adData) {
  var instanceOfAd = article.cloneNode(true);
  var featuresElement = instanceOfAd.querySelector('.popup__features');
  var fragment = document.createDocumentFragment();
  var houseTypeHeader = instanceOfAd.querySelector('h4');

  instanceOfAd.querySelector('h3').textContent = adData.offer.title;
  instanceOfAd.querySelector('small').textContent = adData.offer.address;
  instanceOfAd.querySelectorAll('p')[1].innerHTML = adData.offer.price + '&#x20bd;/ночь';
  switch (adData.offer.type) {
    case 'flat': houseTypeHeader.textContent = 'Квартира';
      break;
    case 'house': houseTypeHeader.textContent = 'Дом';
      break;
    case 'bungalo': houseTypeHeader.textContent = 'Бунгало';
      break;
    default: houseTypeHeader.textContent = 'Не указано';
      break;
  }
  instanceOfAd.querySelectorAll('p')[2].innerHTML = adData.offer.rooms + ' для ' + adData.offer.guests + ' гостей';
  instanceOfAd.querySelectorAll('p')[3].textContent = 'Заезд после: ' + adData.offer.checkin + ', выезд до ' + adData.offer.checkout;
  removeChilds(featuresElement);
  for (var i = 0; i < adData.offer.features.length; i++) {
    var newLi = document.createElement('li');
    newLi.classList = 'feature feature--' + adData.offer.features[i];
    fragment.appendChild(newLi);
  }
  featuresElement.appendChild(fragment);
  instanceOfAd.querySelector('.popup__avatar').src = adData.author.avatar;
  return instanceOfAd;
};

var removeActivePin = function () {
  var activePin = document.querySelector('.map__pin--active');
  if (activePin) {
    activePin.classList.remove('map__pin--active');
  }
};

var removePopup = function () {
  var popup = document.querySelector('.popup');
  popup.remove();
};

var init = function () {
  mapBlock.classList.add('map--faded');
  noticeForm.classList.add('notice__form--disabled');
  for (var i = 0; i < noticeFormFieldsets.length; i++) {
    noticeFormFieldsets[i].disabled = true;
  }
};

var mainPinMouseoverHandler = function () {
  mapBlock.classList.remove('map--faded');
  pinsMap.appendChild(fragment);
  noticeForm.classList.remove('notice__form--disabled');
  for (var i = 0; i < noticeFormFieldsets.length; i++) {
    noticeFormFieldsets[i].disabled = false;
  }
};

var secondaryPinClickHandler = function (evt) {
  var currentPin = evt.currentTarget;
  var pinId = parseInt(currentPin.dataset.id, 10);
  var popupClose = '';
  removeActivePin();
  currentPin.classList.add('map__pin--active');
  fragment = renderAd(adsArray[pinId]);
  mapBlock.insertBefore(fragment, insertBeforeBlock);
  popupClose = mapBlock.querySelector('.popup__close');
  popupClose.tabIndex = 0;
  popupClose.addEventListener('click', popupCloseClickHandler);
  popupClose.addEventListener('keydown', popupCloseKeydownHandler);
  document.addEventListener('keydown', documentKeydownHandler);
};

var popupCloseClickHandler = function () {
  removePopup();
  removeActivePin();
};

var popupCloseKeydownHandler = function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    removePopup();
    removeActivePin();
  }
};

var documentKeydownHandler = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    removePopup();
    removeActivePin();
  }
};

var fragment = document.createDocumentFragment();
for (var i = 0; i < 8; i++) {
  generateAd(i);
  fragment.appendChild(renderButton(adsArray[i]));
}

var mapBlock = document.querySelector('.map');
var pinsMap = mapBlock.querySelector('.map__pins');
var mainPin = mapBlock.querySelector('.map__pin--main');
var noticeForm = document.querySelector('.notice__form');
var noticeFormFieldsets = noticeForm.querySelectorAll('fieldset');
var insertBeforeBlock = document.querySelector('.map__filter-container');
window.onload = init;
mainPin.addEventListener('mouseover', mainPinMouseoverHandler);
