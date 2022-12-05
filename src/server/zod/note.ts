import * as z from "zod"
import { CompleteUser, RelatedUserModel } from "./index"

export const NoteModel = z.object({
  id: z.string(),
  name: z.string(),
  body: z.string().nullish(),
  checked: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string(),
})

export interface CompleteNote extends z.infer<typeof NoteModel> {
  creator: CompleteUser
}

/**
 * RelatedNoteModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedNoteModel: z.ZodSchema<CompleteNote> = z.lazy(() => NoteModel.extend({
  creator: RelatedUserModel,
}))
