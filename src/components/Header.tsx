import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import HeaderClient from "./HeaderClient";

export default async function Header() {
  const session = await getServerSession(authOptions);
  const isAuthed = Boolean(session?.user?.email);
  const email = session?.user?.email ?? "";
  const role = session?.role;
  const isAdmin = role === "ADMIN";

  return (
  <header className="border-b border-gray-200 bg-white shadow-xl transition-shadow duration-200 hover:shadow-lg">
      {/* Header: volle breedte, padding via px-4/sm:px-6 */}
      <div className="w-full px-4 sm:px-6 py-5">
        {/* HeaderClient is clientcomponent voor responsive navigatie */}
        {/* Krijgt auth-state zodat server sessie kan ophalen */}
        <HeaderClient isAuthed={isAuthed} email={email} isAdmin={isAdmin} />
      </div>
    </header>
  );
}
