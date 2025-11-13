
import React, { useState, useCallback } from 'react';
import { Member } from './types';
import TeamColumn from './components/TeamColumn';
import ResultModal from './components/ResultModal';

const App: React.FC = () => {
  const [teamA, setTeamA] = useState<Member[]>([]);
  const [teamB, setTeamB] = useState<Member[]>([]);
  const [results, setResults] = useState<{ teamA: Member[][]; teamB: Member[][] } | null>(null);

  const addMember = useCallback((team: 'A' | 'B', name: string) => {
    if (!name.trim()) return;
    const newMember: Member = { id: Date.now().toString(), name: name.trim() };
    if (team === 'A') {
      setTeamA(prev => [...prev, newMember]);
    } else {
      setTeamB(prev => [...prev, newMember]);
    }
  }, []);

  const deleteMember = useCallback((team: 'A' | 'B', memberId: string) => {
    if (team === 'A') {
      setTeamA(prev => prev.filter(m => m.id !== memberId));
    } else {
      setTeamB(prev => prev.filter(m => m.id !== memberId));
    }
  }, []);

  const handleDrop = useCallback((targetTeam: 'A' | 'B', event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const memberId = event.dataTransfer.getData('memberId');
    const sourceTeam = event.dataTransfer.getData('sourceTeam') as 'A' | 'B';

    if (sourceTeam === targetTeam) return;

    let memberToMove: Member | undefined;
    if (sourceTeam === 'A') {
      memberToMove = teamA.find(m => m.id === memberId);
      if(memberToMove) setTeamA(prev => prev.filter(m => m.id !== memberId));
    } else {
      memberToMove = teamB.find(m => m.id === memberId);
      if(memberToMove) setTeamB(prev => prev.filter(m => m.id !== memberId));
    }

    if (memberToMove) {
      if (targetTeam === 'A') {
        setTeamA(prev => [...prev, memberToMove!]);
      } else {
        setTeamB(prev => [...prev, memberToMove!]);
      }
    }
  }, [teamA, teamB]);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const groupMembers = (members: Member[]): Member[][] => {
    const n = members.length;
    const shuffled = shuffleArray(members);

    if (n <= 3) return n > 0 ? [shuffled] : [];
    if (n === 4) return [shuffled.slice(0, 2), shuffled.slice(2, 4)];
    if (n === 5) return [shuffled.slice(0, 3), shuffled.slice(3, 5)];

    const groups: Member[][] = [];
    let remainingMembers = [...shuffled];

    if (n % 3 === 1) { // e.g., 7 -> 2, 2, 3
      groups.push(remainingMembers.splice(0, 2));
      groups.push(remainingMembers.splice(0, 2));
    } else if (n % 3 === 2) { // e.g., 8 -> 2, 3, 3
      groups.push(remainingMembers.splice(0, 2));
    }
    
    while (remainingMembers.length > 0) {
      groups.push(remainingMembers.splice(0, 3));
    }

    return groups;
  };

  const generateTeams = () => {
    const groupedA = groupMembers(teamA);
    const groupedB = groupMembers(teamB);
    setResults({ teamA: groupedA, teamB: groupedB });
  };


  return (
    <div className="min-h-screen bg-gray-100 font-sans p-4 md:p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">Team Shuffler</h1>
        <p className="text-gray-500 mt-2">Add members and drag them between teams, then generate random groups.</p>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        <TeamColumn 
          teamId="A"
          title="Aチーム"
          members={teamA}
          onAddMember={(name) => addMember('A', name)}
          onDeleteMember={(id) => deleteMember('A', id)}
          onDrop={handleDrop}
          bgColor="bg-team-a-light"
          borderColor="border-team-a-dark"
        />
        <TeamColumn 
          teamId="B"
          title="Bチーム"
          members={teamB}
          onAddMember={(name) => addMember('B', name)}
          onDeleteMember={(id) => deleteMember('B', id)}
          onDrop={handleDrop}
          bgColor="bg-team-b-light"
          borderColor="border-team-b-dark"
        />
      </main>

      <footer className="mt-8 text-center">
        <button
          onClick={generateTeams}
          className="bg-indigo-600 text-white font-bold py-3 px-12 rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 ease-in-out transform hover:scale-105"
        >
          決定
        </button>
      </footer>

      {results && <ResultModal results={results} onClose={() => setResults(null)} />}
    </div>
  );
};

export default App;
