'use client'
import React, { useState, useEffect } from "react";
import apiService from "@/app/services/apiService";

interface AgentDisplayProps {
    agent: string;
    onAgentChange: (newAgent: string) => void;
    userRole: string;
}

const AgentDisplay: React.FC<AgentDisplayProps> = ({
    agent,
    onAgentChange,
    userRole
}) => {
    const [agents, setAgents] = useState<{ id: string; name: string; email: string }[]>([]);
    const [selectedAgent, setSelectedAgent] = useState<string>(agent || "");

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const response = await apiService.getWithToken("/api/inquiries/customer-service-agents/");
                console.log("Full response:", response);  // Log the full response object
                console.log("Agents fetched:", response.data);  // Check if the data is available here
                setAgents(response || []);  // Fallback to an empty array if data is undefined
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
                {userRole === "admin" ? (
                    <div>
                        <p className="font-semibold"><strong>Assign Agent:</strong></p>
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
                    <div>
                        <p className="font-semibold"><strong>Assigned Agent:</strong></p>
                        <p className="mt-2">{agents.find((a) => a.id === agent)?.name || "Unassigned"}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AgentDisplay;
