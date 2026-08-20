import { Request, Response } from 'express';
import campaignService from '../services/campaign.service';
import { createCampaignSchema } from '../lib/validation';

export const createCampaignController = async (req: Request, res: Response) => {
  try {
    const validatedData = createCampaignSchema.parse(req.body);
    const createdById = req.user?.userId;

    if (!createdById) {
      throw new Error('Unauthorized');
    }

    const campaign = await campaignService.createCampaign({
      ...validatedData,
      startsAt: new Date(validatedData.startsAt),
      expiresAt: validatedData.expiresAt ? new Date(validatedData.expiresAt) : undefined,
      createdById,
    });

    res.status(201).json(campaign);
  } catch (error) {
    throw error;
  }
};

export const listCampaignsController = async (req: Request, res: Response) => {
  try {
    const campaigns = await campaignService.listCampaigns();
    res.status(200).json(campaigns);
  } catch (error) {
    throw error;
  }
};

export const getCampaignController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new Error('Campaign ID is required');
    }

    const campaignId = Array.isArray(id) ? id[0] : id;
    const campaign = await campaignService.getCampaignById(campaignId);
    res.status(200).json(campaign);
  } catch (error) {
    throw error;
  }
};
