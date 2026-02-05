export type Decision  = "APPROVE" | "BLOCK" | "CONFIRM"

export type DecisionResult = {
    decision: Decision,
    riskScore: number,
    reason: string
}