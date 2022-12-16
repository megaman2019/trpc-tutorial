import type { NextPage } from 'next'
import { useUserContext } from '../context/user.context'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
// import dynamic from 'next/dynamic'
import LoginForm from '../components/LoginForm'
import { useRouter } from 'next/router'

const Home: NextPage = () => {
  const [showLoginForm, setShowLoginForm] = useState(false)

  // const LoginForm = useMemo(
  //   () =>
  //     dynamic(() => import('../components/LoginForm'), {
  //       ssr: false,
  //     }),
  //   []
  // )

  const user = useUserContext()

  // useEffect(() => {
  //   if (!user) {
  //     setShowLoginForm(true)
  //   } else {
  //     setShowLoginForm(false)
  //   }
  // }, [user])

  // if (showLoginForm) {
  //   return <LoginForm />
  // }

  if (!user) {
    return <LoginForm />
  }

  return (
    <div>
      <Link href='/posts/new'>Create Post</Link>
    </div>
  )
}

export default Home
