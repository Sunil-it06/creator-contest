const {
  calculateScore,
  comparePosts,
  filterEligiblePosts,
  buildGlobalRanking,
  buildConsistencyRanking,
} = require("../services/rankingService");


describe("Ranking Service", () => {

  /*
   * ==============================================
   * SCORE
   * ==============================================
   */

  test("calculates post score correctly", () => {

    const post = {
      likesCount: 50,
      commentsCount: 10,
      viewsCount: 100,
    };

    expect(
      calculateScore(post)
    ).toBe(100);

  });


  /*
   * ==============================================
   * TIE BREAK
   * ==============================================
   */

  test("uses comments as first tie-breaker", () => {

    const postA = {
      likesCount: 50,
      commentsCount: 10,
      viewsCount: 50,
      createdAt: "2026-09-04T10:00:00.000Z",
    };

    const postB = {
      likesCount: 70,
      commentsCount: 5,
      viewsCount: 25,
      createdAt: "2026-09-04T11:00:00.000Z",
    };

    expect(
      comparePosts(postA, postB)
    ).toBeLessThan(0);

  });


  /*
   * ==============================================
   * ELIGIBILITY
   * ==============================================
   */

  test("filters out non-Chhattisgarh users", () => {

    const users = [
      {
        _id: "1",
        residency: "Chhattisgarh",
      },

      {
        _id: "2",
        residency: "Uttar Pradesh",
      },
    ];


    const posts = [
      {
        _id: "post1",
        creatorId: "1",
      },

      {
        _id: "post2",
        creatorId: "2",
      },
    ];


    const result =
      filterEligiblePosts(
        posts,
        users
      );


    expect(result).toHaveLength(1);

    expect(result[0]._id)
      .toBe("post1");

  });


  /*
   * ==============================================
   * GLOBAL RANKING
   * ==============================================
   */

  test(
    "uses only the best post from each creator",
    () => {

      const posts = [
        {
          _id: "post1",
          creatorId: "user1",
          category: "Dance",
          likesCount: 10,
          commentsCount: 2,
          viewsCount: 10,
          createdAt: "2026-09-02T10:00:00.000Z",
        },

        {
          _id: "post2",
          creatorId: "user1",
          category: "Food",
          likesCount: 100,
          commentsCount: 10,
          viewsCount: 100,
          createdAt: "2026-09-03T10:00:00.000Z",
        },

        {
          _id: "post3",
          creatorId: "user2",
          category: "Music",
          likesCount: 50,
          commentsCount: 5,
          viewsCount: 50,
          createdAt: "2026-09-04T10:00:00.000Z",
        },
      ];


      const result =
        buildGlobalRanking(posts);


      expect(result)
        .toHaveLength(2);


      expect(result[0].postId)
        .toBe("post2");

    }
  );


  /*
   * ==============================================
   * CONSISTENCY
   * ==============================================
   */

  test(
    "excludes creator with fewer than 3 posts in one week",
    () => {

      const posts = [];


      /*
       * Week 1 -> 3
       * Week 2 -> 3
       * Week 3 -> 3
       * Week 4 -> 2
       */

      const weeks = [
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


      let id = 1;


      for (const week of weeks) {

        for (
          let i = 0;
          i < week.count;
          i++
        ) {

          posts.push({
            _id: `post${id++}`,

            creatorId: "user1",

            category: "Art",

            likesCount: 10,

            commentsCount: 2,

            viewsCount: 10,

            createdAt:
              `${week.date}T10:00:00.000Z`,
          });

        }

      }


      const result =
        buildConsistencyRanking(
          posts,
          "2026-09-01T00:00:00.000Z"
        );


      expect(result)
        .toHaveLength(0);

    }
  );

});