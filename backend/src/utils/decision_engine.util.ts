import { prisma } from "@db/prisma.js"
import { AppError } from "./AppError.js";
import { Decision, DecisionResult } from 'types.js';

export const evaluateRisk = async (intentId:number): Promise<DecisionResult> => {
  //fetch intent from DB
  const intent = await prisma.transactionIntent.findUnique({
    where: {id: intentId}
  });

  if(!intent){
    throw new AppError("Transaction intent not found", 400);
  }

  //just a placeholder
  let riskScore = 0;
  if (intent.amount > 1000) {
    riskScore =80; 
  } else {
      riskScore = 20;
  }

  let decision: Decision;
  let reason: string;

  //converting score -> decision 
  if (riskScore > 70) {
    decision = "BLOCK";
    reason = "High risk transaction";
  } else if (riskScore > 30) {
    decision = "CONFIRM";
    reason = "Additional verification required";
  } else {
    decision = "APPROVE";
    reason = "Low risk transaction";
  }


  //Persistent Decision 
  await prisma.transactionIntent.update({
    where: { id: intentId },
    data: {
      riskScore,
      status:
        decision === "APPROVE"
          ? "APPROVED"
          : decision === "BLOCK"
          ? "BLOCKED"
          : "PENDING",
      decidedAt: new Date(),
      decisionReason: reason
    }
  });


  return { decision, riskScore, reason };
}