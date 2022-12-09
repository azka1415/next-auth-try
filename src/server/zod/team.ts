import * as z from "zod"
import { CompleteMember, RelatedMemberModel, CompleteNote, RelatedNoteModel } from "./index"

export const TeamModel = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullish(),
  createdAt: z.date(),
  creatorId: z.string(),
})

export interface CompleteTeam extends z.infer<typeof TeamModel> {
  members: CompleteMember[]
  creator?: CompleteMember | null
  Note: CompleteNote[]
}

/**
 * RelatedTeamModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedTeamModel: z.ZodSchema<CompleteTeam> = z.lazy(() => TeamModel.extend({
  members: RelatedMemberModel.array(),
  creator: RelatedMemberModel.nullish(),
  Note: RelatedNoteModel.array(),
}))
