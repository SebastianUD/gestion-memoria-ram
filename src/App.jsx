import React, { useState } from 'react';
import MemoryBlock from './components/MemoryBlock';
import MethodSelector from './components/MethodSelector';
import ProgramAdder from './components/ProgramAdder';
import MemoryInfo from './components/MemoryInfo';
import AlgorithmSelector from './components/AlgorithmSelector';
import './App.css';

function App() {
  const totalMemory = 16 * 1024; // 16 MiB en KiB (16384 KiB)
  const [memory, setMemory] = useState({ total: totalMemory, free: totalMemory });
  const [programs, setPrograms] = useState([]);
  const [currentMethod, setCurrentMethod] = useState('fixed-size-static');
  const [currentAlgorithm, setCurrentAlgorithm] = useState('first-fit');

  const addProgram = (size) => {
    if (programs.length >= 5) {
      alert("No se pueden agregar más de 5 programas.");
      return;
    }

    if (size > memory.free) {
      alert(`No hay suficiente memoria libre. Memoria disponible: ${memory.free} KiB.`);
      return;
    }

    const newProgram = { size, label: `Programa ${programs.length + 1}`, status: 'active' };
    setPrograms([...programs, newProgram]);
    setMemory({ ...memory, free: memory.free - size });
  };

  const changeMethod = (method) => {
    setCurrentMethod(method);
    // Aquí iría la lógica para reasignar la memoria según el nuevo método
    // Por ahora, solo resetearemos la memoria y los programas   
    setMemory({ total: totalMemory, free: totalMemory });
    setPrograms([]);
  };

  const changeAlgorithm = (algorithm) => {
    setCurrentAlgorithm(algorithm);
    // Aquí iría la lógica para reasignar la memoria según el nuevo algoritmo
    // Por ahora, solo resetearemos la memoria y los programas
    console.log(`Algoritmo cambiado a: ${algorithm}`);
    setMemory({ total: totalMemory, free: totalMemory });
    setPrograms([]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Sistema de Gestión de Memoria (16 MiB)</h1>
        <MethodSelector currentMethod={currentMethod} onChangeMethod={changeMethod} />
        <AlgorithmSelector currentAlgorithm={currentAlgorithm} onChangeAlgorithm={changeAlgorithm} />
        <MemoryBlock programs={programs} totalMemory={totalMemory} />
        <MemoryInfo memory={memory} />
        <ProgramAdder onAddProgram={addProgram} />
      </header>
    </div>
  );
}

export default App;