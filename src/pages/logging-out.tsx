import type { GetServerSideProps } from "next"
import { getServerAuthSession } from "../server/common/get-server-auth-session"

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getServerAuthSession(context)

    if (!session) {
        return {
            redirect: {
                destination: '/login',
                permanent: false
            }
        }
    }

    return {
        props: {
            session
        }
    }

}
export default function LogOut() {
    return (
        <div>Logging-out...</div>
    )
}
