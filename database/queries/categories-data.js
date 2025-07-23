import { CategoryModel } from "@/models/category-model";

export const getUniqueCategories = async () => {
  const all = await CategoryModel.find().lean();

  const labelSet = new Set();
  const groupSet = new Set();
  const subSet = new Set();

  all.forEach((c) => {
    if (c.label) labelSet.add(c.label);
    if (c.group) groupSet.add(c.group);
    if (c.subject) subSet.add(c.subject);
  });

  return { labelSet, groupSet, subSet };
};
