import { Categories } from "@/components/categories";
import { Companions } from "@/components/companions";
import { SearchInput } from "@/components/search-input";
import prismadb from "@/lib/prismadb";

interface RootPageProps{
  // Convention of Next13 server components
  searchParams: {
    categoryId: string,
    name: string;
  }
}

const RootPage = async ({
  searchParams
}: RootPageProps) => {
  const categories = await prismadb.category.findMany();
  const data = await prismadb.companion.findMany({
    where: {
      categoryId: searchParams.categoryId,
      // We can do this because of our Prisma Schema definitions
      // name was put as @db.text and as @@fulltext
      // We can use the fullTextSearch functions imported in the schema
      name: {
        search: searchParams.name
      }
    },
    orderBy: {
      createdAt: "desc"
    },
    // This includes the count of messages in each companion
    // We are using the same query to fetch this information.
    include: {
      _count: {
        select: {
          messages: true
        }
      }
    }
  })

  return (
    <div className="h-full p-4 space-y-2">
      <SearchInput />
      <Categories data={categories} />
      <Companions data={data} />
    </div>
  );
};

export default RootPage;
