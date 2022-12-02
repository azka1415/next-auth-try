import React, { useState } from 'react'
import type { GetStaticPropsContext, GetStaticPaths } from 'next';
import type { InferGetStaticPropsType } from 'next';
import { prisma } from '../../server/trpc/context';
import { appRouter } from '../../server/trpc/router/_app';
import superjson from 'superjson';
import { trpc } from '../../utils/trpc';
import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import Link from 'next/link';
import EditModal from '../../components/EditModal';
import { useSession } from 'next-auth/react';


export async function getStaticProps(
    context: GetStaticPropsContext<{ noteId: string }>,
) {
    const ssg = await createProxySSGHelpers({
        router: appRouter,
        ctx: { prisma, session: null },
        transformer: superjson, // optional - adds superjson serialization
    });
    const id = context.params?.noteId as string;
    await ssg.note.getSpecificItem.prefetch({ text: id });
    return {
        props: {
            trpcState: ssg.dehydrate(),
            id,
        },
        revalidate: 1,
    };
}


export const getStaticPaths: GetStaticPaths = async () => {
    const items = await prisma.note.findMany({
        select: {
            id: true,
        },
    });
    return {
        paths: items.map((item) => ({
            params: {
                noteId: item.id,
            },
        })),
        // https://nextjs.org/docs/basic-features/data-fetching#fallback-blocking
        fallback: 'blocking',
    };
};

export default function Note(props: InferGetStaticPropsType<typeof getStaticProps>) {
    const { data: session } = useSession()

    const [open, setOpen] = useState(false)
    const { id } = props
    const postQuery = trpc.note.getSpecificItem.useQuery({ text: id });
    if (postQuery.status !== 'success') {
        // won't happen since we're using `fallback: "blocking"`
        return <>Loading...</>;
    }
    const { data } = postQuery;
    if (!data) return <p>Loading...</p>
    if (session?.user?.id !== data.userId) {
        return (
            <Link href={'/'}>
                Go Back! This does not belong to you
            </Link>
        )
    }

    return (
        <div className='flex w-auto m-2 p-auto'>
            {open && <EditModal open={setOpen} noteId={data.id} />}
            <div className='p-2 text-xl flex flex-col space-y-2'>
                <div className='flex space-x-2'>
                    <p className=''>
                        Note: {data.name}
                    </p>
                    {data.checked ? (
                        <input type="checkbox" checked={true} readOnly={true} />
                    ) : null}
                </div>
                <p>Created: {new Date(data.createdAt).toLocaleString()}</p>
                <p>Last Updated: {new Date(data.updatedAt).toLocaleString()}</p>
                <div className='flex py-2 space-x-4'>

                    <Link href={'/'}>
                        <button className='p-2 bg-gray-600 text-white rounded-lg transition hover:bg-gray-700'>Back</button>
                    </Link>
                    <button className='p-2 bg-blue-600 rounded-lg text-white transition hover:bg-blue-700'
                        onClick={() => setOpen(true)}>Edit</button>
                </div>
            </div>
        </div>
    )
}
