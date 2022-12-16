import * as trpc from '@trpc/server'
import { Prisma } from '@prisma/client'
import {
  createUserSchema,
  requestOtpSchema,
  verifyOtpSchema,
} from '../../schema/user.schema'
import { createRouter } from '../createRouter'
import { sendLoginEmail } from '../../utils/mailer'
import { baseUrl } from '../../constants'
import { decode, encode } from '../../utils/base64'
import { signJwt } from '../../utils/jwt'
import { serialize } from 'cookie'

export const userRouter = createRouter()
  // mutation url for api route
  .mutation('register-user', {
    // data input validation
    input: createUserSchema,
    // actual service to process request
    async resolve({ ctx, input }) {
      const { name, email } = input
      try {
        const user = await ctx.prisma.user.create({
          data: {
            name,
            email,
          },
        })
      } catch (error) {
        // custom error
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new trpc.TRPCError({
              code: 'CONFLICT',
              message: 'User already exists',
            })
          }
        }
        throw new trpc.TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Somewhing went wrong.',
        })
      }
    },
  })
  .mutation('request-otp', {
    // data input validation
    input: requestOtpSchema,
    // actual service to process requests
    async resolve({ ctx, input }) {
      const { email, redirect } = input
      // get user by email
      const user = await ctx.prisma.user.findUnique({
        where: {
          email,
        },
      })
      // throw error if user is not found
      if (!user) {
        throw new trpc.TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        })
      }
      // create single record in table to reference as token
      const token = await ctx.prisma.loginToken.create({
        data: {
          redirect,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      })

      // send email to user

      await sendLoginEmail({
        token: encode(`${token.id}:${user.email}`),
        url: baseUrl,
        email: user.email,
      })
    },
  })
  .query('verify-otp', {
    // data input validation
    input: verifyOtpSchema,
    // actual service to process request
    async resolve({ ctx, input }) {
      const decoded = decode(input.hash).split(':')
      const [id, email] = decoded

      const token = await ctx.prisma.loginToken.findFirst({
        where: {
          id,
          user: {
            email,
          },
        },
        include: {
          user: true,
        },
      })

      if (!token) {
        throw new trpc.TRPCError({
          code: 'FORBIDDEN',
          message: 'Invalid token',
        })
      }

      const jwt = signJwt({
        id: token.user.id,
        email: token.user.email,
      })

      ctx.res.setHeader('Set-Cookie', serialize('token', jwt, { path: '/' }))

      return {
        redirect: token.redirect,
      }
    },
  })
  .query('me', {
    resolve({ ctx }) {
      return ctx.user
    },
  })
