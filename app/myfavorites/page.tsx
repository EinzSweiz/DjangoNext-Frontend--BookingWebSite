import PropertyList from "../components/properties/PropertyList";
import { getUserId } from "../lib/actions";



const MyFavoritesPage = async () => {
    const userid = await getUserId()

    if (!userid) {
        return ( <main className="max-w-[2000px] max-auto px-6 py-12">
            <p>You need to be authenticated</p>
        </main>
        )
    }
    return (
        <main className="max-w-[2000px] max-auto px-6 py-12">
            <h1 className="my-6 text-xl">My favorites</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <PropertyList favorites={false} />
            </div>
        </main>
    )
}
export default MyFavoritesPage