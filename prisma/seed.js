import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

// Use the connection string directly as we discovered earlier
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const creatorId = process.env.SEED_CREATOR_ID;

const movies = [
  {
    title: "The Matrix",
    overview:
      "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    releaseYear: 1999,
    genres: ["Action", "Sci-Fi"],
    posterUrl: "https://example.com/matrix.jpg",
    createdBy: creatorId,
  },
  {
    title: "Inception",
    overview:
      "A skilled thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.",
    releaseYear: 2010,
    genres: ["Action", "Sci-Fi", "Thriller"],
    posterUrl: "https://example.com/inception.jpg",
    createdBy: creatorId,
  },
  {
    title: "Interstellar",
    overview:
      "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    releaseYear: 2014,
    genres: ["Adventure", "Drama", "Sci-Fi"],
    posterUrl: "https://example.com/interstellar.jpg",
    createdBy: creatorId,
  },
  {
    title: "The Dark Knight",
    overview:
      "When the menace known as the Joker wreaks havoc on Gotham, Batman must accept one of the greatest tests.",
    releaseYear: 2008,
    genres: ["Action", "Crime", "Drama"],
    posterUrl: "https://example.com/darkknight.jpg",
    createdBy: creatorId,
  },
  {
    title: "Pulp Fiction",
    overview:
      "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.",
    releaseYear: 1994,
    genres: ["Crime", "Drama"],
    posterUrl: "https://example.com/pulpfiction.jpg",
    createdBy: creatorId,
  },
  {
    title: "Forrest Gump",
    overview:
      "The presidencies of Kennedy and Johnson unfold through the perspective of an Alabama man with an IQ of 75.",
    releaseYear: 1994,
    genres: ["Drama", "Romance"],
    posterUrl: "https://example.com/forrestgump.jpg",
    createdBy: creatorId,
  },
  {
    title: "The Shawshank Redemption",
    overview:
      "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    releaseYear: 1994,
    genres: ["Drama"],
    posterUrl: "https://example.com/shawshank.jpg",
    createdBy: creatorId,
  },
  {
    title: "Avatar",
    overview:
      "A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world.",
    releaseYear: 2009,
    genres: ["Action", "Adventure", "Sci-Fi"],
    posterUrl: "https://example.com/avatar.jpg",
    createdBy: creatorId,
  },
  {
    title: "Gladiator",
    overview:
      "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.",
    releaseYear: 2000,
    genres: ["Action", "Adventure", "Drama"],
    posterUrl: "https://example.com/gladiator.jpg",
    createdBy: creatorId,
  },
  {
    title: "The Lion King",
    overview:
      "Lion prince Simba flees his kingdom after the death of his father, only to discover the truth about his past and reclaim his throne.",
    releaseYear: 1994,
    genres: ["Animation", "Adventure", "Family"],
    posterUrl: "https://example.com/lionking.jpg",
    createdBy: creatorId,
  },
];

const main = async () => {
  if (!creatorId) {
    console.error(
      "Error : SEED_CREATOR_ID is not defined in environment variables."
    );
    process.exit(1);
  }

  console.log("Seeding movies...");

  for (const movie of movies) {
    await prisma.movie.create({
      data: movie,
    });
    console.log(`Created movie : ${movie.title}`);
  }

  console.log("Seeding completed!");
};

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
