
import { stat } from "fs";
import React, { useState } from "react";
  
interface StatusDisplayProps {
    status: string;
    showStatusDetails: boolean;
    toggleStatusDetails: () => void;
    createdAt: Date;
    updatedAt: Date;
    userRole: string;
    onStatusChange: (newStatus: string) => void;
}

const StatusDisplay: React.FC<StatusDisplayProps> = ({
    status,
    showStatusDetails,
    toggleStatusDetails,
    createdAt,
    updatedAt,
    userRole,
    onStatusChange,
}) => {
    console.log("Rendering StatusDisplay component");
    console.log(`Current status: ${status}`);
    console.log(`User role: ${userRole}`);
    const [editableStatus, setEditableStatus] = useState<string>(status);
    const handleChangeStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;
        setEditableStatus(newStatus);
        onStatusChange(newStatus);
    };
    
    return (
        <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
                {['customer_service', 'admin'].includes(userRole) ? (
                    <div>
                        <p className="font-semibold"><strong>Status:</strong></p>
                        <select
                            value={editableStatus}
                            onChange={handleChangeStatus}
                            className="mt-2 p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-300"
                        >
                            <option value="active">Active</option>
                            <option value="pending">Pending</option>
                            <option value="resolved">Resolved</option>
                        </select>
                    </div>
                ) : (
                    <p className="font-semibold"><strong>Status:</strong> {status}</p>
                )}
                <button
                    onClick={toggleStatusDetails}
                    className="mt-3 px-5 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition duration-300"
                >
                    {showStatusDetails ? 'Hide Details' : 'Show Details'}
                </button>
            </div>
            {showStatusDetails && (
                <div className="mt-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                    <p className="text-gray-800 dark:text-gray-200">
                        <strong>Created At:</strong> {new Date(createdAt).toLocaleString()}
                    </p>
                    <p className="text-gray-800 dark:text-gray-200">
                        <strong>Updated At:</strong> {new Date(updatedAt).toLocaleString()}
                    </p>
                </div>
)}
        </div>
    );
};

export default StatusDisplay