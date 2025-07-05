import express from 'express';
const router = express.Router();
import {startOnboarding, logOnboardingStep, getLogsByEmail,userLogin,updatePassword} from '../controller/onBoardingController.js';

router.post('/start-onboarding', startOnboarding);
router.post('/log-onboarding', logOnboardingStep);
router.post('/login', userLogin);
router.get('/logs/:email', getLogsByEmail);
router.put('/update-password', updatePassword);
export default router;
