'use client';

import { useRouter } from 'next/navigation';
import MenuLink from './navbar/MenuLink';
import { resetAuthCookies } from '../lib/actions';
import useLoginModal from '../hooks/useLoginModal';


interface LogoutButtonProps {
    closeMenu: () => void
}

const LogoutButton: React.FC<LogoutButtonProps> = ({
    closeMenu
}) => {
    const router = useRouter();
    const loginModal = useLoginModal();

    const submitLogout = async () => {
        resetAuthCookies(); // Reset authentication cookies
        loginModal.close();
        closeMenu()
        router.push('/');   // Redirect to the home page
    };

    return (
        <MenuLink 
            label="Logout" 
            onClick={submitLogout} 
        />
    );
};

export default LogoutButton;
