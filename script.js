const display = document.querySelector("#display");
const buttons = document.querySelector(".buttons");

let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;
let justCalculated = false;
let errorDisplayed = false;

function add(firstNumber, secondNumber) {
  return firstNumber + secondNumber;
}

function subtract(firstNumber, secondNumber) {
  return firstNumber - secondNumber;
}

function multiply(firstNumber, secondNumber) {
  return firstNumber * secondNumber;
}

function divide(firstNumber, secondNumber) {
  if (secondNumber === 0) {
    return "Nice try! You can't divide by zero.";
  }

  return firstNumber / secondNumber;
}

function operate(operator, firstNumber, secondNumber) {
  if (operator === "+") {
    return add(firstNumber, secondNumber);
  }

  if (operator === "-") {
    return subtract(firstNumber, secondNumber);
  }

  if (operator === "*") {
    return multiply(firstNumber, secondNumber);
  }

  if (operator === "/") {
    return divide(firstNumber, secondNumber);
  }

  return null;
}

function showResult(result) {
  if (typeof result === "string") {
    display.textContent = result;
    errorDisplayed = true;
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = true;
    justCalculated = false;
    return false;
  }

  const roundedResult = Number(result.toFixed(8));
  display.textContent = String(roundedResult);
  errorDisplayed = false;
  return true;
}

function inputDigit(digit) {
  if (errorDisplayed || waitingForSecondOperand || justCalculated) {
    display.textContent = digit;
    waitingForSecondOperand = false;
    justCalculated = false;
    errorDisplayed = false;
    return;
  }

  if (display.textContent === "0") {
    display.textContent = digit;
  } else {
    display.textContent = display.textContent + digit;
  }
}

function inputDecimal() {
  if (errorDisplayed || waitingForSecondOperand || justCalculated) {
    display.textContent = "0.";
    waitingForSecondOperand = false;
    justCalculated = false;
    errorDisplayed = false;
    return;
  }

  if (!display.textContent.includes(".")) {
    display.textContent = display.textContent + ".";
  }
}

function chooseOperator(nextOperator) {
  if (errorDisplayed) {
    return;
  }

  const currentValue = Number(display.textContent);

  if (operator !== null && !waitingForSecondOperand) {
    const result = operate(operator, firstOperand, currentValue);

    if (!showResult(result)) {
      return;
    }

    firstOperand = Number(display.textContent);
  } else {
    firstOperand = currentValue;
  }

  operator = nextOperator;
  waitingForSecondOperand = true;
  justCalculated = false;
}

function calculate() {
  if (
    errorDisplayed ||
    operator === null ||
    firstOperand === null ||
    waitingForSecondOperand
  ) {
    return;
  }

  const secondOperand = Number(display.textContent);
  const result = operate(operator, firstOperand, secondOperand);

  if (!showResult(result)) {
    return;
  }

  firstOperand = Number(display.textContent);
  operator = null;
  waitingForSecondOperand = true;
  justCalculated = true;
}

function clearCalculator() {
  display.textContent = "0";
  firstOperand = null;
  operator = null;
  waitingForSecondOperand = false;
  justCalculated = false;
  errorDisplayed = false;
}

function backspace() {
  if (errorDisplayed) {
    clearCalculator();
    return;
  }

  if (waitingForSecondOperand) {
    display.textContent = "0";
    waitingForSecondOperand = false;
    justCalculated = false;
    return;
  }

  if (display.textContent.length <= 1) {
    display.textContent = "0";
  } else {
    display.textContent = display.textContent.slice(0, -1);
  }

  justCalculated = false;
}

function handleButtonClick(event) {
  const digitButton = event.target.closest("[data-digit]");
  const operatorButton = event.target.closest("[data-operator]");
  const actionButton = event.target.closest("[data-action]");

  if (digitButton) {
    inputDigit(digitButton.dataset.digit);
    return;
  }

  if (operatorButton) {
    chooseOperator(operatorButton.dataset.operator);
    return;
  }

  if (!actionButton) {
    return;
  }

  const action = actionButton.dataset.action;

  if (action === "clear") {
    clearCalculator();
  } else if (action === "backspace") {
    backspace();
  } else if (action === "decimal") {
    inputDecimal();
  } else if (action === "equals") {
    calculate();
  }
}

function handleKeyboardInput(event) {
  if (/^[0-9]$/.test(event.key)) {
    inputDigit(event.key);
  } else if (event.key === ".") {
    inputDecimal();
  } else if (["+", "-", "*", "/"].includes(event.key)) {
    chooseOperator(event.key);
  } else if (event.key === "Enter" || event.key === "=") {
    event.preventDefault();
    calculate();
  } else if (event.key === "Backspace") {
    backspace();
  } else if (event.key === "Escape" || event.key === "Delete") {
    clearCalculator();
  }
}

buttons.addEventListener("click", handleButtonClick);
document.addEventListener("keydown", handleKeyboardInput);
