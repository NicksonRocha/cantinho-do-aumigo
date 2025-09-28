import Image from "next/image";
import Link from "next/link";
import { auth, signOut } from "../../auth";

export default async function Navbar() {
  const session = await auth();
  return (
    <nav className="text-lg bg-primary text-neutral px-6 py-4 flex items-center justify-between shadow-md">

       <Link href="/" className="flex items-center gap-2">
        <Image
          src="/logo.png"   
          alt="Cantinho do AUmigo"
          width={50}        
          height={50}       
          priority          
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
              await signOut({ redirectTo: "/" }); 
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
             <h1 className="text-2xl md:text-3xl lg:text-2xl font-bold tracking-wide">
              Cantinho Do AUmigo
              </h1>
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
