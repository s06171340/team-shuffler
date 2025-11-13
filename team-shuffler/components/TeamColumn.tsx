
import React, { useState } from 'react';
import { Member } from '../types';
import MemberCard from './MemberCard';

interface TeamColumnProps {
  teamId: 'A' | 'B';
  title: string;
  members: Member[];
  onAddMember: (name: string) => void;
  onDeleteMember: (id: string) => void;
  onDrop: (targetTeam: 'A' | 'B', event: React.DragEvent<HTMLDivElement>) => void;
  bgColor: string;
  borderColor: string;
}

const TeamColumn: React.FC<TeamColumnProps> = ({ teamId, title, members, onAddMember, onDeleteMember, onDrop, bgColor, borderColor }) => {
  const [newMemberName, setNewMemberName] = useState('');
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddMember(newMemberName);
    setNewMemberName('');
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    onDrop(teamId, e);
    setIsDraggingOver(false);
  };


  return (
    <div 
      className={`p-4 rounded-lg shadow-md ${bgColor} border-2 ${isDraggingOver ? borderColor : 'border-transparent'} transition-all duration-300`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <h2 className={`text-2xl font-bold text-center mb-4 text-gray-700 border-b-2 pb-2 ${borderColor}`}>{title} ({members.length})</h2>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          value={newMemberName}
          onChange={(e) => setNewMemberName(e.target.value)}
          placeholder="New member name..."
          className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="bg-white text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm transition-colors">
          追加
        </button>
      </form>
      <div className="space-y-2 min-h-[200px]">
        {members.map(member => (
          <MemberCard
            key={member.id}
            member={member}
            onDelete={() => onDeleteMember(member.id)}
            teamId={teamId}
          />
        ))}
         {members.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-400">
            Drop members here or add new ones.
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamColumn;
