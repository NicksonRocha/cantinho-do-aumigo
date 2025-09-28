"use client";

import { useRef } from "react";

type DeletePetButtonProps = {
  petId: number;
  action: (formData: FormData) => void | Promise<void>; 
  className?: string;
};

export default function DeletePetButton({
  action,
  className,
}: DeletePetButtonProps) {
  const formRef = useRef<HTMLFormElement>(null);

  function handleClick() {
    const ok = confirm("Tem certeza que deseja deletar este post? Essa ação não pode ser desfeita.");
    if (ok) formRef.current?.requestSubmit();
  }

  return (
    <form ref={formRef} action={action}>
  
      <button
        type="button"
        onClick={handleClick}
        className={className ?? "px-4 py-2 rounded-xl bg-red-100 text-white hover:opacity-90 transition"}
      >
        Deletar
      </button>
    </form>
  );
}
