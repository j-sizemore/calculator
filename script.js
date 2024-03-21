const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;

const operate = (operator, a, b) => {
    let result;
    switch (operator) {
        case "+":
            result = add(a, b);
            break;
        case "-":
            result = subtract(a, b);
            break;
        case "*":
            result = multiply(a, b);
            break;
        case "/":
            result = divide(a, b);
    }

    return isFinite(result) ? result.toString(10) : "ERR"
};

const display = document.querySelector('#display');
const buttons = document.querySelectorAll('.button');
buttons.forEach(button => {
    button.addEventListener('click', () => {
        let currentDisplay = display.textContent;
        let newDisplay;
        let entry = button.textContent;

        if (entry === "CE") {
            newDisplay = ""
        } else if (entry === "←") { 
            newDisplay = currentDisplay.slice(0, currentDisplay.length - 1);
        } else if (entry.search(/[\d.]/) > -1) { // number or decimal
            newDisplay = currentDisplay + entry;
        } else if (entry.search(/[+\-*/]/) > -1) { // operator
            newDisplay = currentDisplay + " " + entry + " ";
        } else if (entry === "=") {
            let expression = currentDisplay.split(" ");
            newDisplay = operate(expression[1], +expression[0], +expression[2]);
        } else {
            console.error("Unexpected button value: " + entry);
            newDisplay = "ERR";
        }

        display.textContent = newDisplay;

    });
});