"use client";

import { useState, useRef, useEffect } from "react";
import MenuLink from "./MenuLink";
import useLoginModal from "@/app/hooks/useLoginModal";
import useSignupModal from "@/app/hooks/useSignupModal";
import LogoutButton from "../LogoutButton";
import { useRouter } from "next/navigation";
import useContactModal from "@/app/hooks/useContactModal";
import useProfileModal from "@/app/hooks/useProfileModal";

interface UserNavProps {
  userId?: string | null;
}

const UserNav: React.FC<UserNavProps> = ({ userId }) => {
  const profileModal = useProfileModal();
  const loginModal = useLoginModal();
  const signupModal = useSignupModal();
  const contactModal = useContactModal();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const handleOutsideClick = (e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    // Add event listener when the menu is open
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    // Cleanup listener when component unmounts or menu state changes
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  
  return (
    <div className="p-2 relative inline-block border rounded-full dark:bg-gray-800 dark:border-gray-700">
      <button
        className="flex items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Hamburger Menu Icon */}
        <svg
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6 dark:text-white"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
        {/* User Icon */}
        <svg
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6 dark:text-white"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="w-[220px] absolute top-[40px] right-0 bg-white border rounded-xl shadow-md flex flex-col cursor-pointer dark:bg-gray-800 dark:border-gray-700" ref={dropdownRef}>
          {userId ? (
            <>
              <MenuLink
                label="Profile"
                icon={
                  <img width="32" height="32" src="https://img.icons8.com/external-flat-circle-design-circle/32/external-Profile-Avatar-web-and-networking-flat-circle-design-circle.png" alt="external-Profile-Avatar-web-and-networking-flat-circle-design-circle"/>
                  
                }
                onClick={() => {
                  setIsOpen(false);
                  profileModal.open();
                }}
              />
                <MenuLink
                label="Your Inquiries"
                icon={
                  <img width="32" height="32" src="https://img.icons8.com/color/48/why-us-male--v1.png" alt="why-us-male--v1"/>
                  
                }
                onClick={() => {
                  setIsOpen(false);
                  router.push('/myinquiries')
                }}
              />
              <MenuLink
                label="Inbox"
                icon={
                  <img width="32" height="32" src="https://img.icons8.com/fluency/32/download-mail.png" alt="download-mail"/>
                  
                }
                onClick={() => {
                  setIsOpen(false);
                  router.push("/inbox");
                }}
              />
              <MenuLink
                label="My Properties"
                icon={
                  <img width="32" height="32" src="https://img.icons8.com/external-flaticons-lineal-color-flat-icons/32/external-properties-investing-flaticons-lineal-color-flat-icons.png" alt="external-properties-investing-flaticons-lineal-color-flat-icons"/>
                }
                onClick={() => {
                  setIsOpen(false);
                  router.push("/myproperties");
                }}
              />
              <MenuLink
                label="My Reservations"
                icon={
                  <img width="32" height="32" src="https://img.icons8.com/stickers/32/reservation-2.png" alt="reservation-2"/>
                }
                onClick={() => {
                  setIsOpen(false);
                  router.push("/myreservations");
                }}
              />
              <MenuLink
                label="My Favorites"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0 0 64 64">
                  <path fill="#fd3c4f" d="M46.676,54.599L33.205,44.87c-0.715-0.517-1.685-0.503-2.386,0.033l-12.662,9.683	C16.865,55.574,15,54.652,15,53.025V11c0-2.209,1.791-4,4-4h27c2.209,0,4,1.791,4,4v41.899C50,54.61,48.062,55.601,46.676,54.599z"></path><path d="M45,38v7.265c0,0.816-0.924,1.288-1.586,0.811l-1.308-0.945c-2.24-1.615-5.365-1.113-6.981,1.126l0,0	l11.551,8.342C48.062,55.601,50,54.61,50,52.899V33C47.238,33,45,35.238,45,38z" opacity=".15"></path><ellipse cx="32" cy="61" opacity=".3" rx="20.125" ry="3"></ellipse><path fill="#fff" d="M15,11v18c2.762,0,5-2.238,5-5V12.652c0-0.42,0.264-0.795,0.66-0.934 C22.605,11.033,24,9.18,24,7h-5C16.791,7,15,8.791,15,11z" opacity=".3"></path><line x1="18.5" x2="18.5" y1="12.5" y2="19.5" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="3"></line><path fill="#ffce29" d="M51.544,22.992l2.419,4.902l5.409,0.786c1.459,0.212,2.042,2.005,0.986,3.034l-3.914,3.815	l0.924,5.388c0.249,1.453-1.276,2.561-2.581,1.875l-4.838-2.544l-4.838,2.544c-1.305,0.686-2.83-0.422-2.581-1.875l0.924-5.388	l-3.914-3.815c-1.056-1.029-0.473-2.822,0.986-3.034l5.409-0.786l2.419-4.902C49.006,21.669,50.891,21.669,51.544,22.992z"></path>
                  </svg>
                  
                }
                onClick={() => {
                  setIsOpen(false);
                  router.push("/myfavorites");
                }}
              />
              <MenuLink
                label="Contact Us"
                icon={
                  <img width="32" height="32" src="https://img.icons8.com/cotton/32/phone-bubble--v2.png" alt="phone-bubble--v2"/>
                }
                onClick={() => {
                  setIsOpen(false);
                  contactModal.open();
                }}
              />             
              <LogoutButton icon={
                <img width="32" height="32" src="https://img.icons8.com/arcade/32/exit.png" alt="exit"/>
              
              } closeMenu={() => setIsOpen(false)} />
            </>
          ) : (
            <>
              <MenuLink
                label="Login"
                icon={
                  <img width="32" height="32" src="https://img.icons8.com/external-kmg-design-outline-color-kmg-design/32/external-login-real-estate-kmg-design-outline-color-kmg-design.png" alt="external-login-real-estate-kmg-design-outline-color-kmg-design"/>
                  
                }
                onClick={() => {
                  setIsOpen(false);
                  loginModal.open();
                }}
              />
              <MenuLink
                label="Sign up"
                icon={
                  <img width="32" height="32" src="https://img.icons8.com/external-flaticons-lineal-color-flat-icons/32/external-sign-up-web-store-flaticons-lineal-color-flat-icons-3.png" alt="external-sign-up-web-store-flaticons-lineal-color-flat-icons-3"/>
                  
                }
                onClick={() => {
                  setIsOpen(false);
                  signupModal.open();
                }}
              />
               <MenuLink
                label="Contact Us"
                icon={
                  <img width="32" height="32" src="https://img.icons8.com/cotton/32/phone-bubble--v2.png" alt="phone-bubble--v2"/>

                
                  
                }
                onClick={() => {
                  setIsOpen(false);
                  contactModal.open();
                }}
              />             

            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UserNav;
