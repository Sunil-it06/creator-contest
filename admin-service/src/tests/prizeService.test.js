const {
  allocatePrizes,
} = require("../services/prizeService");


describe("Prize Allocation", () => {

  test(
    "allows only one prize per creator",
    () => {

      const globalRanking = [
        {
          rank: 1,
          postId: "p1",
          creatorId: "user1",
          category: "Dance",
          score: 100,
        },

        {
          rank: 2,
          postId: "p2",
          creatorId: "user2",
          category: "Food",
          score: 90,
        },

        {
          rank: 3,
          postId: "p3",
          creatorId: "user3",
          category: "Music",
          score: 80,
        },
      ];


      const consistencyRanking = [
        {
          rank: 1,
          creatorId: "user1",
          score: 300,
        },

        {
          rank: 2,
          creatorId: "user3",
          score: 250,
        },
      ];


      const categoryRanking = [
        {
          rank: 1,
          postId: "p1",
          creatorId: "user1",
          category: "Dance",
          score: 100,
        },

        {
          rank: 2,
          postId: "p4",
          creatorId: "user4",
          category: "Dance",
          score: 70,
        },

        {
          rank: 1,
          postId: "p2",
          creatorId: "user2",
          category: "Food",
          score: 90,
        },
      ];


      const winners =
        allocatePrizes({
          globalRanking,
          consistencyRanking,
          categoryRanking,
        });


      const creatorIds =
        winners.map(
          winner => winner.creatorId
        );


      const uniqueCreatorIds =
        new Set(creatorIds);


      expect(
        uniqueCreatorIds.size
      ).toBe(
        creatorIds.length
      );

    }
  );


  test(
    "does not allocate prizes to excluded creators",
    () => {

      const globalRanking = [
        {
          rank: 1,
          postId: "p1",
          creatorId: "user1",
          category: "Dance",
          score: 100,
        },

        {
          rank: 2,
          postId: "p2",
          creatorId: "user2",
          category: "Dance",
          score: 90,
        },
      ];


      const winners =
        allocatePrizes({
          globalRanking,
          consistencyRanking: [],
          categoryRanking: [],
          excludedCreators:
            new Set(["user1"]),
        });


      expect(
        winners.some(
          winner =>
            winner.creatorId === "user1"
        )
      ).toBe(false);

    }
  );

});