import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { syncUser } from "@/actions/user.actions"
import { ConfessionForm } from "@/components/ConfessionForm";

// pour creation d'une nouvelle confession avec un formulaire
export default async function NewConfessionPage(){

    const { userId } = await auth(); // verification de connexion
    if(!userId) {
        redirect("/sign-in");
    }

    await syncUser();


    return(
        <main className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6 text-gray-100">Nouvelle confession</h1>
            <p className="mb-4 text-gray-300">Liberez votre conscience de developpeur !</p>
            <ConfessionForm />
        </main>
    )
}