import prisma from '../lib/prisma';

export interface ClaimData {
  campaignId: string;
  userId: string;
}

export class ClaimService {
  async claimCoupon(data: ClaimData) {
    const { campaignId, userId } = data;

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      throw new Error('Campaign not found');
    }

    if (campaign.issuedCount >= campaign.totalCoupons) {
      throw new Error('No coupons left');
    }

    const claim = await prisma.claim.create({
      data: {
        campaignId,
        userId,
      },
    });

    await prisma.campaign.update({
      where: { id: campaignId },
      data: {
        issuedCount: campaign.issuedCount + 1,
      },
    });

    return claim;
  }
}

export default new ClaimService();
