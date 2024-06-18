import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { TextArea } from "@/components/ui/TextArea";
import { getSession } from "next-auth/react";
import { FiPlusCircle, FiXCircle } from "react-icons/fi";
import slug from "slug";

export const AddFaq = ({ onClose }) => {
  const [slugValue, setSlugValue] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      setSession(session);
    };

    fetchSession();
  }, []);

  const handleQuestionChange = (e) => {
    const value = e.target.value;
    setQuestion(value);
    setSlugValue(slug(value, { lower: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!slugValue || !question || !answer || !category) {
      setError("All fields are required");
      return;
    }

    if (!session || !session.user.isAdmin) {
      setError("You are not authorized to perform this action");
      return;
    }

    const response = await fetch("/api/faqs/create/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ slug: slugValue, question, answer, category }),
    });

    if (response.ok) {
      setSuccess("Question added successfully");
      setSlugValue("");
      setQuestion("");
      setAnswer("");
      setCategory("");
      onClose();
    } else {
      setError("Failed to add question");
    }
  };

  if (!session) {
    return <p>Loading...</p>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <div className="relative w-auto max-w-3xl">
        <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
          <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
            <h3 className="text-3xl font-semibold">Add FAQ</h3>
          </div>
          <div className="relative p-6 flex-auto">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="mb-4">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  label="Slug"
                  value={slugValue}
                  readOnly
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="question">Question</Label>
                <Input
                  label="Question"
                  value={question}
                  onChange={handleQuestionChange}
                />
              </div>
              <div className="mb-4 col-span-1 sm:col-span-2">
                <Label htmlFor="answer">Answer</Label>
                <TextArea
                  label="Answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="category">Category</Label>
                <Input
                  label="Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
              {error && (
                <div className="mb-4 col-span-1 sm:col-span-2">
                  <p className="text-red-500">{error}</p>
                </div>
              )}
              {success && (
                <div className="mb-4 col-span-1 sm:col-span-2">
                  <p className="text-green-500">{success}</p>
                </div>
              )}
              <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b col-span-1 sm:col-span-2">
                <Button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  icon={<FiPlusCircle />}>
                  Add
                </Button>
                <Button
                  type="button"
                  className="bg-red-500 hover:bg-red-600 text-white"
                  icon={<FiXCircle />}
                  onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
