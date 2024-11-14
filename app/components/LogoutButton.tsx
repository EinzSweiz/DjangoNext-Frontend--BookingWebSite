'use client'

import { useRouter } from "next/navigation"

import MenuLink from "./navbar/MenuLink"
import { resetAuthCookies } from "../lib/actions"


const LogoutButton: React.FC = () => {
    const router = useRouter()
    const submitLogout = async () => {
        resetAuthCookies()
        router.push('/')
    }
    return (
        <MenuLink 
        label="Logout"
        onClick={submitLogout} />
    )
}
export default LogoutButton