"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { MoreVertical, Trash, X, Check } from "lucide-react";

import { deleteInterview } from "@/lib/actions/general.action";

interface InterviewCardMenuProps {
  interviewId: string;
}

const InterviewCardMenu = ({ interviewId }: InterviewCardMenuProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowConfirmation(false);
      }
    };

    if (isOpen || showConfirmation) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, showConfirmation]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (showConfirmation) setShowConfirmation(false);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirmation(true);
  };

  const confirmDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const result = await deleteInterview(interviewId);

      if (result.success) {
        toast.success(result.message || "Interview deleted successfully");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to delete interview");
      }
    } catch (error) {
      console.error("Error deleting interview:", error);
      toast.error("An error occurred while deleting the interview");
    } finally {
      setIsOpen(false);
      setShowConfirmation(false);
    }
  };

  const cancelDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirmation(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleDropdown();
        }}
        className="p-1 rounded-full hover:bg-gray-100"
      >
        <MoreVertical className="h-5 w-5 text-gray-600" />
      </button>

      {isOpen && !showConfirmation && (
        <div
          className="absolute right-0 mt-1 w-48 bg-secondary rounded-md shadow-lg z-10 border border-gray-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="py-1">
            <button
              onClick={handleDeleteClick}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-primary"
            >
              <Trash className="h-4 w-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      )}

      {showConfirmation && (
        <div
          className="absolute right-0 mt-1 w-64 bg-secondary rounded-md shadow-lg z-10 border border-gray-200 p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-sm font-medium mb-3">
            Are you sure you want to delete this interview?
          </p>

          <div className="flex justify-between">
            <button
              onClick={cancelDelete}
              className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-md border border-gray-300 hover:bg-gray-100"
            >
              <X className="h-3 w-3" />
              Cancel
            </button>

            <button
              onClick={confirmDelete}
              className="flex items-center gap-1 px-3 py-1.5 text-xs text-white bg-red-500 rounded-md hover:bg-red-600"
            >
              <Check className="h-3 w-3" />
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewCardMenu;
