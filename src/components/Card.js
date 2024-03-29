export default class Card {
  constructor(
    cardData,
    cardSelector,
    handleCardClick,
    handleDeleteCardBinButton,
    onLikeButtonToggle,
    currentUser
  ) {
    this._cardData = cardData;
    this._id = cardData._id;
    this._name = cardData.name;
    this._link = cardData.link;
    this._owner = cardData.owner._id;
    this._cardId = cardData._id;
    this._likes = cardData.likes;
    this._cardSelector = cardSelector;
    this._handleCardClick = handleCardClick;
    this._handleDeleteCardBinButton = handleDeleteCardBinButton;
    this._onLikeButtonToggle = onLikeButtonToggle;
    this._currentUser = currentUser;
  }

  _onCardUnlike = (data) => {
    this._likes = data.likes;
    this._favIconElement.classList.remove("card__fav-icon-selected");
    this._favCountElement.textContent = this._likes.length;
  };

  _onCardLike = (data) => {
    this._likes = data.likes;
    this._favIconElement.classList.toggle("card__fav-icon-selected");
    this._favCountElement.textContent = this._likes.length;
  };

  _handleFavIconClick = () => {
    //variable to register if current user liked the image or not
    const currentUserLike = this._likes.find((user) => {
      return user._id === this._currentUser._userData._id;
    });
    let didCurrentUserLikeThisCard = currentUserLike ? true : false;
    if (didCurrentUserLikeThisCard) {
      this._onLikeButtonToggle(this._cardId, "Unlike", this._onCardUnlike);
    } else {
      this._onLikeButtonToggle(this._cardId, "like", this._onCardLike);
    }
  };

  _onCardClick = () => {
    this._handleCardClick(this._cardData);
  };

  getCardElement() {
    this._cardTemplate = document.querySelector(this._cardSelector);
    this._cardElement = this._cardTemplate.content
      .querySelector(".card")
      .cloneNode(true);
    this._deleteCardIcon = this._cardElement.querySelector(".card__del-button");
    if (this._owner === this._currentUser._userData._id) {
      this._deleteCardIcon.classList.remove("card__del-button-hidden");
    } else {
      this._deleteCardIcon.classList.add("card__del-button-hidden");
    }
    this._favIconElement = this._cardElement.querySelector(".card__fav-icon");
    const userLikes = this._likes.find((user) => {
      return user._id === this._currentUser._userData._id;
    });
    if (userLikes) {
      this._favIconElement.classList.add("card__fav-icon-selected");
    } else {
      this._favIconElement.classList.add("card__fav-icon");
    }
    this._favCountElement = this._cardElement.querySelector(".card__fav_count");
    this._favCountElement.textContent = this._likes.length;
    this._addNewCardTitle = this._cardElement.querySelector(".card__title");
    this._cardImage = this._cardElement.querySelector(".card__image");
    this._addNewCardTitle.textContent = this._name;
    this._cardImage.setAttribute("src", `${this._link}`);
    this._cardImage.setAttribute("alt", `Image of ${this._name}`);
    //call eventlistener
    this._setEventListeners();
    //return the card element that is created
    return this._cardElement;
  }

  _setEventListeners() {
    this._favIconElement.addEventListener("click", this._handleFavIconClick);
    this._cardImage.addEventListener("click", this._onCardClick);
    this._deleteCardIcon.addEventListener("click", () => {
      this._handleDeleteCardBinButton(this._cardId, this._cardElement);
    });
  }
}
