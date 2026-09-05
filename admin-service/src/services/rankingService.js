const calculateScore = (post) => {
  const likes = Number(post.likesCount || 0);
  const comments = Number(post.commentsCount || 0);
  const views = Number(post.viewsCount || 0);

  return (
    likes +
    comments * 3 +
    views * 0.2
  );
};

const comparePosts = (postA, postB) => {
  const scoreA = calculateScore(postA);
  const scoreB = calculateScore(postB);

  if (scoreA !== scoreB) {
    return scoreB - scoreA;
  }

  const commentsA = Number(postA.commentsCount || 0);
  const commentsB = Number(postB.commentsCount || 0);

  if (commentsA !== commentsB) {
    return commentsB - commentsA;
  }

  const viewsA = Number(postA.viewsCount || 0);
  const viewsB = Number(postB.viewsCount || 0);

  if (viewsA !== viewsB) {
    return viewsB - viewsA;
  }

  return (
    new Date(postA.createdAt).getTime() -
    new Date(postB.createdAt).getTime()
  );
};

const filterEligiblePosts = (posts, users) => {
 const eligibleUsers = new Set(
  users
    .filter(
      user =>
        user.residency?.trim().toLowerCase() === "chhattisgarh"
    )
    .map(user => String(user._id))
);

  return posts.filter((post) =>
    eligibleUsers.has(String(post.creatorId))
  );
};

const buildGlobalRanking = (posts) => {
  const bestPostByCreator = new Map();

  for (const post of posts) {
    const creatorId = String(post.creatorId);

    const existing =
      bestPostByCreator.get(creatorId);

    if (
      !existing ||
      comparePosts(post, existing) < 0
    ) {
      bestPostByCreator.set(creatorId, post);
    }
  }

  return Array.from(bestPostByCreator.values())
    .sort(comparePosts)
    .map((post, index) => ({
      rank: index + 1,
      postId: post._id,
      creatorId: post.creatorId,
      category: post.category,
      score: calculateScore(post),
      likesCount: post.likesCount,
      commentsCount: post.commentsCount,
      viewsCount: post.viewsCount,
      createdAt: post.createdAt,
    }));
};

const buildCategoryRanking = (posts) => {
  const bestPostByCreatorCategory = new Map();

  // Best post of each creator in each category
  for (const post of posts) {
    const creatorId = String(post.creatorId);

    const key = `${creatorId}:${post.category}`;

    const existing = bestPostByCreatorCategory.get(key);

    if (!existing || comparePosts(post, existing) < 0) {
      bestPostByCreatorCategory.set(key, post);
    }
  }

  // Group by category
  const categoryGroups = new Map();

  for (const post of bestPostByCreatorCategory.values()) {
    if (!categoryGroups.has(post.category)) {
      categoryGroups.set(post.category, []);
    }

    categoryGroups.get(post.category).push(post);
  }

  // Rank inside every category
  const rankings = [];

  for (const [category, categoryPosts] of categoryGroups) {
    const sortedPosts = categoryPosts.sort(comparePosts);

    sortedPosts.forEach((post, index) => {
      rankings.push({
        rank: index + 1,

        postId: post._id,

        creatorId: post.creatorId,

        category: post.category,

        score: calculateScore(post),

        likesCount: post.likesCount,

        commentsCount: post.commentsCount,

        viewsCount: post.viewsCount,

        createdAt: post.createdAt,
      });
    });
  }

  // Keep categories in alphabetical order
  return rankings.sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }

    return a.rank - b.rank;
  });
};

const getWeekNumber = (
  createdAt,
  contestStartDate
) => {
  const postDate = new Date(createdAt);
  const startDate = new Date(contestStartDate);

  const diff =
    postDate.getTime() -
    startDate.getTime();

  const dayMs = 24 * 60 * 60 * 1000;

  const days = Math.floor(diff / dayMs);

  if (days < 0 || days >= 28) {
    return null;
  }

  return Math.floor(days / 7) + 1;
};

const buildConsistencyRanking = (
  posts,
  contestStartDate
) => {
  const creatorWeeks = new Map();

  for (const post of posts) {
    const week = getWeekNumber(
      post.createdAt,
      contestStartDate
    );

    if (!week) continue;

    const creatorId = String(post.creatorId);

    if (!creatorWeeks.has(creatorId)) {
      creatorWeeks.set(
        creatorId,
        new Map()
      );
    }

    const weeks = creatorWeeks.get(creatorId);

    if (!weeks.has(week)) {
      weeks.set(week, []);
    }

    weeks.get(week).push(post);
  }

  const ranking = [];

  for (const [creatorId, weeks] of creatorWeeks) {
    if (weeks.size !== 4) {
      continue;
    }

    let totalScore = 0;
    let valid = true;

    const weeklyData = {};

    for (let week = 1; week <= 4; week++) {
      const weekPosts =
        weeks.get(week) || [];

      if (weekPosts.length < 3) {
        valid = false;
        break;
      }

      const topThree = [...weekPosts]
        .sort(comparePosts)
        .slice(0, 3);

      const weekScore =
        topThree.reduce(
          (sum, post) =>
            sum + calculateScore(post),
          0
        );

      totalScore += weekScore;

      weeklyData[`week${week}`] = {
        postIds: topThree.map(
          (post) => post._id
        ),
        score: weekScore,
      };
    }

    if (!valid) continue;

    ranking.push({
      creatorId,
      score: totalScore,
      weeklyData,
    });
  }

  return ranking
    .sort((a, b) => b.score - a.score)
    .map((creator, index) => ({
      rank: index + 1,
      ...creator,
    }));
};

module.exports = {
  calculateScore,
  comparePosts,
  filterEligiblePosts,
  buildGlobalRanking,
  buildCategoryRanking,
  buildConsistencyRanking,
};