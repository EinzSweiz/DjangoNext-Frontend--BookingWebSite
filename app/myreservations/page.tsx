import Image from "next/image"

const MyReservationsPage = () => {
    return (
        <main className="max-w-[2000px] mx-auto px-6 pb-6">
            <h1 className="my-6 text-2xl"> My reservations</h1>
            <div className="space-y-4">
                <div className="p-5 grid grid-cols-1 md:grid-cols-4 gap-4 shadow-md border border-gray-400 rounded-xl">
                    <div className="col-span-1">
                        <div className="relative overflow-hidden aspect-square rounded-xl">
                            <Image fill src="/beach_1.jpg" alt="Beach-House" className="hover:scale-110 object-cover transition h-[100px] w-[100px]"></Image>
                        </div>
                    </div>
                    <div className="col-span-1 md:col-span-3 flex flex-col">
                        <h2 className="mb-4 text-xl">Property Name</h2>
                        <p><strong>Check in date:</strong> 14/2/2024</p>
                        <p><strong>Check out date:</strong> 16/2/2024</p>
                        <p><strong>Number of nights:</strong> 2</p>
                        <p><strong>Total price:</strong> $200</p>
                        <div className="mt-auto flex justify-end">
                            <div className="mt-6 inline-block cursor-pointer py-2 px-6 text-white bg-airbnb rounded-xl hover:bg-airbnb-dark">
                                Go to property
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-5 grid grid-cols-1 md:grid-cols-4 gap-4 shadow-md border border-gray-400 rounded-xl">
                    <div className="col-span-1">
                        <div className="relative overflow-hidden aspect-square rounded-xl">
                            <Image fill src="/beach_1.jpg" alt="Beach-House" className="hover:scale-110 object-cover transition h-[100px] w-[100px]"></Image>
                        </div>
                    </div>
                    <div className="col-span-1 md:col-span-3 flex flex-col">
                        <h2 className="mb-4 text-xl">Property Name</h2>
                        <p className="mb-2"><strong>Check in date:</strong> 14/2/2024</p>
                        <p className="mb-2"><strong>Check out date:</strong> 16/2/2024</p>
                        <p className="mb-2"><strong>Number of nights:</strong> 2</p>
                        <p className="mb-2"><strong>Total price:</strong> $200</p>
                        <div className="mt-auto flex justify-end">
                            <div className="mt-6 inline-block cursor-pointer py-2 px-6 text-white bg-airbnb rounded-xl hover:bg-airbnb-dark">
                                Go to property
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default MyReservationsPage
