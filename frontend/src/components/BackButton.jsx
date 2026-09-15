import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BackButton({ fallback = "/" }) {
  const navigate = useNavigate();

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  };

  return (
    <button
      type="button"
      onClick={goBack}
      className="inline-flex items-center gap-2 text-sm font-semibold text-ink-soft transition-colors hover:text-primary-600"
      aria-label="Go back"
    >
      <ArrowLeft size={18} />
      Back
    </button>
  );
}
