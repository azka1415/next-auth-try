import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Role } from "@prisma/client";
export const teamRouter = router({
  createTeam: publicProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session) {
        new TRPCError({
          code: "FORBIDDEN",
          message: "cannot create team while logged out",
        });
      }
      const member = await ctx.prisma.member.create({
        data: {
          role: Role.ADMIN,
          user: {
            connect: {
              id: ctx.session?.user?.id,
            },
          },
        },
        select: {
          memberId: true,
        },
      });
      const team = await ctx.prisma.team.create({
        data: {
          name: input.name,
          description: input.description,
          members: {
            connect: {
              memberId: member.memberId,
            },
          },
          creatorId: member.memberId,
        },
      });
      return team;
    }),
  getTeams: publicProcedure.query(async ({ ctx }) => {
    const teams = await ctx.prisma.member.findMany({
      where: { userId: ctx.session?.user?.id },
      select: {
        teams: {
          select: {
            name: true,
            description: true,
            id: true,
          },
        },
      },
    });
    return teams[0];
  }),
  addMember: publicProcedure
    .input(
      z.object({
        teamId: z.string(),
        newMemberEmail: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "cannot add member while logged out",
        });
      }
      if (input.newMemberEmail === "") {
        new TRPCError({
          code: "FORBIDDEN",
          message: "please add valid email",
        });
      }

      const selectedUser = await ctx.prisma.user.findUnique({
        where: { email: input.newMemberEmail },
        select: { id: true },
      });
      const newMember = await ctx.prisma.member.create({
        data: {
          user: {
            connect: {
              id: selectedUser?.id,
            },
          },
        },
        select: {
          memberId: true,
        },
      });
      const oldTeam = await ctx.prisma.team.findUnique({
        where: { id: input.teamId },
        select: {
          members: true,
        },
      });
      const fix = oldTeam?.members.map((member) => {
        return { memberId: member.memberId };
      });
      if (!fix) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "team does not exist",
        });
      }
      const teamUpdate = await ctx.prisma.team.update({
        where: { id: input.teamId },
        data: {
          members: {
            set: [...fix, newMember],
          },
        },
      });
      return teamUpdate;
    }),
  getSpecificTeam: publicProcedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const team = await ctx.prisma.team.findUnique({
        where: { id: input.text },
        select: {
          id: true,
          name: true,
          description: true,
          creator: {
            select: {
              userId: true,
            },
          },
          members: {
            select: {
              user: { select: { email: true, id: true, name: true } },
              role: true,
            },
          },
        },
      });
      if (!team) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "team does not exist",
        });
      }
      return team;
    }),
  deleteMember: publicProcedure
    .input(
      z.object({
        teamId: z.string(),
        deletedUserEmail: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "cannot delete member while logged out",
        });
      }
      const oldTeam = await ctx.prisma.team.findUnique({
        where: { id: input.teamId },
        select: { members: true },
      });
      const findUserId = await ctx.prisma.user.findUnique({
        where: { email: input.deletedUserEmail },
        select: { id: true },
      });

      const newTeam = oldTeam?.members
        .filter((item) => item.userId !== findUserId?.id)
        .map((item) => ({
          memberId: item.memberId,
        }));
      if (!oldTeam || !newTeam) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "team does not exist",
        });
      } else {
        const done = await ctx.prisma.team.update({
          where: { id: input.teamId },
          data: {
            members: {
              set: newTeam,
            },
          },
          select: {
            members: true,
          },
        });
        return done;
      }
    }),
  deleteTeam: publicProcedure
    .input(
      z.object({
        teamId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const deletedTeam = await ctx.prisma.team.delete({
        where: { id: input.teamId },
      });
      await ctx.prisma.member.deleteMany({
        where: { teams: { every: { id: input.teamId } } },
      });
      return deletedTeam;
    }),
  getTeamNotes: publicProcedure.query(async ({ ctx }) => {
    const notes = await ctx.prisma.note.findMany({
      where: { userId: ctx.session?.user?.id },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        name: true,
        body: true,
      },
    });
    return notes;
  }),
  checkAdmin: publicProcedure
    .input(
      z.object({
        teamId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.session) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "cannot check admin while logged out",
        });
      }
      const team = await ctx.prisma.team.findUnique({
        where: { id: input.teamId },
        select: {
          members: true,
        },
      });
      const admins = team?.members
        .filter((member) => member.role === "ADMIN")
        .map((v) => v.userId);
      return admins;
    }),
});
