import prisma from '../lib/prisma';
import { Prisma } from '@prisma/client';

export interface ClaimData {
  campaignId: string;
  userId: string;
}

export class ClaimService {
  async claimCoupon(data: ClaimData) {
    const { campaignId, userId } = data;

    try {
      const result = await prisma.$transaction(async (tx) => {
        const campaign = await tx.campaign.findUnique({
          where: { id: campaignId },
        });

        if (!campaign) {
          throw new Error('Campaign not found');
        }

        const updatedCampaign = await tx.campaign.update({
          where: { 
            id: campaignId,
            issuedCount: {
              lt: campaign.totalCoupons,
            },
          },
          data: {
            issuedCount: {
              increment: 1,
            },
          },
        });

        const claim = await tx.claim.create({
          data: {
            campaignId,
            userId,
          },
        });

        return claim;
      });

      return result;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new Error('You have already claimed a coupon for this campaign');
        }
        if (error.code === 'P2025') {
          throw new Error('No coupons left');
        }
      }
      if (error instanceof Error && error.message === 'No coupons left') {
        throw error;
      }
      throw error;
    }
  }

  async getUserClaims(userId: string) {
    const claims = await prisma.claim.findMany({
      where: { userId },
      include: {
        campaign: {
          select: {
            title: true,
            description: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return claims;
  }
}

export default new ClaimService();
