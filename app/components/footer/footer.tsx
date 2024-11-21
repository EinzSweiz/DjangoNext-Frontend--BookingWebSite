const Footer = () => (
    <footer className="bg-gray-900 text-gray-100 py-6">
    <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
                <p>&copy; 2024 Your Company Name. All Rights Reserved.</p>
            </div>
            <div className="flex space-x-6 mb-4 md:mb-0">
                <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-white">About Us</a>
                <a href="#" className="text-gray-400 hover:text-white">Contact</a>
            </div>
        </div>
        <div className="mt-4 text-center text-gray-500">
            <p>Designed with ❤️ from Baku</p>
        </div>
    </div>
    </footer>

);

export default Footer;
