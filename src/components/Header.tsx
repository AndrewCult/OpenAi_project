import Image from "next/image";
import ProfileButton from "./ProfileButton";

export default function Header() {
  return (
    <header className="app-header">
      <div className="header-content">
        {/* Logo */}
        <div className="header-logo">
          <div className="logo-container">
            <Image
              src="/images/Recipe_Chatbot_Logo.jpg"
              alt="Recipe Chatbot Logo"
              width={100}
              height={100}
              className="logo-image"
            />

            <span className="logo-text">Recipe Chatbot</span>
          </div>
        </div>

        {/* Center - Empty for now */}
        <div className="header-center">
          {/* Empty space for future content */}
        </div>

        {/* Profile Icon */}
        <div className="header-profile">
          <ProfileButton />
        </div>
      </div>
    </header>
  );
}
