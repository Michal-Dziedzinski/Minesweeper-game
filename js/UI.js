export class UI {
  UiSelectors = {
    timer: '[data-timer]',
    counter: '[data-counter]',
    board: '[data-board]',
    cell: '[data-cell]',
    resetButton: '[data-button-reset]',
    easyButton: '[data-button-easy]',
    normalButton: '[data-button-normal]',
    expertButton: '[data-button-expert]',
    modal: '[data-modal]',
    modalHeader: '[data-modal-header]',
    modalButton: '[data-modal-button]',
  };

  getElement(selector) {
    return document.querySelector(selector);
  }
  getElements(selector) {
    return document.querySelectorAll(selector);
  }
}
