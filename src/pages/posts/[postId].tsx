import Error from 'next/error'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { trpc } from '../../utils/trpc'

function GetPostPage() {
  const router = useRouter()
  const postId = router.query.postId as string
  //   const [isRouterReady, setisRouterReady] = useState(false)
  const { data, isLoading } = trpc.useQuery(['posts.get-post', { postId }])

  //   useEffect(() => {
  //     if (router.isReady) {
  //       setisRouterReady(true)
  //     }
  //   }, [router])

  //   if (!isRouterReady) return <p>Reloading...</p>

  if (isLoading) return <p>Loading posts...</p>

  if (!data) return <Error statusCode={404} />

  return (
    <div>
      <h1>{data.title}</h1>
      <p>{data.body}</p>
    </div>
  )
}

export default GetPostPage
