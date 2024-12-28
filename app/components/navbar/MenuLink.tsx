interface MenuLinkProps {
    label: React.ReactNode;
    icon?: React.ReactNode; // Optional icon prop
    onClick: () => void;
  }
  
  const MenuLink: React.FC<MenuLinkProps> = ({ label, icon, onClick }) => {
    return (
      <div
        className="flex items-center p-2 hover:bg-gray-100"
        onClick={onClick}
      >
        {icon && <span className="mr-2">{icon}</span>}
        <span>{label}</span>
      </div>
    );
  };
  
  export default MenuLink;
  