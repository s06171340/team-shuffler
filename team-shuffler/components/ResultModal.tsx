
import React from 'react';
import { Member } from '../types';

interface ResultModalProps {
  results: {
    teamA: Member[][];
    teamB: Member[][];
  };
  onClose: () => void;
}

const TeamResult: React.FC<{ title: string; groups: Member[][]; teamColor: string }> = ({ title, groups, teamColor }) => (
  <div>
    <h3 className={`text-xl font-bold mb-3 text-center p-2 rounded-t-lg ${teamColor}`}>{title} Results</h3>
    {groups.length > 0 ? (
      <div className="space-y-3">
        {groups.map((group, index) => (
          <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <p className="font-semibold text-gray-600 mb-2">Group {index + 1}</p>
            <ul className="list-disc list-inside text-gray-800">
              {group.map(member => (
                <li key={member.id}>{member.name}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-500 text-center py-4">No members to group.</p>
    )}
  </div>
);


const ResultModal: React.FC<ResultModalProps> = ({ results, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
          >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Team Generation Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TeamResult title="Aチーム" groups={results.teamA} teamColor="bg-team-a-light" />
            <TeamResult title="Bチーム" groups={results.teamB} teamColor="bg-team-b-light" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;
