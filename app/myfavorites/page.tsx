import PropertyList from "../components/properties/PropertyList";
import { getUserId } from "../lib/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MyFavoritesPage = async () => {
  const userid = await getUserId();

  if (!userid) {
    return (
      <main className="max-w-[2000px] mx-auto px-6 py-12">
        <Card className="w-full my-10">
          <CardHeader>
            <CardTitle className="flex justify-center text-xl">
              Authentication Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">You need to be authenticated to view this page.</p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="max-w-[2000px] mx-auto px-6 py-12">
      <Card className="w-full my-10">
        <CardHeader>
          <CardTitle className="flex justify-center text-xl">My Favorites</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <PropertyList favorites={true} />
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default MyFavoritesPage;
