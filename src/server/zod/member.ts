import * as z from "zod"
import { Role } from "@prisma/client"
import { CompleteTeam, RelatedTeamModel, CompleteUser, RelatedUserModel } from "./index"

export const MemberModel = z.object({
  memberId: z.string(),
  userId: z.string(),
  role: z.nativeEnum(Role),
})

export interface CompleteMember extends z.infer<typeof MemberModel> {
  createdTeams: CompleteTeam[]
  user: CompleteUser
  teams: CompleteTeam[]
}

/**
 * RelatedMemberModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedMemberModel: z.ZodSchema<CompleteMember> = z.lazy(() => MemberModel.extend({
  createdTeams: RelatedTeamModel.array(),
  user: RelatedUserModel,
  teams: RelatedTeamModel.array(),
}))
