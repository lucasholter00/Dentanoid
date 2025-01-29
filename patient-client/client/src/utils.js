// Check if current button or a new button is selected
function checkIfDropdownPressed(currentMode, previousMode) {
  return (currentMode && (currentMode !== previousMode))
}

// Initialize scripts basd on their sources
function createHTMLScriptElement(scriptSource, appendToDOM) {
  const scriptElement = document.createElement('script')
  scriptElement.type = 'module'
  scriptElement.src = scriptSource

  if (appendToDOM === true) {
    document.head.prepend(scriptElement)
  }
}

/*
  Returns a string containing X full segments and 0-1 half segments of a numerical variable

  PARAMETERS:
   * originalQuantity: The numerical variable from which quantities are generated
   * fullIncrement: The value that a 'full segment' represents
   * halfIncrement: The value that a 'half segment' represents
*/
function getMeasurementInHalfQuantities(originalQuantity, fullIncrement, halfIncrement) {
  let measurement = ''
  let i = parseFloat(originalQuantity) + 1

  while (--i >= 0.5) {
    if (i < 1) { // Half increment
      measurement += halfIncrement
    } else { // Full increment
      measurement += fullIncrement
    }
  }
  return measurement
}

/*
  Returns the input string 's' cut by its N latest characters,
  where N equals ((s.length-1) - X), and X is the last index of the
  latest substring seperated by the delimiter.

  PARAMETERS:
  * s: The input string that a length greater than 'maxLength'
  * maxLength: The maximum amount of characters allowed
  * delimiter: The character to split 's' with
*/
function cutStringByMaxLengthAndDelimiter(s, maxLength, delimiter) {
  if (s.length > maxLength) {
    const stringSplit = s.split(delimiter)

    s = ''
    let i = 0
    while (s.length + stringSplit[i].length < maxLength) { // Add the next substring as long as the string to return doesn't exceed 'maxLength'
      s += stringSplit[i++]
    }
  }
  return s
}

export { checkIfDropdownPressed, createHTMLScriptElement, getMeasurementInHalfQuantities, cutStringByMaxLengthAndDelimiter }
