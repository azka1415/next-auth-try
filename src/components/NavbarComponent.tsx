import { Button, Menu, MenuHandler, MenuList, } from '@material-tailwind/react'
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import type { ReactNode } from 'react';
import { useState } from 'react';

interface Props {
    children: ReactNode
}

export default function Navbar({ children }: Props) {
    const { data: session } = useSession()
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const handleSignOut = () => {
        signOut()
        router.push('/logging-out')
    }
    const handlerDialog = () => {
        setOpen(false)
    }

    return (
        <nav className="flex space-x-4 sticky top-0 z-30 bg-white p-1 ">
            <div className="flex space-x-2 items-center justify-start">
                <h2 className="text-2xl font-semibold">Notes</h2>
            </div>
            <div className='justify-start items-center w-full hidden lg:flex space-x-2'>
                {children}
            </div>

            <div className="flex w-full px-2 justify-end items-center space-x-4">
                {session?.user?.image ?
                    <Image src={session?.user?.image} width={35} height={35} alt='user profile picture' className="rounded-lg" /> : null
                }
                <h2 className="font-bold hidden lg:flex">{session?.user?.name}</h2>
                <Button size="sm" color="blue-gray" className="p-2" onClick={handleSignOut}>Sign Out</Button>
            </div>

            <div className='flex justify-center items-center text-center'>

                <Menu>
                    <MenuHandler>
                        <Button className='' size='sm'>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </Button>
                    </MenuHandler>
                    <MenuList className='flex flex-col space-y-2'>
                        {children}
                    </MenuList>
                </Menu>
            </div>

        </nav>
    )
}
