import ReservationSidebar from "@/app/components/properties/ReservationSidebar";
import Image from "next/image";

const PropertyDetailPage = () => {
  return (
    <main className="max-w-[2000px] mx-auto px-6 min-h-screen">
      <div className="w-full h-[64vh] mb-4 overflow-hidden rounded-xl relative">
        <Image
          fill
          src="/beach_1.jpg"
          alt="Beach-Image"
          className="object-cover w-full h-full"
        ></Image>
      </div>
      <div className="mt-4 flex flex-col md:flex-row gap-4 min-h-[calc(100vh-64vh)]">
        <div className="py-6 pr-6 flex-1">
          <h1 className="mb-4 text-4xl"> Property Name </h1>
          <span className="mb-6 block text-lg text-gray-600">
            4 guests - 2 bedrooms - 1 bathroom
          </span>
          <hr />

          <div className="py-6 flex items-center space-x-4">
            <Image
              src="/images.jpeg"
              width={80}
              height={80}
              className="rounded-full"
              alt="Profile-Image"
            ></Image>
            <p>
              <strong>Raid Suline</strong> is your host
            </p>
          </div>
          <hr />
          <p className="mt-6 text-lg">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Suscipit
            consequatur quaerat quos consectetur error dolor necessitatibus
            facere iste a fugiat maxime vero sequi ratione nihil, totam non
            velit eaque impedit.
          </p>
        </div>
        <div className="w-full md:w-2/5">
          <ReservationSidebar />
        </div>
      </div>
    </main>
  );
};

export default PropertyDetailPage;
