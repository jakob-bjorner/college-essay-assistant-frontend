import { useSession, signIn, signOut } from "next-auth/react"

export default function LogInBtn() {
    const { data: session, status } = useSession()
    const loading = status === "loading"
    if (session) {
        return (
            <>
                {session?.user && (
                    <>
                        <div>
                            Signed in as {session.user.email} <br />
                        </div>
                        <button onClick={() => signOut()}>Sign out</button>
                    </>
                    )
                }
            </>
        )
    }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}