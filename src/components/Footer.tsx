import Link from "next/link";

export default function Footer() {
  return (
    <div className="header-footer">
      <div className="footer-content">
        <Link href="/privacy" className="footer-link">
          Privacy Policy
        </Link>
        <Link href="/terms" className="footer-link">
          Terms of Service
        </Link>
        <span className="footer-link">
          © {new Date().getFullYear()} SummerCamp Bistrò
        </span>
        <Link href="/contact" className="footer-link">
          Contact
        </Link>
      </div>
    </div>
  );
}
