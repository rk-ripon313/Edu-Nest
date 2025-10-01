import { replaceMongoIdInObject } from "@/lib/transformId";
import { CategoryModel } from "@/models/category-model";
import { dbConnect } from "@/service/mongo";

export const getUniqueCategories = async () => {
  try {
    await dbConnect();

    const all = await CategoryModel.find().lean();

    const labelSet = new Set();
    const groupSet = new Set();
    const subSet = new Set();
    const partSet = new Set();

    all.forEach((c) => {
      if (c.label) labelSet.add(c.label);
      if (c.group) groupSet.add(c.group);
      if (c.subject) subSet.add(c.subject);
      if (c.part) partSet.add(c.part);
    });

    return { labelSet, groupSet, subSet, partSet };
  } catch (error) {
    console.error(" Error in getUniqueCategories:", error);

    // fallback empty sets
    return {
      labelSet: new Set(),
      groupSet: new Set(),
      subSet: new Set(),
      partSet: new Set(),
    };
  }
};

export const getACategory = async ({ label, group, subject, part }) => {
  try {
    await dbConnect();
    const query = { label, group, subject };

    if (part) {
      query.part = part;
    }

    const category = await CategoryModel.findOne(query).lean();
    if (!category) {
      throw new Error("Category Not Found!");
    }
    return replaceMongoIdInObject(category);
  } catch (error) {
    throw new Error(error?.message || "Category Not Found!");
  }
};
