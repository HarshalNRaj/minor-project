import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft hover:text-primary-500"
      aria-label="Go back"
    >
      <ArrowLeft size={15} />
      Back
    </button>
  );
}
