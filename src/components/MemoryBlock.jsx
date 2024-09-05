import React from 'react';

function MemoryBlock({ programs, totalMemory }) {
  return (
    <div className="memory-block">
      {programs.map((program, index) => (
        <div 
          key={index} 
          className="program-chunk" 
          style={{ width: `${(program.size / totalMemory) * 100}%` }}
        >
          {program.label} - {program.size} KiB
        </div>
      ))}
    </div>
  );
}

export default MemoryBlock;