import { useLocation } from "wouter";
import { Home, Sparkles, Clock, User } from "lucide-react";

const NAV_ITEMS = [
  { path: "/", label: "Home", icon: Home },
  { path: "/skills", label: "Skills", icon: Sparkles },
  { path: "/history", label: "History", icon: Clock },
  { path: "/profile", label: "Profile", icon: User },
];

export default function NavBar() {
  const [location, navigate] = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && (location === "/" || location === "/home")) return true;
    return location === path;
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 w-full"
      data-testid="nav-bar"
    >
      <div
        style={{
          background: 'var(--fq-frost-deep)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid var(--fq-border)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        <div className="flex items-center">
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
            const active = isActive(path);
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                aria-label={label}
                className="flex-1 flex flex-col items-center justify-center py-3 transition-all duration-200 cursor-pointer"
                data-testid={`nav-${label.toLowerCase()}`}
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                }}
              >
                <Icon
                  size={20}
                  style={{
                    color: active ? 'var(--fq-xp-bright)' : 'var(--fq-xp)',
                    filter: active ? 'drop-shadow(0 0 6px rgba(212,168,75,0.6))' : 'none',
                    transition: 'all 0.2s',
                  }}
                />
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
