import React, { useState } from "react";
import Link from "next/link";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { useTheme } from 'next-themes';

function FaqCard({ faq }) {
  const [showFullAnswer, setShowFullAnswer] = useState(false);
  const { theme } = useTheme();

  const toggleAnswer = () => {
    setShowFullAnswer(!showFullAnswer);
  };

  return (
    <div className={` shadow-md rounded-lg p-4 mb-4 ${theme === "dark" ? "text-gray-300" : "text-gray-800"}`}>
      <div className="flex justify-between items-center cursor-pointer" onClick={toggleAnswer}>
        <h2 className="text-lg font-bold mb-2">{faq.question}</h2>
        {showFullAnswer ? (
          <BsChevronUp className="font-semibold" />
        ) : (
          <BsChevronDown className="font-semibold" />
        )}
      </div>
      {showFullAnswer && (
        <div className="mt-2">
          <p className="font-semibold">{faq.answer}</p>
          <div className="mt-2">
            <Link href={`/faqs/${faq.slug}`}>
              <button className="text-blue-500 hover:text-blue-600">Baca selengkapnya</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default FaqCard;
