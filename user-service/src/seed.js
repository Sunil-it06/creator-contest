require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const connectDB = require("./config/db");

const User = require("./models/User");
const Post = require("./models/Post");


const usersData = [
  {
    name: "Amit",
    email: "amit@example.com",
    password: "123456",
    residency: "Chhattisgarh",
  },

  {
    name: "Rahul",
    email: "rahul@example.com",
    password: "123456",
    residency: "Chhattisgarh",
  },

  {
    name: "Priya",
    email: "priya@example.com",
    password: "123456",
    residency: "Chhattisgarh",
  },

  {
    name: "Neha",
    email: "neha@example.com",
    password: "123456",
    residency: "Chhattisgarh",
  },

  {
    name: "Ravi",
    email: "ravi@example.com",
    password: "123456",
    residency: "Chhattisgarh",
  },

  // Ineligible user
  {
    name: "Outside User",
    email: "outside@example.com",
    password: "123456",
    residency: "Uttar Pradesh",
  },
];


const createSeedData = async () => {
  try {
    await connectDB();

    console.log("Clearing existing seed data...");

    await User.deleteMany({
      email: {
        $in: usersData.map(user => user.email),
      },
    });

    const users = [];

    for (const userData of usersData) {
      const hashedPassword =
        await bcrypt.hash(userData.password, 10);

      const user = await User.create({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        residency: userData.residency,
      });

      users.push(user);
    }


    const userMap = {};

    for (const user of users) {
      userMap[user.email] = user;
    }


    /*
     * Helper for creating posts
     */
    const createPost = async ({
      email,
      category,
      likes,
      comments,
      views,
      createdAt,
      caption,
    }) => {
      const user = userMap[email];

      return Post.create({
        creatorId: user._id,

        media: {
          type: "image",
          path: "/uploads/images/seed-image.jpg",
        },

        caption,

        category,

        likesCount: likes,
        commentsCount: comments,
        viewsCount: views,

        createdAt,
        updatedAt: createdAt,
      });
    };


    /*
     * ==================================================
     * 1. GLOBAL LEADER
     * ==================================================
     */

    await createPost({
      email: "amit@example.com",
      category: "Dance",
      likes: 100,
      comments: 50,
      views: 100,
      createdAt: "2026-09-02T10:00:00.000Z",
      caption: "Amit Dance Leader",
    });


    /*
     * ==================================================
     * 2. AMIT MULTI-CATEGORY LEADER
     * ==================================================
     *
     * Amit is strong in both Dance and Food.
     */

    await createPost({
      email: "amit@example.com",
      category: "Food",
      likes: 90,
      comments: 40,
      views: 80,
      createdAt: "2026-09-03T10:00:00.000Z",
      caption: "Amit Food Leader",
    });


    /*
     * ==================================================
     * 3. TIE SCORE
     * ==================================================
     *
     * Rahul:
     * 50 + (10 * 3) + (50 * .2)
     * = 90
     *
     * Priya:
     * 70 + (5 * 3) + (25 * .2)
     * = 90
     *
     * Same score.
     *
     * Rahul has more comments, therefore Rahul wins.
     */

    await createPost({
      email: "rahul@example.com",
      category: "Music",
      likes: 50,
      comments: 10,
      views: 50,
      createdAt: "2026-09-04T10:00:00.000Z",
      caption: "Rahul Tie Score",
    });


    await createPost({
      email: "priya@example.com",
      category: "Music",
      likes: 70,
      comments: 5,
      views: 25,
      createdAt: "2026-09-04T11:00:00.000Z",
      caption: "Priya Tie Score",
    });


    /*
     * ==================================================
     * 4. CONSISTENCY ELIGIBLE
     * ==================================================
     *
     * Rahul gets 3 posts in every week.
     */

    const weeks = [
      "2026-09-02",
      "2026-09-09",
      "2026-09-16",
      "2026-09-23",
    ];

    for (const week of weeks) {
      for (let i = 1; i <= 3; i++) {
        await createPost({
          email: "rahul@example.com",
          category: "Comedy",
          likes: 20 + i,
          comments: 5 + i,
          views: 30 + i,
          createdAt:
            `${week}T10:00:00.000Z`,
          caption:
            `Rahul consistency ${week} ${i}`,
        });
      }
    }


    /*
     * ==================================================
     * 5. MISSING ONE CONSISTENCY WEEK
     * ==================================================
     *
     * Priya:
     *
     * Week 1 -> 3
     * Week 2 -> 3
     * Week 3 -> 3
     * Week 4 -> 2
     *
     * Therefore NOT consistency eligible.
     */

    const priyaWeeks = [
      {
        date: "2026-09-02",
        count: 3,
      },

      {
        date: "2026-09-09",
        count: 3,
      },

      {
        date: "2026-09-16",
        count: 3,
      },

      {
        date: "2026-09-23",
        count: 2,
      },
    ];

    for (const week of priyaWeeks) {
      for (let i = 1; i <= week.count; i++) {
        await createPost({
          email: "priya@example.com",
          category: "Art",
          likes: 10 + i,
          comments: 2 + i,
          views: 20 + i,
          createdAt:
            `${week.date}T12:00:00.000Z`,
          caption:
            `Priya consistency ${week.date} ${i}`,
        });
      }
    }


    /*
     * ==================================================
     * 6. EXHAUSTED CATEGORY
     * ==================================================
     *
     * Only one eligible creator has posts
     * in Education.
     */

    await createPost({
      email: "neha@example.com",
      category: "Education",
      likes: 60,
      comments: 20,
      views: 100,
      createdAt: "2026-09-05T10:00:00.000Z",
      caption: "Only Education creator",
    });


    /*
     * ==================================================
     * 7. INELIGIBLE USER
     * ==================================================
     *
     * Outside User has an excellent score,
     * but residency is Uttar Pradesh.
     *
     * This post must NOT appear in rankings.
     */

    await createPost({
      email: "outside@example.com",
      category: "Fitness",
      likes: 1000,
      comments: 1000,
      views: 1000,
      createdAt: "2026-09-06T10:00:00.000Z",
      caption: "Ineligible User",
    });


    /*
     * ==================================================
     * FINISHED
     * ==================================================
     */

    console.log("Seed data created successfully.");

    console.log(`
Users:
Amit      -> amit@example.com
Rahul     -> rahul@example.com
Priya     -> priya@example.com
Neha      -> neha@example.com
Ravi      -> ravi@example.com
Outside   -> outside@example.com

Password for all users:
123456
    `);

  } catch (error) {
    console.error(
      "Seed failed:",
      error
    );

  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  }
};


createSeedData();