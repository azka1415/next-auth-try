import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";
export const noteRouter = router({
  addItem: publicProcedure
    .input(
      z.object({
        text: z.string(),
        body: z.string(),
        shared: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session) {
        new TRPCError({
          code: "FORBIDDEN",
          message: "cannot create post while logged out",
        });
      }

      const item = await ctx.prisma.note.create({
        data: {
          name: input.text,
          body: input.body,
          User: {
            connect: {
              id: ctx.session?.user?.id,
            },
          },
        },
      });
      return item;
    }),
  getItems: publicProcedure.query(async ({ ctx }) => {
    const items = await ctx.prisma.note.findMany({
      where: { userId: ctx.session?.user?.id },
    });
    return items;
  }),
  deleteItem: publicProcedure
    .input(z.object({ text: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const item = await ctx.prisma.note.delete({
        where: { id: input.text },
      });
      return item;
    }),
  checkItem: publicProcedure
    .input(z.object({ text: z.string(), check: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      const item = await ctx.prisma.note.update({
        where: { id: input.text },
        data: { checked: input.check },
      });
      return item;
    }),
  getSpecificItem: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ ctx, input }) => {
      const item = await ctx.prisma.note.findUnique({
        where: { id: input.text },
      });
      return item;
    }),
  editItem: publicProcedure
    .input(
      z.object({ text: z.string(), newName: z.string(), newBody: z.string() })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.newBody === "") {
        const item = await ctx.prisma.note.update({
          where: { id: input.text },
          data: { name: input.newName },
        });
        return item;
      } else if (input.newName === "") {
        const item = await ctx.prisma.note.update({
          where: { id: input.text },
          data: { body: input.newBody },
        });
        return item;
      }
      const item = await ctx.prisma.note.update({
        where: { id: input.text },
        data: { name: input.newName, body: input.newBody },
      });
      return item;
    }),
});
