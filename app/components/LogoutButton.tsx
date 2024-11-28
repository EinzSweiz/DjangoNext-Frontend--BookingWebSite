'use client';

import { useRouter } from 'next/navigation';
import MenuLink from './navbar/MenuLink';
import { resetAuthCookies } from '../lib/actions';
import useLoginModal from '../hooks/useLoginModal';


interface LogoutButtonProps {
    closeMenu: () => void
    icon?: React.ReactNode;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({
    closeMenu,
    icon
}) => {
    const router = useRouter();
    const loginModal = useLoginModal();

    const submitLogout = async () => {
        resetAuthCookies(); // Reset authentication cookies
        loginModal.close();
        closeMenu()
        router.push('/');   // Redirect to the home page
        setTimeout(() => {
            window.location.reload()
        }, 200)
    };

    return (
        <MenuLink
            icon={icon}
            label="Logout" 
            onClick={submitLogout} 
        />
    );
};

export default LogoutButton;
