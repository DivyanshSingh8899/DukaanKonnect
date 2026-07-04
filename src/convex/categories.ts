import { query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const docs = await ctx.db.query("categories").collect();
    return docs.map((c) => ({
      id: c._id,
      name: c.name,
      slug: c.slug,
      icon: c.icon,
      description: c.description,
      serviceCount: c.serviceCount,
    }));
  },
});
