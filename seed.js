const { Genre } = require("./models/genreModel");
const { Movie } = require("./models/movieModel");
const { User } = require("./models/userModel");
const mongoose = require("mongoose");
const config = require("config");

const data = [
  {
    name: "Comedy",
    movies: [
      { title: "Airplane", numberInStock: 5, dailyRentalRate: 2 },
      { title: "The Hangover", numberInStock: 10, dailyRentalRate: 2 },
      { title: "Wedding Crashers", numberInStock: 15, dailyRentalRate: 2 },
      { title: "BeelzeBub", numberInStock: 20, dailyRentalRate: 5 }
    ]
  },
  {
    name: "Action",
    movies: [
      { title: "Die Hard", numberInStock: 5, dailyRentalRate: 2 },
      { title: "Terminator", numberInStock: 10, dailyRentalRate: 2 },
      { title: "The Avengers", numberInStock: 15, dailyRentalRate: 2 },
      { title: "Fantastic 4", numberInStock: 25, dailyRentalRate: 2 }
    ]
  },
  {
    name: "Romance",
    movies: [
      { title: "The Notebook", numberInStock: 5, dailyRentalRate: 2 },
      { title: "When Harry Met Sally", numberInStock: 10, dailyRentalRate: 2 },
      { title: "Pretty Woman", numberInStock: 15, dailyRentalRate: 2 },
      { title: "Collateral Beauty", numberInStock: 30, dailyRentalRate: 2 }
    ]
  },
  {
    name: "Thriller",
    movies: [
      { title: "The Sixth Sense", numberInStock: 5, dailyRentalRate: 2 },
      { title: "Gone Girl", numberInStock: 10, dailyRentalRate: 2 },
      { title: "The Others", numberInStock: 15, dailyRentalRate: 2 },
      { title: "Annabelle", numberInStock: 50, dailyRentalRate: 2 }
    ]
  }
];

/*
? Admin password is: Admin25@ (unhashed)
* */
const userData = {
  name: "Mohamed Halfawy",
  email: "admin@zoe.com",
  password: "$2b$10$Ef.bBEMEWIDD6KewqqCx2.p6Qv6ST.Ph9WRnknR2ysZ4cAwurKiPO",
  isAdmin: true,
};

async function seed() {
  mongoose.set("strictQuery", false);
  await mongoose.connect(config.get("db"), {useNewUrlParser: true, useUnifiedTopology: true});

  await Movie.deleteMany({});
  await Genre.deleteMany({});
  await User.deleteMany({});

  for (let genre of data) {
    const { _id: genreId } = await new Genre({ name: genre.name }).save();
    const movies = genre.movies.map(movie => ({
      ...movie,
      genre: { _id: genreId, name: genre.name }
    }));
    await Movie.insertMany(movies);
  }

  await new User(userData).save();

  mongoose.disconnect();


}

seed().then(r => console.info("Done!"));
