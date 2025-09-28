"use client";

type Props = {
  className?: string;
  label?: string;
};

export default function ShareButton({ className, label = "Compartilhar" }: Props) {
  async function handleClick() {
    try {
      const url = window.location.href;
      if (navigator.share) {
        await navigator.share({ title: document.title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      alert("Link copiado!");
    } catch {
      prompt("Copie o link da página:", window.location.href);
    }
  }

  return (
    <button
      onClick={handleClick}
      className={className}
      type="button"
    >
      {label}
    </button>
  );
}
