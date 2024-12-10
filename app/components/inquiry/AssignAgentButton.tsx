import React, { useState, useEffect } from "react";
import apiService
 from "@/app/services/apiService";
interface AgentDisplayProps {
    agent: string;
    toggleStatusDetails: () => void;
    userRole: 'user' | 'customer_service' | 'admin';
    onAgentChange: (newAgent: string) => void;
}

const AgentDisplay: React.FC<AgentDisplayProps> = ({
    agent,
    toggleStatusDetails,
    userRole,
    onAgentChange,
}) => {
    const [agents, setAgents] = useState<{ id: string; name: string }[]>([]);
    const [selectedAgent, setSelectedAgent] = useState<string>(agent);

    // Fetch agents when the component mounts
    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const response = await apiService.get("api/inquiries/customer-service-agents/"); // Adjust the endpoint as needed.
                setAgents(response.data);
            } catch (error) {
                console.error("Failed to fetch customer service agents:", error);
            }
        };

        if (userRole === "admin") {
            fetchAgents();
        }
    }, [userRole]);

    const handleAgentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newAgent = e.target.value;
        setSelectedAgent(newAgent);
        onAgentChange(newAgent);
    };

    return (
        <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
                {userRole === "admin" ? (
                    <div>
                        <p className="font-semibold"><strong>Agent:</strong></p>
                        <select
                            value={selectedAgent}
                            onChange={handleAgentChange}
                            className="mt-2 p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-300"
                        >
                            <option value="">Select an Agent</option>
                            {agents.map((agent) => (
                                <option key={agent.id} value={agent.id}>
                                    {agent.name}
                                </option>
                            ))}
                        </select>
                    </div>
                ) : (
                    <p className="font-semibold"><strong>Agent:</strong> {agent}</p>
                )}
            </div>
        </div>
    );
};

export default AgentDisplay;
