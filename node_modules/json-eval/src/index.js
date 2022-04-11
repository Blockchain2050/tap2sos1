'use strict';

var JSON5 = require('json5');

/**
 * Helper function. Search for and replace substrings in a greater string without using RegExp.
 *
 * @private
 * @param {string} string - the greater string.
 * @param {string} substring - the substring to be searched for.
 * @param {string} replacement - the search replacement.
 * @returns {string} JS object.
 */
function replaceSubstringGlobally(string, substring, replacement) {
  var i = 0;
  var l = string.length;
  var stringNew = '';

  while (i < l) {
    var substringLength = substring.length;

    if (string.substr(i, substringLength) === substring) {
      stringNew += replacement;
      i += substringLength;
    }
    else {
      stringNew += string[i];
      i++;
    }
  }

  return stringNew;
}

/**
 * Main function for export.
 * The recommended syntax for the submitted string is that it be valid JSON5.
 * However, this function was expressly created to parse the quoting and special character escaping scheme employed by
 * Pattern Lab for PHP.
 *
 * The steps on a high-level are as follows:
 *   * First, try to parse the string with JSON5.
 *   * If that fails, traverse the submitted string, modifying the data in the following manner:
 *   * Further escape all escaped quotes and colons. Use the string representation of their unicodes for this. This has
 *     the added bonus of being interpreted correctly by JSON5.parse() without further modification. This will be useful
 *     later in the function.
 *   * Once escaped quotes are out of the way, we know the remaining quotes are either key/value wrappers or wrapped
 *     within those wrappers. We know that remaining commas and colons are either delimiters, or wrapped within quotes
 *     to not be recognized as such.
 *   * A do-while loop traverses processString to write keys to a keys array and values to a values array.
 *   * Start by parsing the first key. Determine the type of wrapping quote, if any.
 *   * By knowing the open wrapper, we know that the next quote of that kind (if the key is wrapped in quotes) HAS to
 *     be the close wrapper. Similarly, if the key is unwrapped, we know the next colon HAS to be the delimiter between
 *     key and value.
 *   * Save the key to the keys array.
 *   * Next, search for a value. It will either be the next block wrapped in quotes, or a string of alphanumerics,
 *     decimal points, or minus signs.
 *   * Save the value to the values array.
 *   * The do-while loop truncates the processString value while parsing. Its condition for completion is when the
 *     processString is whittled down to an empty string.
 *   * After the keys and values arrays are built, a for loop iterates through them to build the final jsonString.
 *   * No quote substitution had been done prior to this loop. In this loop, all keys are ensured to be wrapped in
 *     double-quotes. String values are also ensured to be wrapped in double-quotes.
 *   * Unescape escaped unicodes except for double-quotes. Everything beside double-quotes will be wrapped in
 *     double-quotes without need for escape.
 *   * Return jsonString.
 *
 * @param {string} jsonLikeString - a JSON-like string.
 * @returns {object} JS object.
 */
function jsonEval(jsonLikeString) {
  var colonPos = -1;
  var i;
  var keys = [];
  var l;
  var processString = jsonLikeString.trim();
  var jsObject;
  var jsonString;
  var quote = null;
  var quotePos = -1;
  var values = [];
  var wrapper;

  // First, try parsing valid JSON5.
  try {
    jsObject = JSON5.parse(processString);
  }

  // Else, traverse string to massage it into valid JSON5.
  catch (err) {
    // Replace all escaped double-quotes with escaped unicode.
    processString = replaceSubstringGlobally(processString, '\\"', '\\u0022');

    // Replace all escaped single-quotes with escaped unicode.
    processString = replaceSubstringGlobally(processString, '\\\'', '\\u0027');

    // Replace all escaped colons with escaped unicode.
    processString = replaceSubstringGlobally(processString, '\\:', '\\u0058');

    // With escaped chars out of the way, traverse processString looking for keys and values.
    do {
      // Check if searching for a key.
      if (processString[0] === '{' || processString[0] === ',') {
        processString = processString.substring(1, processString.length).trim();

        // Search for an end quote if wrapped in quotes. Else search for a colon. Everything up to that position will be
        // saved in the keys array.
        switch (processString[0]) {
          // Determine the quote type of the opening quote.
          case '"':
          case '\'':
            wrapper = processString[0];
            // Find the position of the closing quote.
            quotePos = processString.indexOf(wrapper, 1);

            break;

          default:
            colonPos = processString.indexOf(':');
        }

        if (quotePos > -1) {
          keys.push(processString.substring(0, quotePos + 1).trim());

          // Truncate the beginning from processString and look for a value.
          processString = processString.substring(quotePos + 1, processString.length).trim();

          // Unset quotePos.
          quotePos = -1;
        }
        else if (colonPos > -1) {
          keys.push(processString.substring(0, colonPos).trim());

          // Truncate the beginning from processString and look for a value.
          processString = processString.substring(colonPos, processString.length);

          // Unset colonPos.
          colonPos = -1;

        // If there are no more colons, and we're looking for a key, probably a problem. Stop further processing.
        }
        else {
          /* istanbul ignore next */
          processString = '';
          /* istanbul ignore next */
          break;
        }
      }

      // Now, search for a value.
      if (processString[0] === ':') {
        processString = processString.substring(1, processString.length).trim();

        switch (processString[0]) {
          // Since a quote of the same type as its wrappers would be escaped, and we escaped those even further with
          // their unicodes, it is safe to look for wrapper pairs and conclude that their contents are values.
          case '"':
            quote = '"';

            break;
          case '\'':
            quote = '\'';

            break;

          default:
            quote = null;
        }

        var valueStop = 0;
        l = processString.length;

        switch (quote) {
          case '"':
          case '\'':
            for (i = 1; i < l; i++) {
              if (processString[i] === quote) {
                valueStop = i + 1;

                break;
              }
            }

            break;

          default:
            for (i = 0; i < l; i++) {
              // If the value is not wrapped in quotes, check that each following character is an alphanumeric, decimal
              // point, or plus or minus sign for exponential notation.
              // eslint-disable-next-line no-useless-escape
              if (!/[\w\.\+\-]/.test(processString[i])) {
                valueStop = i;

                break;
              }
            }
        }

        for (i = valueStop; i < l; i++) {
          if (/\s/.test(processString[i])) {
            valueStop++;
          }
          else {
            break;
          }
        }

        // Add this slice to values.
        values.push(processString.slice(0, valueStop).trim());

        // Truncate the beginning from processString and continue either looking for a
        // key, or returning.
        processString = processString.slice(valueStop);

        // Exit do while if the final char is '}'
        if (processString === '}') {
          processString = '';

          break;
        }

      // If there are no more colons, and we're looking for a value, probably a problem. Stop further processing.
      }
      else {
        /* istanbul ignore next */
        processString = '';
        /* istanbul ignore next */
        break;
      }
    } while (processString);

    // Build jsonString string for JSON parsing.
    jsonString = '{';
    l = keys.length;

    for (i = 0; i < l; i++) {
      // Keys.
      // Replace single-quote wrappers with double-quotes.
      if (keys[i][0] === '\'' && keys[i][keys[i].length - 1] === '\'') {
        jsonString += '"';
        // Any enclosed double-quotes must be escaped.
        jsonString += replaceSubstringGlobally(keys[i].substring(1, keys[i].length - 1), '"', '\\"');
        jsonString += '"';
      }
      else {
        // Open wrap with double-quotes if no wrapper.
        if (keys[i][0] !== '"' && keys[i][0] !== '\'') {
          jsonString += '"';

          // The following line is to clean up vestiges from Pattern Lab PHP's escaping scheme.
          // F.Y.I. Pattern Lab PHP would allow special characters like question marks in parameter keys so long as the
          // key was unwrapped and the special character escaped with a backslash. In Node, we need to wrap those keys
          // and unescape those characters.
          keys[i] = replaceSubstringGlobally(keys[i], '\\', '');
        }

        jsonString += keys[i];

        // Close wrap with double-quotes if no wrapper.
        if (keys[i][keys[i].length - 1] !== '"' && keys[i][keys[i].length - 1] !== '\'') {
          jsonString += '"';
        }
      }

      // Colon delimiter.
      jsonString += ':';

      // Values.
      // Replace single-quote wrappers with double-quotes.
      if (values[i][0] === '\'' && values[i][values[i].length - 1] === '\'') {
        jsonString += '"';
        // Any enclosed double-quotes must be escaped.
        jsonString += replaceSubstringGlobally(values[i].substring(1, values[i].length - 1), '"', '\\"');
        jsonString += '"';
      }
      // For everything else, just add the value however it's wrapped.
      else {
        jsonString += values[i];
      }

      // Comma delimiter.
      if (i < keys.length - 1) {
        jsonString += ',';
      }
    }

    jsonString += '}';
    // Unescape escaped unicode except for double-quotes.
    jsonString = replaceSubstringGlobally(jsonString, '\\u0027', '\'');
    jsonString = replaceSubstringGlobally(jsonString, '\\u0058', ':');

    try {
      jsObject = JSON5.parse(jsonString);
    }
    catch (err1) {
      /* istanbul ignore next */
      console.error('\n' + err.message); // eslint-disable-line no-console
    }
  }

  return jsObject;
}

if (typeof define === 'function') {
  define(function () {
    return jsonEval;
  });
}
/* istanbul ignore next */
else if (typeof window === 'object') {
  /* istanbul ignore next */
  window.jsonEval = jsonEval;
}

module.exports = jsonEval;
