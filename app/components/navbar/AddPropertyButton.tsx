"use client"
import useLoginModal from "@/app/hooks/useLoginModal";
import AddPropertyModal from "../modals/AddPropertyModal";
import usePropertyModal from "@/app/hooks/usePropertyModal";

interface AddPropertyButtonProps {
    userid?: string | null
}

const AddPropertyButton: React.FC<AddPropertyButtonProps> = ({
    userid
}) => {
    const addPropertyModal = usePropertyModal()
    const loginModal = useLoginModal()
    const airbnbYouHome = () => {
        if (userid){
            addPropertyModal.open()
        } else {
            loginModal.open()
        }
    }
    return (
        <div 
        onClick={airbnbYouHome}
        className="cursor-pointer p-2 text-sm font-semibold rounded-full hover:bg-gray-200">
            Let us care of your Trips!
        </div>
    )
}

export default AddPropertyButton;