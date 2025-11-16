import { getEducatorInfoByUserName } from "@/database/queries/educator-data";
import { notFound } from "next/navigation";
import EducatorHeader from "../components/EducatorHeader";

const EducatorProfile = async ({ params: { userName } }) => {
  const educatorInfo = await getEducatorInfoByUserName(userName);
  //console.log({ educatorInfo });
  if (!educatorInfo) notFound();

  return (
    <>
      <EducatorHeader {...educatorInfo} />
    </>
  );
};
export default EducatorProfile;
