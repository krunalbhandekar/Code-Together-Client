import React, { useEffect, useRef } from "react";
import { Carousel, message } from "antd";
import { useSelector } from "react-redux";

const Feedback = () => {
  const carouselRef = useRef();
  const { feedbacks, error } = useSelector((state) => state.feedbacks);

  const getGroupedFeedback = () => {
    const screenWidth = window.innerWidth;
    const itemsPerSlide = screenWidth >= 1024 ? 3 : screenWidth >= 768 ? 2 : 1;
    const groupedFeedback = [];

    for (let i = 0; i < feedbacks?.length; i += itemsPerSlide) {
      groupedFeedback.push(feedbacks.slice(i, i + itemsPerSlide));
    }
    return groupedFeedback;
  };

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  return (
    <section className="py-16 bg-white">
      <h3 className="text-3xl font-bold text-center mb-6">User Feedback</h3>
      <div className="relative max-w-6xl mx-auto">
        <Carousel ref={carouselRef} autoplay>
          {getGroupedFeedback()?.map((group, index) => (
            <div key={index} className="p-6 flex justify-center items-center">
              <div className="flex space-x-4 justify-center">
                {group.map((feedback, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-gray-200 p-6 rounded-lg shadow-lg w-80 flex flex-col items-center text-center space-y-4 hover:shadow-xl transition-shadow duration-300"
                  >
                    <p className="text-gray-600 italic">"{feedback.content}"</p>
                    <div className="w-full h-px bg-gray-200"></div>
                    <div>
                      <p className="text-lg font-bold text-gray-800">
                        {feedback?.createdBy?.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {feedback?.createdBy?.designation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
};

export default Feedback;
