import React from 'react';

function ProgramStateManager({ programs, onChangeState, memory }) {
  const getMemoryAddress = (programLabel) => {
    let address = 0;
    for (let partition of memory.partitions) {
      if (partition.program && partition.program.label === programLabel) {
        return `0x${address.toString(16).toUpperCase().padStart(8, '0')}`;
      }
      address += partition.size;
    }
    return 'N/A';
  };

  return (
    <div className="program-state-manager">
      <h3>Gestión de Estados de Programas</h3>
      {programs.filter(program => program.state !== 'terminated').map(program => (
        <div key={program.label} className="program-state">
          <span>{program.label} ({program.size} KiB) - Estado: {program.state} - Dirección: {getMemoryAddress(program.label)}</span>
          <button onClick={() => onChangeState(program.label, 'active')}>Activar</button>
          <button onClick={() => onChangeState(program.label, 'suspended')}>Suspender</button>
          <button onClick={() => onChangeState(program.label, 'terminated')}>Terminar</button>
        </div>
      ))}
    </div>
  );
}

export default ProgramStateManager;
