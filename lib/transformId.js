export const replaceMongoIdInArray = (array) =>
  array.map(({ _id, userId, ...item }) => ({
    id: _id.toString(),
    //...(userId && { userId: userId.toString() }),
    ...item,
  }));

export const replaceMongoIdInObject = (data) => {
  if (!data || !data._id) return null;

  const { _id, ...rest } = data;
  return {
    id: _id.toString(),
    ...rest,
  };
};
