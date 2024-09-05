import React, { useState } from 'react';

function ProgramAdder({ onAddProgram }) {
  const [programSize, setProgramSize] = useState('');

  const handleAddProgram = () => {
    const size = parseInt(programSize);
    if (size > 0) {
      onAddProgram(size);
      setProgramSize('');
    }
  };

  return (
    <div className="add-program">
      <input
        type="number"
        placeholder="Tamaño del programa (KiB)"
        value={programSize}
        onChange={(e) => setProgramSize(e.target.value)}
      />
      <button onClick={handleAddProgram}>Agregar Programa</button>
    </div>
  );
}

export default ProgramAdder;