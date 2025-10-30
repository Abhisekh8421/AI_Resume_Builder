import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { dummyResumeData } from "../assets/assets";
import Loader from "../components/Loader";
import ResumePreview from "../components/ResumePreview";

const Preview = () => {
  const { resumeId } = useParams();
  const [resumeData, setResumeData] = useState(null);
  const loadResume = async () => {
    setResumeData(
      dummyResumeData.find((resume) => resume._id === resumeId || null)
    );
  };
  useEffect(() => {
    loadResume();
  }, [resumeId]);
  return resumeData ? (
    <div className=" bg-slate-100">
      <div className=" max-w-3xl mx-auto py-10">
        <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accentColor } classes=" py-4  bg-white"  />
      </div>
    </div>
  ) : (
    <Loader />
  );
};

export default Preview;
