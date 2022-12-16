import dynamic from 'next/dynamic'
import { useMemo } from 'react'

function LoginPage() {
  const LoginForm = useMemo(
    () =>
      dynamic(() => import('../components/LoginForm'), {
        ssr: false,
      }),
    []
  )

  return (
    <div>
      <LoginForm />
    </div>
  )
}

export default LoginPage
