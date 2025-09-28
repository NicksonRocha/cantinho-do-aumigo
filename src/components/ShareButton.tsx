"use client";

type Props = {
  className?: string;
  label?: string;
};

export default function ShareButton({ className, label = "Compartilhar" }: Props) {
  async function handleClick() {
    try {
      const url = window.location.href;
      // Tenta Web Share API primeiro (mobile)
      if (navigator.share) {
        await navigator.share({ title: document.title, url });
        return;
      }
      // Fallback: copia para a área de transferência
      await navigator.clipboard.writeText(url);
      alert("Link copiado!");
    } catch {
      // Fallback extremo
      // eslint-disable-next-line no-alert
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
