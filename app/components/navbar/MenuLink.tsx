interface CustomMenuLink {
    label: string;
    onClick: () => void;
}
const MenuLink: React.FC<CustomMenuLink> = ({
    label,
    onClick
}) => {
    return (
        <div onClick={onClick} className="px-4 py-2 cursort-pointer hover:bg-gray-300">
            {label}
        </div>
    )
}


export default MenuLink