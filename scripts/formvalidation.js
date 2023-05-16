// Get form elementmodal__form_input_field_error_visibles for validation
const formElementSelector = ".modal__form-content";
const inputElementSelector = ".modal__text-input";
const submitButtonSelector = ".modal__button";
const inactiveButtonSelector = "modal__button_disabled";
const inputErrorSelector = "js-form-input-field-error-visible";
const errorSelector = "js-form-input-field-error-hide";

// Validate error message is displayed for input fields
const showInputError = (formElement, inputElement) => {
  const errorMessage = inputElement.validationMessage;
  inputElement.classList.add("form_input_error_visible");
  const errorElement = formElement.querySelector(
    `#${inputElement.id}+.js-form-input-field-error`
  );
  errorElement.textContent = errorMessage;
  errorElement.classList.add(inputErrorSelector);
};

const hideInputError = (formElement, inputElement) => {
  inputElement.classList.remove("form_input_error_visible");
  const errorElement = formElement.querySelector(
    `#${inputElement.id}+.js-form-input-field-error`
  );
  if (errorElement) {
    errorElement.classList.remove(errorSelector);
    errorElement.classList.remove(inputElementSelector);
    errorElement.textContent = "";
  }
};

const isInputValid = (formElement, inputElement) => {
  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement);
  } else {
    hideInputError(formElement, inputElement);
  }
};

// The function takes an array of input fields and the button element,
// whose state need to be changed

const toggleButtonState = (inputList, buttonElement) => {
  // If there is at least one invalid input
  if (hasInvalidInput(inputList)) {
    // make the button inactive
    buttonElement.classList.add("modal__button_disabled");
  } else {
    buttonElement.classList.remove("modal__button_disabled");
  }
};

// The function takes an array of form input fields
const hasInvalidInput = (inputList) => {
  // iterate over the array using the some() method
  return inputList.some((inputElement) => {
    // If the field is invalid, the callback will return true.
    // The method will then stop, and hasInvalidInput() function will return true
    return !inputElement.validity.valid;
  });
};

const setEventListeners = (formElement) => {
  // Find all the form fields and make an array of them
  const inputList = Array.from(
    formElement.querySelectorAll(inputElementSelector)
  );
  // Find the submit button in the current form
  const buttonElement = formElement.querySelector(submitButtonSelector);
  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
      isInputValid(formElement, inputElement);
      // Call the toggleButtonState() and pass an array of fields and the button element
      toggleButtonState(inputList, buttonElement);
    });
  });
};

const enableValidation = () => {
  // Find all forms and store in array
  const formList = Array.from(document.querySelectorAll(formElementSelector));
  // Iterate over array
  formList.forEach((formElement) => {
    formElement.addEventListener("submit", (evt) => {
      // Cancel default behavior for each form
      evt.preventDefault();
    });
    // Call the setEventListeners() function for each form
    setEventListeners(formElement);
  });
};

enableValidation();