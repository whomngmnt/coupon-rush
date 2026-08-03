import { Request, Response } from 'express';
import campaignService from '../services/campaign.service';

export const createCampaignController = async (req: Request, res: Response) => {
  try {
    const { title, description, totalCoupons, startsAt, expiresAt } = req.body;
    const createdById = req.user?.userId;

    if (!title || !totalCoupons || !startsAt) {
      return res.status(400).json({ error: 'Title, totalCoupons, and startsAt are required' });
    }

    if (!createdById) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const campaign = await campaignService.createCampaign({
      title,
      description,
      totalCoupons,
      startsAt: new Date(startsAt),
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      createdById,
    });

    res.status(201).json(campaign);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const listCampaignsController = async (req: Request, res: Response) => {
  try {
    const campaigns = await campaignService.listCampaigns();
    res.status(200).json(campaigns);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCampaignController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Campaign ID is required' });
    }

    const campaignId = Array.isArray(id) ? id[0] : id;
    const campaign = await campaignService.getCampaignById(campaignId);
    res.status(200).json(campaign);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Campaign not found') {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};
