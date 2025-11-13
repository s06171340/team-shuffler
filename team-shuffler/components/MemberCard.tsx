
import React from 'react';
import { Member } from '../types';

interface MemberCardProps {
  member: Member;
  onDelete: () => void;
  teamId: 'A' | 'B';
}

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);


const MemberCard: React.FC<MemberCardProps> = ({ member, onDelete, teamId }) => {

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('memberId', member.id);
    e.dataTransfer.setData('sourceTeam', teamId);
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.style.opacity = '1';
  };


  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm cursor-grab active:cursor-grabbing transition-shadow duration-200"
    >
      <span className="font-medium text-gray-800">{member.name}</span>
      <button
        onClick={onDelete}
        className="text-gray-400 hover:text-red-500 rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        aria-label={`Delete ${member.name}`}
      >
        <CloseIcon />
      </button>
    </div>
  );
};

export default MemberCard;
