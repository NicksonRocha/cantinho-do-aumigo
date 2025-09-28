import Image from "next/image";
import Link from "next/link";
import { auth, signOut } from "../../auth";

export default async function Navbar() {
  const session = await auth();
  return (
    <nav className="text-lg bg-primary text-neutral px-6 py-4 flex items-center justify-between shadow-md">
      {/* Logo */}
       <Link href="/" className="flex items-center gap-2">
        <Image
          src="/logo.png"   // caminho relativo à pasta public
          alt="Cantinho do AUmigo"
          width={50}        // largura em px
          height={50}       // altura em px
          priority          // carrega a logo primeiro
        />
      </Link>
   
  {session ? (
        <div>
          <div className="absolute left-1/2 -translate-x-1/2 flex gap-6">
            <Link href="/adotar" className="p-[5px] rounded-[5px] hover:text-highlight hover:bg-neutral transition">
              Criar post
            </Link>
            <Link href="/meus-posts" className="p-[5px] rounded-[5px] hover:text-highlight hover:bg-neutral transition">
              Meus posts
            </Link>
          </div>
          
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" }); // volta pra home após sair
            }}
          >
            <div className="flex justify-end gap-4 pr-4 ">
              <button className="p-[5px] rounded-[5px] hover:text-highlight hover:bg-neutral transition cursor-pointer">
                Sair
              </button>
            </div>
            
          </form>
        </div>
      ) : (
        <div>

          <div className="absolute left-1/2 -translate-x-1/2 flex gap-6">
            <Link href="/about" className="p-[5px] rounded-[5px] hover:text-highlight hover:bg-neutral transition">
              Sobre
            </Link>
            <Link href="/adopt" className="p-[5px] rounded-[5px] hover:text-highlight hover:bg-neutral transition">
              Adotar
            </Link>
            <Link href="/contact" className="p-[5px] rounded-[5px] hover:text-highlight hover:bg-neutral transition">
              Contato
            </Link>
          </div>

          <div className="flex justify-end gap-4 pr-4">
            <Link href="/entrar" className="p-[5px] rounded-[5px] hover:text-highlight hover:bg-neutral transition">
              Entrar
            </Link>
          </div>


        </div>
        
      )}
    </nav>
  );
}
