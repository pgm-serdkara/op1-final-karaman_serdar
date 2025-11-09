import prisma from "@/lib/client";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { Role } from "@/app/_generated/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nieuwe gebruiker",
  description: "Maak een nieuwe gebruiker aan (alleen voor beheerders) in The Grand Library.",
};


export default function NewUserPage() {
  async function createUser(formData: FormData) {
    "use server";

    const hashedPassword = await bcrypt.hash(formData.get("password") as string, 10);

    const rawFormData = {
      email: (formData.get("email") as string) ?? "",
      hashedPassword,
      role: formData.get("role") as Role,
    };

    try {
      await prisma.user.create({
            data: rawFormData
        });
        
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Failed to create user");
    }
  redirect("/users");
  }



    return (
    <form action={createUser}>
        <div>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" />
        </div>
        <div>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password"/>
        </div>

        <select name="role">
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
        </select>
        <button type="submit">Submit</button>
    </form>
  );
}