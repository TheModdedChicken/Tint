/* Exported Functions */

// Builds a JSON object based on its given input.
// Takes an array and discards any elements in that array that are undefined
// Useful for filtering unused arguments in a JSON-like structure

// Input example: appendArgsToJSON( [ {testName: args.testValue}, {testName2: testInput}, {testName3: {testInputName: testName.Input}} ] );
// Assuming args.testValue is 100, testInput is "None", and testName.Input is either undefined, null, or ''; then this would return:
// {testName: 100, testName2: "None"}
function appendArgsToJSON (argArray) {
    if (!argArray) return new Error('No array of objects was provided\nExample: appendArgsToJSON( [{testName: args.testValue}, {testName2: testInput}] );');
    if ((typeof argArray === "string") === true || ((typeof argArray === "object") === true && Array.isArray(argArray) === false)) return new Error('Only arrays are accepted as a root parameter\nExample: appendArgsToJSON( [{testName: "TestString"}, {testName2: testInput}] );');

    var outGoingJSON = {};

    argArray.forEach(element => {
        var regExJson = new RegExp(/^[a-zA-Z0-9_\-\. ]*(?:\{[a-zA-Z0-9_\-\.]+\})?[a-zA-Z0-9_\-\. ]*$/);
        var ElementName = Object.keys(element);
        var ElementValue = Object.values(element);
        ElementName = ElementName[0];
        ElementValue = ElementValue[0];

        checkJSON(ElementValue)


        function checkJSON(valueOfElement) {
            // Check if string is valid JSON (True means no, False means yes)
            var isJson = regExJson.test(valueOfElement);
            var isArray = Array.isArray(ElementValue);

            if (isJson == false && isArray == false) {
                // Grabs the value of the now existing JSON object
                var valueOfValue = Object.values(valueOfElement);

                // Checks if the value is defined or not
                if (valueOfValue !== undefined || valueOfValue !== null || valueOfValue !== '') {
                    // Does a stage 2 check for any further nested JSON
                    var appendJSON = checkJSONStage2(valueOfValue);
                    var appendIsJson = regExJson.test(appendJSON);

                    if (appendJSON == undefined || appendJSON == null || appendJSON == '') {
                        // Does nothing if the last nested JSON object has an undefined value
                    } else if (appendIsJson == false || appendIsJson == true) {
                        // Appends said JSON into the outgoing JSON object
                        outGoingJSON[ElementName] = valueOfElement;
                    }
                } else {
                    // Does nothing if value is undefined
                }
            } else if (isArray == true) {
                var outGoingArray = [];

                // Gets each element in the array given
                valueOfElement.forEach(valueElement => {
                    // Does a stage 2 check for any further nested JSON
                    var appendJSON = checkJSONStage2(valueElement);
                    var appendIsJson = regExJson.test(appendJSON);

                    if (appendJSON == undefined || appendJSON == null || appendJSON == '') {
                        // Does nothing if the last nested JSON object has an undefined value
                    } else if (appendIsJson == false || appendIsJson == true) {
                        // Appends said data into the outgoing Array
                        outGoingArray.push(valueElement);
                    }
                })

                // Appends the newly created Array into the outgoing JSON object
                outGoingJSON[ElementName] = outGoingArray;
            } else if (valueOfElement !== '' && valueOfElement !== null && valueOfElement !== undefined) {
                // Appends said JSON into the outgoing JSON object
                outGoingJSON[ElementName] = valueOfElement;
            }
        }
    });

    return outGoingJSON;
}

module.exports.appendArgsToJSON = appendArgsToJSON;


/* Local Functions */

function checkJSONStage2(valueOfElement) {
    var regExJson = new RegExp(/^[a-zA-Z0-9_\-\. ]*(?:\{[a-zA-Z0-9_\-\.]+\})?[a-zA-Z0-9_\-\. ]*$/);
    // Check if string is valid JSON (True means no, False means yes)
    var isJson = regExJson.test(valueOfElement);
    var isArray = Array.isArray(valueOfElement);

    if (isJson == false && isArray == false) {
        // Grabs the value and name of the passed JSON object
        var nameOfName = Object.keys(valueOfElement);
        var valueOfValue = Object.values(valueOfElement);

        // Checks if the value is defined or not
        if (valueOfValue !== undefined || valueOfValue !== null || valueOfValue !== '') {
            // Does a stage 2 check for any further nested JSON
            var appendJSON = checkJSONStage2(valueOfValue);
            var appendIsJson = regExJson.test(appendJSON);

            if (appendJSON == undefined || appendJSON == null || appendJSON == '') {
                // Returns undefined if the last nested JSON object has an undefined value
                return undefined
            } else if (appendIsJson == false || appendIsJson == true) {
                // Returns newly formed JSON data
                return { [nameOfName]: appendJSON }
            }
        } else {
            // Returns undefined if the value is undefined
            return undefined;
        }
    } else if (isArray == true) {
        var outGoingArray = [];

        // Gets each element in the array given
        valueOfElement.forEach(valueElement => {
            // Does a stage 2 check for any further nested JSON
            var appendJSON = checkJSONStage2(valueElement);
            var appendIsJson = regExJson.test(appendJSON);

            if (appendJSON == undefined || appendJSON == null || appendJSON == '') {
                // Returns undefined if the last nested piece of data has an undefined value
                return undefined;
            } else if (appendIsJson == false || appendIsJson == true) {
                // Appends said data into the outgoing Array
                outGoingArray.push(valueElement);
            }
        })

        // Returns the newly created Array
        return outGoingArray;
    } else if (valueOfElement !== '' && valueOfElement !== null && valueOfElement !== undefined) {
        // Returns currently held JSON
        return valueOfElement;
    }
}