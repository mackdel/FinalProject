const State = require('../model/State');

const data = {
    states: require('../model/statesData.json'),
    setStates: function (data) { this.states = data }
}

const getAllStates = async (req, res) => {
    // get state data either all, contiguous, or non-contiguous states
    const states = (req.query.contig === 'true') ? data.states.filter( s => s.admission_number < 49)
        : (req.query.contig === 'false') ? data.states.filter( s => s.admission_number >= 49)
        : data.states;
    // if no states found, exit
    if (!states) return res.status(204).json({'message': 'No states found.'});
    // add any mongodb funfacts to states data
    const mStates = await State.find();
    states.forEach( (state) => {
        const stateff = mStates.find( sc => sc.stateCode === state.code);
        if (stateff) { state.funfacts = stateff.funfacts};
    });
    // send states 
    res.json(states);  
}

const getState = async (req, res) => {
    // Find state with requested code in json data
    const state = data.states.find(st => st.code === req.code);
    // find state with req code in MongoDB
    const stateff = await State.findOne({stateCode: req.code}).exec();
    // if state in MonogoDB add its fun facts to requested state
    if (stateff) { state.funfacts = stateff.funfacts};
    // send state data
    res.json(state);
}

const getFunFact = async (req, res) => {
    // find state with req code in MongoDB
    const state = await State.findOne({stateCode: req.code}).exec();
    // get state name 
    const statename = data.states.find(st => st.code === req.code).state;
    // If there is no state, exit
    if (!state) return res.status(404).json({'message': `No Fun Facts found for ${statename}`});

    // find state's fun facts
    const funfacts = state.funfacts;
    // if state has no funfacts, exit 
    // this is when we delete all the fun facts from a state that is in mongodb
    if (funfacts.length === 0) return res.status(404).json({'message': `No Fun Facts found for ${statename}`});

    // get random funfact from funfacts array and send
    const funfact = funfacts[Math.floor(Math.random()* funfacts.length)];
    res.json({
        "funfact" : funfact
    });
}

const getCapital = (req, res) => {
    // Find state with requested code in json data
    const state = data.states.find(st => st.code === req.code);
    // Find capital of state and send
    res.json({
        "state" : state.state,
        "capital" : state.capital_city
    });
}

const getNickname = (req, res) => {
    // Find state with requested code in json data
    const state = data.states.find(st => st.code === req.code);
    // Find nickname of state and send
    res.json({
        "state" : state.state,
        "nickname" : state.nickname
    });
}

const getPopulation = (req, res) => {
    // Find state with requested code in json data
    const state = data.states.find(st => st.code === req.code);
    // Find pop of state and send
    res.json({
        "state" : state.state,
        "population" : state.population.toLocaleString()
    });
}

const getAdmission = (req, res) => {
    // Find state with requested code in json data
    const state = data.states.find(st => st.code === req.code);
    // Find admission data of state and send
    res.json({
        "state" : state.state,
        "admitted" : state.admission_date
    });
}

const createFunFact = async (req,res) => {
    const funfacts = req?.body?.funfacts;
    // Check if we got funfact data that is an array
    if (!funfacts) return res.status(400).json({ 'message': "State fun facts value required"});
    else if (!Array.isArray(funfacts)) return res.status(400).json({ 'message': "State fun facts value must be an array"});
    try {
        // find state with req code
        const state = await State.findOne({stateCode: req.code}).exec();
        // If state exists, append funfacts 
        if (state) {
            state.funfacts.push(...funfacts);
            await state.save();
            return res.json(state);
        }
        // If it does not exists, create new state with funfacts
        const newState = await State.create({
            "stateCode" : req.code,
            "funfacts" : funfacts
        });
        res.status(201).json(newState);
    } catch (err) {
        console.log(err);
    } 
}

const patchFunFact = async (req, res) => {
    // get state name 
    const statename = data.states.find(st => st.code === req.code).state;
    // get request body data
    const funfact = req?.body?.funfact;
    const index = req?.body?.index;
    // Check if we got required data
    if (!index) return res.status(400).json({ 'message': "State fun fact index value required"});
    if (!funfact) return res.status(400).json({ 'message': "State fun fact value required"});
    // find state with req code
    const state = await State.findOne({stateCode: req.code}).exec();
    // Checks if state exists, state has funfacts, and if has funfact index
    if (!state || !state.funfacts) return res.status(400).json({ 'message': `No Fun Facts found for ${statename}`});
    if (!state.funfacts[index-1]) return res.status(400).json({ 'message': `No Fun Fact found at that index for ${statename}`});
    // Update funfact and send 
    state.funfacts[index-1] = funfact;
    await state.save();
    res.json(state);
}

const deleteFunFact = async (req,res) => {
    // get state name 
    const statename = data.states.find(st => st.code === req.code).state;
    // Check if we got required data and is valid
    const index = req?.body?.index;
    if (!index) return res.status(400).json({ 'message': "State fun fact index value required"});
    // find state with req code
    const state = await State.findOne({stateCode: req.code}).exec();
    // Checks if state exists, state has funfacts, and if has funfact index
    if (!state || !state.funfacts) return res.status(400).json({ 'message': `No Fun Facts found for ${statename}`});
    if (!state.funfacts[index-1]) return res.status(400).json({ 'message': `No Fun Fact found at that index for ${statename}`});
    // Delete funfact and send
    state.funfacts.splice(index-1,1);
    await state.save();
    res.json(state);
}

module.exports = { 
    getAllStates, 
    getState,
    getFunFact,
    getCapital,
    getNickname,
    getPopulation,
    getAdmission,
    createFunFact,
    patchFunFact,
    deleteFunFact
}