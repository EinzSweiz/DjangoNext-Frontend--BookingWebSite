'use client'
import useLoginModal from "../hooks/useLoginModal"
import { useRouter } from "next/navigation"
import apiService from "../services/apiService"
interface ContactButtonProps {
    userId?: string | null
    landlordId: string
    className: string
}
const ContactButton: React.FC<ContactButtonProps> = ({
    className,
    userId,
    landlordId
}) => {
    const loginModal = useLoginModal()
    const router = useRouter()

    const startConversation = async () => {
        if (userId) {
            const conversation = await apiService.getWithToken(`/api/chat/start/${landlordId}/`);
            if (conversation && conversation.conversation_id) {
                router.push(`/inbox/${conversation.conversation_id}`);
            } else {
                console.error("Invalid conversation response:", conversation);
            }
        } else {
            loginModal.open();
        }
    };
    

    return (
        <div 
        onClick={startConversation}
        className="cursor-pointer mt-6 flex py-2 px-6 bg-airbnb text-white rounded-xl hover:bg-airbnb-dark transition">
            Contact
        </div>
    )
}

export default ContactButton;