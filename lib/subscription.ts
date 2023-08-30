import { auth } from "@clerk/nextjs"

import prismadb from "@/lib/prismadb"

const DAY_IN_MS = 86_400_400;

export const checkSubscription = async () => {
  const { userId } = auth();

  if (!userId) {
    return false;
  }

  const userSubscription = await prismadb.userSubscription.findUnique({
    where: {
      userId: userId,
    },
    select: {
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripePriceId: true,
      stripeSubscriptionId: true,
    }
  })

  if (!userSubscription) {
    return false;
  }

  const isValid = 
    userSubscription.stripePriceId && 
    userSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now();
  
  // !! Ensures that it is ALWAYS a boolean
  return !!isValid;
}