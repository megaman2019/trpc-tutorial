import z from 'zod'

export const createPostSchema = z.object({
  title: z.string().max(256, 'Max length is 256 characters'),
  body: z.string().min(10, 'Minimum length is 10 characters'),
})

export type CreatePostInput = z.TypeOf<typeof createPostSchema>

export const getPostSchema = z.object({
  postId: z.string().uuid(),
})
