import React, { useState } from "react";
import Link from "next/link";
import { BsChevronDown, BsChevronUp } from "react-icons/bs"; 

function FaqCard({ faq }) {
  const [showFullAnswer, setShowFullAnswer] = useState(false);

  const toggleAnswer = () => {
    setShowFullAnswer(!showFullAnswer);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center cursor-pointer" onClick={toggleAnswer}>
        <h2 className="text-lg font-bold mb-2">{faq.question}</h2>
        {showFullAnswer ? (
          <BsChevronUp className="text-gray-600" />
        ) : (
          <BsChevronDown className="text-gray-600" />
        )}
      </div>
      {showFullAnswer && (
        <div className="mt-2">
          <p className="text-gray-600">{faq.answer}</p>
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
