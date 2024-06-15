import React from 'react'
import Head from 'next/head'
import UserDashboard from '@/layouts/UserDashboard'
import UserInfo from '@/components/users/UserManagement'

export default function UserManagement () {
    const title = "User Manage"

    return (
        <>
        <Head>
            <title>{title}</title>
        </Head>
        <UserDashboard title={title}>
            <main className='pt-20'>
                <UserInfo />
            </main>
        </UserDashboard>
        </>
    )
}