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
    <div className="grid grid-cols-2 gap-4 content-start ">
      <div>
        Not signed in <br />
      </div>
      <div>
        <button onClick={() => signIn()}>Sign in</button>
      </div>
    </div>
  )
}