import React, { useState } from 'react';

function ProgramAdder({ onAddProgram }) {
  const [programSize, setProgramSize] = useState('');
  const [error, setError] = useState('');

  const handleAddProgram = () => {
    const size = parseInt(programSize, 10);
    if (isNaN(size) || size <= 0) {
      setError('El tamaño debe ser un número positivo.');
    } else {
      onAddProgram(size);
      setProgramSize('');
      setError(''); // Limpiar el error después de agregar correctamente
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
      <button onClick={handleAddProgram} disabled={!programSize || parseInt(programSize) <= 0}>
        Agregar Programa
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default ProgramAdder;