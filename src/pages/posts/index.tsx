import Link from 'next/link'
import { trpc } from '../../utils/trpc'

function PostListingPage() {
  const { data, isLoading, error } = trpc.useQuery(['posts.posts'])

  if (isLoading) return <p>Loading posts...</p>
  if (error) return <p>Something went wrong</p>
  if (data?.length == 0)
    return (
      <>
        <p> No available post yet</p>
        <Link href='/posts/new'>Create Post</Link>
      </>
    )

  return (
    <>
      {data?.map((post) => {
        return (
          <div key={post.id}>
            <h1>{post.title}</h1>
            <Link href={`/posts/${post.id}`}>View Post</Link>
          </div>
        )
      })}
    </>
  )
}

export default PostListingPage
