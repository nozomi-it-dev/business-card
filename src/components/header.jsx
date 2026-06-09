import { Lock, LockOpen, X } from "lucide-react";

function Header({ isAuthorized, onLockClick, onClose }) {
  return (
    <div className="header">
      <img src="/logo.png" alt="Nozomi logo" className="header-logo" />
      <div>
        <p className="header-name">Nozomi</p>
        <p className="header-sub">Business Cards</p>
      </div>
      {onClose && (
        <button className="header-lock" onClick={onClose}>
          <X size={20} />
        </button>
      )}
      {onLockClick && !onClose && (
        <button className="header-lock" onClick={onLockClick}>
          {isAuthorized ? <LockOpen size={20} /> : <Lock size={20} />}
        </button>
      )}
    </div>
  );
}

export default Header;
