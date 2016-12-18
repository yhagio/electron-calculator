(function() {
  'use strict';

  var stringEquation = '';
  var newInput = '';
  var buttons = document.getElementsByTagName('button');

  // Update the display
  function updateDisplay(total) {
    document.getElementById('result').value = total;
  }

  // Accumulate equation
  function accumulateInputs(input) {
    var patterns = /^[0-9.]*$/;
    if (patterns.test(input) === true) {
      stringEquation += input;
    } else {
      stringEquation += ' ' + input + ' ';
    }
    return stringEquation;
  }

  // Reset all
  function reset() {
    document.getElementById('result').value = '';
    stringEquation = '';
    newInput = '';
    return;
  }

  /*
    Flow of calculation: calculateAll()

    Get all parenthesis positions.
    Find the largest '(' position and
    the paired ')' position that is larger than
    the largest '(' position.
    Calculate inside those 2 positions.
    Replace the calculated result with the parenthesis + inside.

    Do these steps again until no more parenthesis is found.
  */

  // Check if the input is a number
  function checkIfNum(item) {
    return !isNaN(parseFloat(item, 10));
  }

  // Calculate strings equation without parenthesis
  // As soon as a single calculation, replace the calculated part
  // with the result. 
  // For example, ['3','+','8','/','4'] => ['3','+','2'] => ['5']
  function calculate(arr) {
    // 1. Calculate multiplication & division first
    for(var i = 0; arr.length > i; i++) {
      if(checkIfNum(arr[i]) && arr.length > i+2) {
        if(arr[i+1] === '/' && checkIfNum(arr[i+2])) {
          var calculated = (parseFloat(arr[i], 10) / parseFloat(arr[i+2], 10));
          arr.splice(i, 3);
          arr.splice(i, 0, calculated.toString());
        }
        if(arr[i+1] === '*' && checkIfNum(arr[i+2])) {
          var calculated = (parseFloat(arr[i], 10) * parseFloat(arr[i+2], 10));
          arr.splice(i, 3);
          arr.splice(i, 0, calculated.toString());
        }
      }
    }

    // 2. Calculate addition & subtraction second
    for(var k = 0; arr.length > k; k++) {
      if(checkIfNum(arr[k]) && arr.length > k+2) {
        if(arr[k+1] === '+' && checkIfNum(arr[k+2])) {
          var calculated = (parseFloat(arr[k], 10) + parseFloat(arr[k+2], 10));
          arr.splice(k, 3);
          arr.splice(k, 0, calculated.toString());
        }
        if(arr[k+1] === '-' && checkIfNum(arr[k+2])) {
          var calculated = (parseFloat(arr[k], 10) - parseFloat(arr[k+2], 10));
          arr.splice(k, 3);
          arr.splice(k, 0, calculated.toString());
        }
      }
    }
    // Return the calculated result, should be an array with 1 item in it
    return arr[0];
  }

  // Evaluate and calculate the total
  function calculateAll(stringEquation) {
    var largestOpenParenPosition = -1;
    var pairedCloseParenPosition = -1;

    // Make sure to convert the stringEquation is in Array form
    var charArrays = Array.isArray(stringEquation)
      ? stringEquation
      : stringEquation
          .split(' ')
          .filter(function(a) {
            return a != '';
          });

    // Check if there is parenthesis
    for (var pos = 0; charArrays.length > pos; pos++) {
      // Find the deepest '('
      if (charArrays[pos] === '(') {
        largestOpenParenPosition = pos;
      }
      // Find the paired ')' with the deepest '('
      if (charArrays[pos] === ')' &&
          pos > largestOpenParenPosition &&
          pairedCloseParenPosition === -1) {
            pairedCloseParenPosition = pos;
            break;
      }
    }

    // When there is a incomplete parenthesis ... :(
    if (largestOpenParenPosition > -1 && pairedCloseParenPosition === -1 ||
        pairedCloseParenPosition > -1 && largestOpenParenPosition === -1) {
          alert('Incomplete parenthesis!');
          return;
        }

    // When no parenthesis is found, just calculate the string
    if (largestOpenParenPosition === -1 &&
        pairedCloseParenPosition === -1) {
          return calculate(charArrays);
    }

    // Goal is, for example,
    // turn ['2','+','(','3','+','4',')','*','6'] to ['2','+','7','*','6']
    // then calculate the equation through calculate()

    // Calculate the equation string inside the parenthesis
    var calculatingStrArr = charArrays.slice(largestOpenParenPosition + 1, pairedCloseParenPosition);

    // Get the calculated result
    var calcualtedStr = calculate(calculatingStrArr).toString();

    // Remove the calculated part (parenthesis with the elements inside)
    // in the example above, it will be this part [(','3','+','4',')']
    var numToSplice = pairedCloseParenPosition - largestOpenParenPosition + 1;
    charArrays.splice(largestOpenParenPosition, numToSplice);

    // Insert the calculated answer ('7') back to
    // the array ['2','+','*','6'], it becomes ['2','+','7','*','6']
    charArrays.splice(largestOpenParenPosition, 0, calcualtedStr);

    // Recurse until no more parenthesis is in the string
    return calculateAll(charArrays);
  }

  // Handle each button click event
  function handleClickedButtonEvent(e) {
    newInput = e.target.value.toString();
    if (newInput === 'AC') {
      return reset();
    }

    if (newInput === '=') {
      // When ENTER or '=' button is pressed,
      // evaluate the equation and display it
      var finalResult = calculateAll(stringEquation) || 0;
      updateDisplay(finalResult);
      stringEquation = '' + finalResult;
    } else {
      // Keep accumulating the equation until hit enter
      stringEquation = accumulateInputs(newInput);
      updateDisplay(stringEquation);
    }
  }

  // Listen to 'click' event on each calculator button
  for (var x = 0; buttons.length > x; x++) {
    // Disable using keyboard to 'click' a button except '='
    if (buttons[x].value !== '=') {
      buttons[x].addEventListener('keydown', function(e) {
        e.preventDefault();
      }, false);
    }
    // Add click event on each button
    buttons[x].addEventListener('click', handleClickedButtonEvent, false);
  }

  // Map to 'Enter' key to clicking '=' button
  document.addEventListener('keyup', function(e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
      document.getElementById('equal').click();
    }
  }, false);
})();
