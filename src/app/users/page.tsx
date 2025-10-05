import prisma from "@/app/lib/client";

export default async function UserDetail({
    params
}: {params: Promise<{id: string}> }) {
    const p = await params;
    const user = await prisma.user.findUnique({
        where: { 
            id: parseInt(p.id, 10) 
            }
        });
        console.log(user);

        if (user === null) {
            return <div>User with id {p.id} not found</div>
        }

        return <div>This is the detail page for user {user.name}</div>
    }