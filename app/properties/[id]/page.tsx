import { GetServerSideProps } from "next";  // Import GetServerSideProps
import ReservationSidebar from "@/app/components/properties/ReservationSidebar";
import Image from "next/image";
import apiService from "@/app/services/apiService";
import { getUserId } from "@/app/lib/actions";
import Link from "next/link";

const PropertyDetailPage = ({ property, userId }: { property: any; userId: string }) => {
  return (
    <main className="max-w-[1500px] mx-auto px-6 pb-6">
      <div className="w-full h-[64vh] mb-4 overflow-hidden rounded-xl relative">
        <Image
          fill
          src={property.image_url}
          className="object-cover w-full h-full"
          alt="Beach house"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="py-6 pr-6 col-span-3">
          <h1 className="mb-4 text-4xl">{property.title}</h1>
          <span className="mb-6 block text-lg text-gray-600">
            {property.guests} guests - {property.bedrooms} bedrooms - {property.bathrooms} bathrooms
          </span>
          <hr />
          <Link href={`/landlords/${property.landlord.id}`} className="py-6 flex items-center space-x-4">
            {property.landlord.avatar_url && (
              <Image
                src={property.landlord.avatar_url}
                width={50}
                height={50}
                className="rounded-full"
                alt="The user name"
              />
            )}
            <p><strong>{property.landlord.name}</strong> is your host</p>
          </Link>
          <hr />
          <p className="mt-6 text-lg">{property.description}</p>
        </div>
        <ReservationSidebar property={property} userId={userId} />
      </div>
    </main>
  );
};

// Using getServerSideProps to fetch data
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const propertyId = params?.id;  // Ensure params.id exists
  const property = await apiService.get(`/api/properties/${propertyId}`);
  const userId = await getUserId();

  return {
    props: {
      property,
      userId
    }
  };
};

export default PropertyDetailPage;
