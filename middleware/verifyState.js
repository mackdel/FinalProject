const { find } = require('../model/State');

const data = {
    states: require('../model/statesData.json'),
    setStates: function (data) { this.states = data }
}

const verifyState = (req, res, next) => {
    // Set state code sent to uppercase to check
    const stateCode = req.params['state'].toUpperCase();
    // Create array of all state codes
    const codeMap = data.states.map( state => state.code);
    // Find if given state code is in array
    if (!codeMap.find( sc => sc === stateCode)) {
        // No code found; not a valid state code
        return res.status(400).json({'message': "Invalid state abbreviation parameter"});
    }
    // Code found; set code to given code
    req.code = stateCode;
    next();
}

module.exports = verifyState;