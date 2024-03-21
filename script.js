const MAX_DIGITS = 14;

const add = (a, b) => Math.round((a + b) * 1e+10) * 1e-10;
const subtract = (a, b) => Math.round((a - b) * 1e+10) * 1e-10;
const multiply = (a, b) => Math.round((a * b) * 1e+10) * 1e-10;
const divide = (a, b) => Math.round((a / b) * 1e+10) * 1e-10;

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

const calculatorEntry = (entry) => {
    let currentDisplay = display.textContent;
    let expression = currentDisplay.split(" ");
    let numOperands = 0;
    let numOperators = 0;
    if (expression[0].length > 0 && expression[0] != "ERR") numOperands++;
    if (expression.length === 3 && expression[2].length >= 0) 
        numOperators++;
    if (expression.length === 3 && expression[2].length > 0) numOperands++;

    let newDisplay;

    if (entry === "CE" || entry === "Delete") {

        newDisplay = "";

    } else if (entry === "←" || entry === "Backspace") { 

        if (numOperands === 0) {
            newDisplay = "";
        } else if (numOperators === 1 && numOperands === 1) {
            // delete the operator
            newDisplay = expression[0];
        } else {
            // delete the last digit/decimal
            newDisplay = currentDisplay.slice(0, currentDisplay.length - 1);
        }

    } else if (entry === ".") { 

        if (
            numOperands === 0
            || (numOperands === 1 && numOperators === 1) 
        ){
            newDisplay = currentDisplay + "0.";
        } else if (
            (numOperands === 1 
                && expression[0].indexOf(".") === -1
                && expression[0].length < MAX_DIGITS
            ) || (numOperands === 2 
                && expression[2].indexOf(".") === -1
                && expression[2].length < MAX_DIGITS
            )
        ){
            newDisplay = currentDisplay + ".";
        } else {
            newDisplay = currentDisplay;
        }

    } else if (entry.search(/[\d]/) > -1) { // digit

        if (numOperands === 0 || currentDisplay === "0") {
            newDisplay = entry;
        } else if (
            (numOperands === 1 && expression[0].length < MAX_DIGITS)
            || (numOperands === 1 && numOperators === 1)
            || (numOperands === 2 && expression[2].length < MAX_DIGITS)
        ){
            newDisplay = currentDisplay + entry;
        } else {
            newDisplay = currentDisplay;
        }

    } else if (entry.search(/[+\-*/]/) > -1) { // operator

        if (numOperands === 0) {
            newDisplay = "0 " + entry + " ";
        } else if (numOperators === 0) {
            newDisplay = currentDisplay + " " + entry + " ";
        } else if (numOperands === 2 && numOperators === 1) {
            // check for overflow in resultant evaluation
            let result = operate(
                expression[1], 
                +expression[0], 
                +expression[2]
            );
            if (result.length > MAX_DIGITS) {
                result = (+result).toExponential();
                if (result.length > MAX_DIGITS) 
                result = (+result).toExponential(MAX_DIGITS - 4);
            }
            newDisplay = result + " " + entry + " ";
        } else {
            newDisplay = currentDisplay;
        }

    } else if (entry === "=" || entry === "Enter") {

        if (numOperands === 0) {
            newDisplay = "0";
        } else if (numOperands === 1) {
            newDisplay = expression[0];
        } else {
            // check for overflow in resultant evaluation
            newDisplay = operate(
                expression[1], 
                +expression[0], 
                +expression[2]
            );
            if (newDisplay.length > MAX_DIGITS) {
                newDisplay = (+newDisplay).toExponential();
                if (newDisplay.length > MAX_DIGITS) 
                newDisplay = (+newDisplay).toExponential(MAX_DIGITS - 4);
            }
        }

    } else {

        console.error("Unexpected button value: " + entry);
        newDisplay = currentDisplay;

    }    

    display.textContent = newDisplay;
};

const display = document.querySelector('#display');
const buttons = document.querySelectorAll('.button');
buttons.forEach(button => {
    button.addEventListener('click', () => {
        calculatorEntry(button.textContent);
    });
});
document.addEventListener('keydown', (event) => {
	calculatorEntry(event.key);
});