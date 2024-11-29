


interface ResponseTextareaProps {
    handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
    handleSave: () => void
}

const ResponseTextarea: React.FC<ResponseTextareaProps> = ({
    handleChange,
    handleSave,
}) => (
    <div>
        <textarea
            className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-300"
            placeholder="Type your response here..."
            onChange={handleChange}
        />
        <button
            onClick={handleSave}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
        >
            Save Response
        </button>
    </div>
);

export default ResponseTextarea


