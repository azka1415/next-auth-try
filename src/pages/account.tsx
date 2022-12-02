import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import React from 'react'
import { getServerAuthSession } from '../server/common/get-server-auth-session'

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

export default function Account() {
    return (
        <>
            <Head>
                <title>Account</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div>
                Account
            </div>
        </>
    )
}
