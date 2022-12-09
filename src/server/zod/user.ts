import * as z from "zod"
import { CompleteAccount, RelatedAccountModel, CompleteSession, RelatedSessionModel, CompleteNote, RelatedNoteModel, CompleteMember, RelatedMemberModel } from "./index"

export const UserModel = z.object({
  id: z.string(),
  name: z.string().nullish(),
  email: z.string(),
  emailVerified: z.date().nullish(),
  image: z.string().nullish(),
})

export interface CompleteUser extends z.infer<typeof UserModel> {
  accounts: CompleteAccount[]
  sessions: CompleteSession[]
  notes: CompleteNote[]
  Member: CompleteMember[]
}

/**
 * RelatedUserModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUserModel: z.ZodSchema<CompleteUser> = z.lazy(() => UserModel.extend({
  accounts: RelatedAccountModel.array(),
  sessions: RelatedSessionModel.array(),
  notes: RelatedNoteModel.array(),
  Member: RelatedMemberModel.array(),
}))
