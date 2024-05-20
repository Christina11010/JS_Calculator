// use a class to encapsulate and organize the functionality related to the calculator's operations
class Calculator {
  constructor(prevOperandTextElem, currOperandTextElem) {
    this.prevOperandTextElem = prevOperandTextElem;
    this.currOperandTextElem = currOperandTextElem;
    this.clear();
  }

  clear() {
    this.currOperand = "";
    this.prevOperand = "";
    this.operation = undefined;
  }

  delete() {
    this.currOperand = this.currOperand.toString().slice(0, -1);
  }

  appendNumber(number) {
    if (number === "." && this.currOperand.includes(".")) return; // only allowing one dot in the display
    this.currOperand = this.currOperand.toString() + number.toString(); // this add new numbers to the end of the number string, forming multiple digits numbers
  }

  chooseOperation(operation) {
    if (this.currOperand === "") return; // cannot choose operation if current display is empty
    if (this.prevOperand !== "") {
      this.compute();
    }
    this.operation = operation;
    this.prevOperand = this.currOperand;
    this.currOperand = ""; // clear current display
  }

  // reverse the positivity/negativity of the number
  reverse() {
    if (this.currOperand === "") return;
    this.currOperand = (parseFloat(this.currOperand) * -1).toString();
  }

  // turn the number into percentage value
  percentage() {
    if (this.currOperand === "") return;
    this.currOperand = (parseFloat(this.currOperand) / 100).toString();
  }

  compute() {
    let result;
    const prev = parseFloat(this.prevOperand);
    const curr = parseFloat(this.currOperand);
    if (isNaN(prev) || isNaN(curr)) return; // if either prev or curr is empty, then cancel the compute() function
    switch (this.operation) {
      case "+":
        result = prev + curr;
        break;
      case "-":
        result = prev - curr;
        break;
      case "×":
        result = prev * curr;
        break;
      case "÷":
        result = prev / curr;
        break;
      default:
        return;
    }
    this.currOperand = result;
    this.operation = undefined;
    this.prevOperand = "";
  }

  // display the numbers with easy-to-read format
  getDisplayNumber(number) {
    const stringNumber = number.toString();
    const intDigits = parseFloat(stringNumber.split(".")[0]);
    const decDigits = stringNumber.split(".")[1];
    let intDisplay;

    // checks the integer parts of the number
    if (isNaN(intDigits)) {
      // if the integer digits is not a number (if the user enters nothing or enters just a decimal place)
      intDisplay = "";
    } else {
      intDisplay = intDigits.toLocaleString("en", { maximumFractionDigits: 0 });
      // toLocaleString('en') formats a long number with commas in between
    }

    // checks the decimal parts of the number
    if (decDigits != null) {
      // if the user has input a number with decimal
      return `${intDisplay}.${decDigits}`;
    } else {
      return intDisplay;
    }
  }

  updateDisplay() {
    this.currOperandTextElem.innerText = this.getDisplayNumber(
      this.currOperand
    );
    if (this.operation != null) {
      this.prevOperandTextElem.innerText = `${this.getDisplayNumber(
        this.prevOperand
      )} ${this.operation}`;
    } else {
      this.prevOperandTextElem.innerText = "";
    }
  }
}

// these variables each selects its corresponding items from html
const numberBtn = document.querySelectorAll("[data-number]");
const operationBtn = document.querySelectorAll("[data-operation]");
const clearBtn = document.querySelector("[data-clear]");
const deleteBtn = document.querySelector("[data-delete]");
const equalBtn = document.querySelector("[data-equal]");
const reverseBtn = document.querySelector("[data-reverse]");
const percentageBtn = document.querySelector("[data-percentage]");
const prevOperandTextElem = document.querySelector("[data-previous-operand]");
const currOperandTextElem = document.querySelector("[data-current-operand]");

const calculator = new Calculator(prevOperandTextElem, currOperandTextElem);

// for each number (inc. dot) button we want to have some actions when clicked
numberBtn.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.appendNumber(button.innerText);
    calculator.updateDisplay();
  });
});

// for each operation button (+,-,x,/,%,+/-,) we want to have some actions when clicked
operationBtn.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.chooseOperation(button.innerText);
    calculator.updateDisplay();
  });
});

equalBtn.addEventListener("click", (button) => {
  calculator.compute();
  calculator.updateDisplay();
});

clearBtn.addEventListener("click", (button) => {
  calculator.clear();
  calculator.updateDisplay();
});

deleteBtn.addEventListener("click", (button) => {
  calculator.delete();
  calculator.updateDisplay();
});

reverseBtn.addEventListener("click", (button) => {
  calculator.reverse();
  calculator.updateDisplay();
});

percentageBtn.addEventListener("click", (button) => {
  calculator.percentage();
  calculator.updateDisplay();
});

// Handle keyboard input
document.addEventListener("keydown", (event) => {
  if ((event.key >= "0" && event.key <= "9") || event.key === ".") {
    // Handle number and decimal key press
    calculator.appendNumber(event.key);
    calculator.updateDisplay();
  } else if (
    event.key === "+" ||
    event.key === "-" ||
    event.key === "*" ||
    event.key === "/"
  ) {
    // Handle operation key press
    let operation;
    switch (event.key) {
      case "+":
        operation = "+";
        break;
      case "-":
        operation = "-";
        break;
      case "*":
        operation = "×";
        break;
      case "/":
        operation = "÷";
        break;
    }
    calculator.chooseOperation(operation);
    calculator.updateDisplay();
  } else if (event.key === "Enter" || event.key === "=") {
    // Handle Enter key press for equals
    calculator.compute();
    calculator.updateDisplay();
  } else if (event.key === "Backspace") {
    // Handle Backspace key press for delete
    calculator.delete();
    calculator.updateDisplay();
  } else if (event.key === "Escape") {
    // Handle Escape key press for clear
    calculator.clear();
    calculator.updateDisplay();
  } else if (event.key === "%") {
    // Handle percentage key press
    calculator.percentage();
    calculator.updateDisplay();
  } else if (event.key === "r" || event.key === "R") {
    // Handle 'r' or 'R' key press for reverse
    calculator.reverse();
    calculator.updateDisplay();
  }
});
