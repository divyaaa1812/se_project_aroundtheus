import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";
import Section from "../components/Section.js";
import PopupWithForm from "../components/PopupWithForm.js";
import UserInfo from "../components/UserInfo.js";
import PopupWithImage from "../components/PopupWithImage.js";
import Api from "../components/Api.js";
import "../pages/index.css";

export const settings = {
  inputElementSelector: ".modal__text-input",
  submitButtonSelector: ".modal__button",
  inactiveButtonSelector: "modal__button_disabled",
  inputErrorSelector: "modal__input-error_visible",
  errorSelectorHide: "modal__input-error-hide",
  errorSelector: "modal__input-error",
};

const editProfileModalFormElement = document.querySelector("#edit-profile");
const addNewCardModalFormElement = document.querySelector("#add-new-card");
const editAvatarModalFormElement = document.querySelector("#avatar-edit-modal");
const submitButton = document.querySelector(settings.submitButtonSelector);
const createButton = document.querySelector("#create-button");

/*Declare Elements */
const editProfileButton = document.querySelector(".js-profile-edit-button");
const addNewCardButton = document.querySelector(".profile__add-button");
const cardsList = document.querySelector(".cards__list");
//Extract title and subtitle elements
const profileTitle = document.querySelector(".profile__title");
const profileSubtitle = document.querySelector(".profile__subtitle");
const profileAvatar = document.querySelector(".profile__image");
//Extract input fields from edit profile modal
const profileTitleInputField = document.querySelector("#profile-title-input");
const profileSubtitleInputField = document.querySelector(
  "#profile-subtitle-input"
);
const avatarEditButton = document.querySelector(".profile__avatar-edit-button");
const avatarSaveButton = document.querySelector("#avatar-save-button");
const deleteCardYesButton = document.querySelector("#delete-confirm-button");

const newCardPopup = new PopupWithForm(
  "#add-new-card",
  handleAddNewCardFormSubmit,
  ".profile__add-button"
);
const addProfilePopup = new PopupWithForm(
  "#edit-profile",
  handleProfileFormSubmit
);

const avatarEditPopup = new PopupWithForm(
  "#avatar-edit-modal",
  handleAvatarSaveButton
);

const userInfo = new UserInfo({
  name: profileTitle,
  subtitle: profileSubtitle,
  link: profileAvatar,
});

const cardImagePopup = new PopupWithImage(
  "#preview-image-modal",
  ".modal-preview-image"
);

//instantiate FormValidator class
const addNewCardFormValidator = new FormValidator(
  settings,
  addNewCardModalFormElement
);
const editProfileFormValidator = new FormValidator(
  settings,
  editProfileModalFormElement
);
const editAvatarFormValidator = new FormValidator(
  settings,
  editAvatarModalFormElement
);
const api = new Api({
  baseUrl: "https://around.nomoreparties.co/v1/cohort-3-en",
  headers: {
    authorization: "b685d3e0-616a-4dae-bc5b-53892a4f7953",
    "Content-Type": "application/json",
  },
});
function createCard(item) {
  // create instance of Card class
  const card = new Card(
    item,
    "#card-template",
    onCardClick,
    handleCardDeleteFunctionInIndexComponent
  );
  //create a card by calling getCardElement method from Card class
  const cardElement = card.getCardElement();
  //return the card
  return cardElement;
}

api
  .getUserInfo()
  .then((data) => {
    const name = data.name;
    const subtitle = data.about;
    const url = data.avatar;
    userInfo.setUserInfo({ name, subtitle });
    userInfo.setNewAvatar(url);
  })
  .then((err) => {
    console.log(err);
  });

api
  .getInitialCards()
  .then((data) => {
    // process the result
    data.forEach((item) => {
      const cardItem = createCard(item);
      section.appendItem(cardItem);
    });
  })
  .catch((err) => {
    console.log(err); // log the error to the console
  });

const section = new Section(
  { items: api.getInitialCards, renderer: createCard },
  cardsList
);

function handleOpenEditProfileForm() {
  editProfileFormValidator.disableButton();
  const values = userInfo.getUserInfo();
  addProfilePopup.setInputValues(values);
  addProfilePopup.openModal();
}

function handleAddNewCardButton() {
  addNewCardFormValidator.disableButton();
  newCardPopup.openModal();
}

function handleProfileFormSubmit(inputValues) {
  submitButton.textContent = "Saving...";
  api
    .editUserInfo(inputValues)
    .then((data) => {
      // process the result
      const name = data.name;
      const subtitle = data.about;
      userInfo.setUserInfo(inputValues);
      addProfilePopup.closeModal();
      return { name, subtitle };
    })
    .then((err) => {
      console.log(err);
    })
    .finally(() => {
      submitButton.textContent = "Save";
    });
}

function handleCardDeleteFunctionInIndexComponent(cardId) {
  api.deleteCard(cardId).then(() => {
    this.deleteCardPopup.closeModal();
    this._cardElement.remove();
  });
}

function handleAddNewCardFormSubmit(inputValues) {
  //set button to Saving.. while api call is made
  createButton.textContent = "Saving...";
  //create a new card with input values from server
  api
    .addNewCard(inputValues)
    .then((data) => {
      const card = createCard(data);
      //Attach new card to begining of container
      section.prependItem(card);
      //close popup after submit
      newCardPopup.closeModal();
    })
    .then((err) => {
      console.log(err);
    })
    .finally(() => {
      createButton.textContent = "Create";
    });
}

function onCardClick(card) {
  cardImagePopup.openModal(card);
}

function handleAvatarEditButton() {
  avatarEditPopup.openModal();
  editAvatarFormValidator.disableButton();
}

function handleAvatarSaveButton(inputValues) {
  avatarSaveButton.textContent = "Saving...";
  api
    .editAvatarLink(inputValues)
    .then((data) => {
      userInfo.setNewAvatar(data.avatar);
    })
    .then((err) => {
      console.log(err);
    })
    .finally(() => {
      avatarSaveButton.textContent = "Save";
    });
  avatarEditPopup.closeModal();
}

/* Event Listeners */
editProfileButton.addEventListener("click", handleOpenEditProfileForm);
addNewCardButton.addEventListener("click", handleAddNewCardButton);
avatarEditButton.addEventListener("click", handleAvatarEditButton);

//start form validations
editProfileFormValidator.enableValidation();
addNewCardFormValidator.enableValidation();
editAvatarFormValidator.enableValidation();
