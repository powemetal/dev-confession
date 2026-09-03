"use server"

import { Emoji } from "@/generated/prisma/enums";
import { getCurrentUser } from "./user.actions";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function reagir(confessionId: string, emoji: Emoji){
    const user = await getCurrentUser();

    if (!user) {
        throw new Error ("Connectez vous pour réagir !")
    }

    const result = await prisma.$transaction(async (tx) => {


        const existingReaction = await tx.reaction.findUnique({
            where: {
                userId_confessionId_emoji: {
                    userId: user.id,
                    confessionId,
                    emoji,
                }
            }
        })

        /**---Cas 1, Reaction existante */
        if(existingReaction){
            await tx.reaction.delete({where: {id: existingReaction.id}})
            return { action: "Supprimer Reaction"}
        }
        

        /**---Cas 2, Reaction n'existe pas */
        if(!existingReaction){
            await tx.reaction.create({
                data: {
                    userId : user.id,
                    emoji,
                    confessionId
                }
            });

            return { action: "Ajout reaction" }

        }
})

    revalidatePath("/")
    revalidatePath("/confessions")

    return result;
}

export async function getReactionCounts(confessionId: string) {
    const reactions = await prisma.reaction.groupBy({
        by: ["emoji"],
        where: {confessionId},
        _count: {emoji:true}
    })

    return reactions.reduce((acc, r) => ({...acc, [r.emoji] : r._count.emoji}), 
    {} as Record<Emoji, number>)
}