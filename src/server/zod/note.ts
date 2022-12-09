import * as z from "zod"
import { CompleteUser, RelatedUserModel, CompleteTeam, RelatedTeamModel } from "./index"

export const NoteModel = z.object({
  id: z.string(),
  name: z.string(),
  body: z.string().nullish(),
  checked: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string(),
  shareWithTeam: z.boolean(),
  teamId: z.string().nullish(),
})

export interface CompleteNote extends z.infer<typeof NoteModel> {
  User: CompleteUser
  Team?: CompleteTeam | null
}

/**
 * RelatedNoteModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedNoteModel: z.ZodSchema<CompleteNote> = z.lazy(() => NoteModel.extend({
  User: RelatedUserModel,
  Team: RelatedTeamModel.nullish(),
}))
