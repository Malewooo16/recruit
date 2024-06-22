//@ts-check

import express from 'express';
import { createJobOffer, getJobOffer, updateJobOffer, deleteJobOffer, getAllJobOffers } from '../actions/joboffers';
import { authenticateToken } from '../actions/auth';

const jobOfferRouter = express.Router();

jobOfferRouter.use(authenticateToken);

jobOfferRouter.post('/', async (req, res) => {
  try {
    const recruiterId = req.user.id;
    const newJobOffer = await createJobOffer(recruiterId, req.body);
    res.json(newJobOffer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

jobOfferRouter.get('/:id', async (req, res) => {
  try {
    const recruiterId = req.user.id;
    const jobOfferId = parseInt(req.params.id, 10);
    const jobOffer = await getJobOffer(jobOfferId, recruiterId);
    if (!jobOffer) {
      return res.status(404).json({ error: 'Job offer not found' });
    }
    res.json(jobOffer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

jobOfferRouter.put('/:id', async (req, res) => {
  try {
    const recruiterId = req.user.id;
    const jobOfferId = parseInt(req.params.id, 10);
    const updatedJobOffer = await updateJobOffer(jobOfferId, recruiterId, req.body);
    res.json(updatedJobOffer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

jobOfferRouter.delete('/:id', async (req, res) => {
  try {
    const recruiterId = req.user.id;
    const jobOfferId = parseInt(req.params.id, 10);
    const deletedJobOffer = await deleteJobOffer(jobOfferId, recruiterId);
    res.json(deletedJobOffer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

jobOfferRouter.get('/', async (req, res) => {
  try {
    const recruiterId = req.user.id;
    const jobOffers = await getAllJobOffers(recruiterId);
    res.json(jobOffers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default jobOfferRouter;
