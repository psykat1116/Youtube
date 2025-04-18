import { db } from "@/db";
import { categories } from "@/db/schema";

const categoryNames = [
  "Cars and Vehicles",
  "Comedy",
  "Education",
  "Entertainment",
  "Gaming",
  "Music",
  "Film and Animation",
  "News and Politics",
  "Pets and Animals",
  "Science and Technology",
  "Sports",
  "Travel and Events",
  "Howto and Style",
  "People and Blogs",
  "Nonprofits and Activism",
  "Short Movies",
  "Shows",
  "Trailers",
  "Anime",
  "Action and Adventure",
  "Classics",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "History",
];

async function main() {
  try {
    console.log("Seeding categories...");

    const values = categoryNames
      .map((name) => ({
        name,
        description: `Video related to ${name}`,
      }))
      .toSorted((a, b) => a.name.localeCompare(b.name));

    await db.insert(categories).values(values);

    console.log("Categories seeded!");
  } catch (error) {
    console.error("Error seeding categories:", error);
    process.exit(1);
  }
}

main();
