import React, { useState, useEffect } from "react";
import apiService from "@/app/services/apiService";

interface AgentDisplayProps {
    agent: string;
    toggleStatusDetails: () => void;
    onAgentChange: (newAgent: string) => void;
}

const AgentDisplay: React.FC<AgentDisplayProps> = ({
    agent,
    toggleStatusDetails,
    onAgentChange,
}) => {
    const [agents, setAgents] = useState<{ id: string; name: string }[]>([]);
    const [selectedAgent, setSelectedAgent] = useState<string>(agent);

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const response = await apiService.getWithToken("/api/inquiries/customer-service-agents/");
                console.log("Agents fetched:", response.data); // Debugging
                setAgents(response.data || []); // Fallback to empty array if data is undefined
            } catch (error) {
                console.error("Failed to fetch customer service agents:", error);
            }
        };

        fetchAgents(); // Fetch agents without checking role
    }, []);

    const handleAgentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newAgent = e.target.value;
        setSelectedAgent(newAgent);
        onAgentChange(newAgent);
    };

    return (
        <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
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
            </div>
        </div>
    );
};

export default AgentDisplay;
