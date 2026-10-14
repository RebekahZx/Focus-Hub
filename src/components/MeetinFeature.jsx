import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

const slides = [
  {
    image: "/images/meet_image.jpg",
    title: "Get a link you can share",
    description:
      "Create a meeting for later and send the link to the people you want to meet with",
  },
  {
    image: "/images/videoQuality.jpg",
    title: "Start instantly",
    description: "Start an instant meeting and join from the browser with no install",
  },
  {
    image: "/images/screenShare.jpg",
    title: "Share your screen",
    description: "Present your screen, chat and see everyone in the room during the call",
  },
  {
    image: "/images/videoSecure.jpg",
    title: "Signed-in access",
    description: "Only people signed in with Google or GitHub can create or open meetings",
  },
];

const MeetingFeature = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    //example = currentSlide =0 and slide length =3
    //nextIndex = (1+1) % 3
    // 2 % 3 =2
    const nextIndex = (currentSlide + 1) % slides.length;
    setCurrentSlide(nextIndex);
  };

  const prevSlide = () => {
    // current is 0  lenght =3
    //prevIndex = (0 -1 +3 )%3=2
    const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
    setCurrentSlide(prevIndex);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <Image
          src={slides[currentSlide].image}
          alt="meeting_feature"
          width={300}
          height={300}
          className="rounded-full w-40 h-40 md:w-64 md:h-64"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1/2 -left-10 transform -translate-y-1/2 -translate-x-full"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1/2 -right-10 transform -translate-y-1/2 translate-x-full"
          onClick={nextSlide}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
      <h2 className="text-2xl font-semibold mt-6 mb-2 text-gray-900 dark:text-white">
        {slides[currentSlide].title}
      </h2>
      <p className="text-gray-600 dark:text-gray-300 text-center max-w-sm">
        {slides[currentSlide].description}
      </p>
      <div className="flex justify-center space-x-2 mt-4">
        {slides.map((_, index) => (
          <div
            key={index}
            aria-hidden="true"
            className={`w-3 h-3 rounded-full ${
              index == currentSlide ? "bg-blue-600" : "bg-gray-300"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default MeetingFeature;