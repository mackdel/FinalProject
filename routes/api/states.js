const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController');
const verifyState = require('../../middleware/verifyState');

router.route('/')
    .get(statesController.getAllStates);

router.route('/:state')
    .get(verifyState, statesController.getState);

router.route('/:state/funfact')
    .get(verifyState, statesController.getFunFact)
    .post(verifyState, statesController.createFunFact)
    .patch(verifyState, statesController.patchFunFact)
    .delete(verifyState, statesController.deleteFunFact);

router.route('/:state/capital')
    .get(verifyState, statesController.getCapital);
router.route('/:state/nickname')
    .get(verifyState, statesController.getNickname);
router.route('/:state/population')
    .get(verifyState, statesController.getPopulation);
router.route('/:state/admission')
    .get(verifyState, statesController.getAdmission);

/* 
    .post(statesController.createNewEmployee)
    .put(statesController.updateEmployee)
    .delete(statesController.deleteEmployee);   
*/

module.exports = router;