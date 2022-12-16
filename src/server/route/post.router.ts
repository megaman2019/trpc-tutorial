import * as trpc from '@trpc/server'
import { createPostSchema, getPostSchema } from '../../schema/post.schema'
import { createRouter } from '../createRouter'

export const postRouter = createRouter()
  .mutation('create-post', {
    input: createPostSchema,
    async resolve({ ctx, input }) {
      if (!ctx.user) {
        throw new trpc.TRPCError({
          code: 'FORBIDDEN',
          message: 'Cannot add post while logged out',
        })
      }
      const post = await ctx.prisma.post.create({
        data: {
          ...input,
          user: {
            connect: {
              id: ctx.user.id,
            },
          },
        },
      })

      return post
    },
  })
  .query('posts', {
    async resolve({ ctx }) {
      return await ctx.prisma.post.findMany()
    },
  })
  .query('get-post', {
    input: getPostSchema,
    async resolve({ ctx, input }) {
      return await ctx.prisma.post.findUnique({
        where: {
          id: input.postId,
        },
      })
    },
  })
