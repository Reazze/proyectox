import { ArrowUp } from "lucide-react"

export default function ScrollToTopButton() {

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <button
      onClick={scrollToTop}
      style={{
        position: "fixed",
        left: "95%",
        bottom: "20px",
        zIndex: 9999,
        width: "55px",
        height: "55px",
        borderRadius: "50%",
        border: "none",
        background: "#2563eb",
        color: "white",
        cursor: "pointer",
        boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
      }}
    >
      <ArrowUp size={24} />
    </button>
  )
}