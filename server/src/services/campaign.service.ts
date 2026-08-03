import prisma from '../lib/prisma';

export interface CreateCampaignData {
  title: string;
  description?: string;
  totalCoupons: number;
  startsAt: Date;
  expiresAt?: Date;
  createdById: string;
}

export class CampaignService {
  async createCampaign(data: CreateCampaignData) {
    const campaign = await prisma.campaign.create({
      data,
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    return campaign;
  }

  async listCampaigns() {
    const campaigns = await prisma.campaign.findMany({
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
          },
        },
        _count: {
          select: {
            claims: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return campaigns;
  }

  async getCampaignById(id: string) {
    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
          },
        },
        _count: {
          select: {
            claims: true,
          },
        },
      },
    });

    if (!campaign) {
      throw new Error('Campaign not found');
    }

    return campaign;
  }
}

export default new CampaignService();
