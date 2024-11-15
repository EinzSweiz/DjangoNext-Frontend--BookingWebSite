import ReservationSidebar from "@/app/components/properties/ReservationSidebar";
import Image from "next/image";
import apiService from "@/app/services/apiService";

const PropertyDetailPage = async ({params}: {params: {id:string}}) => {
  const property = await apiService.get(`/api/properties/${params.id}/`)
  return (
    <main className="max-w-[2000px] mx-auto px-6 min-h-screen">
      <div className="w-full h-[64vh] mb-4 overflow-hidden rounded-xl relative">
        <Image
          fill
          src={property.image_url}
          alt="Beach-Image"
          className="object-cover w-full h-full"
        ></Image>
      </div>
      <div className="mt-4 flex flex-col md:flex-row gap-4 min-h-[calc(100vh-64vh)]">
        <div className="py-6 pr-6 flex-1">
          <h1 className="mb-4 text-4xl"> {property.title} </h1>
          <span className="mb-6 block text-lg text-gray-600">
            {property.guests} guests - {property.bedrooms} bedrooms - {property.bathrooms} bathroom
          </span>
          <hr />

          <div className="py-6 flex items-center space-x-4">
            {property.landlord.avatar_url && (
            <Image
              src={property.landlord.avatar_url}
              width={80}
              height={80}
              className="rounded-full"
              alt="Profile-Image"
            ></Image>
          )}
            <p>
              <strong>{property.landlord.name}</strong> is your host
            </p>
          </div>
          <hr />
          <p className="mt-6 text-lg">
            {property.description}
          </p>
        </div>
        <div className="w-full md:w-2/5">
          <ReservationSidebar property={property}/>
        </div>
      </div>
    </main>
  );
};

export default PropertyDetailPage;
