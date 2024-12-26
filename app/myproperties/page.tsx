import Image from "next/image"
import PropertyList from "../components/properties/PropertyList"
import { getUserId } from "../lib/actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const MyPropertiesPage = async () => {
  const user_id = await getUserId()

  return (
    <main className="max-w-[2000px] mx-auto px-6 pb-6">
      {/* Wrapping the entire content in a large card */}
      <Card className="w-full my-10">
        <CardHeader>
          <CardTitle className="flex justify-center text-xl">My Properties</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Displaying the list of properties inside a responsive grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* Loop over the properties (assuming PropertyList returns the list) */}
            <PropertyList favorites={true} landlord_id={user_id} />
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

export default MyPropertiesPage
