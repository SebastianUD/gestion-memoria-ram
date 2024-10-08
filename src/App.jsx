import React, { useState } from 'react';
import MemoryBlock from './components/MemoryBlock';
import MethodSelector from './components/MethodSelector';
import ProgramAdder from './components/ProgramAdder';
import MemoryInfo from './components/MemoryInfo';
import AlgorithmSelector from './components/AlgorithmSelector';
import ProgramStateManager from './components/ProgramStateManager';
import './App.css';

function App() {
  const totalMemory = 16 * 1024; // 16 MiB en KiB
  const osPartitionSize = 1 * 1024; // 1 MiB para el sistema operativo
  const [memory, setMemory] = useState({
    total: totalMemory,
    free: totalMemory - osPartitionSize,
    partitions: [
      { size: osPartitionSize, used: osPartitionSize, program: { label: 'Sistema Operativo', size: osPartitionSize } }
    ],
    method: '',
    partitionSizes: []
  });
  const [programs, setPrograms] = useState([]);
  const [currentMethod, setCurrentMethod] = useState('');
  const [currentAlgorithm, setCurrentAlgorithm] = useState('first-fit');

  const addProgram = (size) => {
    // Verificar si hay suficiente memoria libre
    if (size > memory.free) {
      alert("No hay suficiente memoria disponible.");
      return;
    }

    let newPartitions = [...memory.partitions];
    let assigned = false;

    if (currentMethod === 'dynamic-no-compact' || currentMethod === 'dynamic-compact') {
      // Memoria dinámica (sin particiones predefinidas)
      for (let i = 0; i < newPartitions.length; i++) {
        if (newPartitions[i].program === null && newPartitions[i].size >= size) {
          const remainingSpace = newPartitions[i].size - size;

          // Asignar el programa al bloque encontrado
          newPartitions[i] = {
            ...newPartitions[i],
            used: size,
            program: { label: `P${programs.length + 1}`, size }
          };

          // Si hay espacio sobrante, crear un nuevo bloque libre
          if (remainingSpace > 0) {
            newPartitions.splice(i + 1, 0, { size: remainingSpace, used: 0, program: null });
          }

          assigned = true;
          break;
        }
      }
    } else {
      // Gestión estática (algoritmos: first-fit, best-fit, worst-fit)
      switch (currentAlgorithm) {
        case 'first-fit':
          for (let i = 0; i < newPartitions.length; i++) {
            if (newPartitions[i].used === 0 && newPartitions[i].size >= size) {
              newPartitions[i] = {
                ...newPartitions[i],
                used: size,
                program: { label: `P${programs.length + 1}`, size }
              };
              assigned = true;
              break;
            }
          }
          break;

        case 'best-fit':
          let bestIndex = -1;
          let bestFitSize = Number.MAX_SAFE_INTEGER;

          for (let i = 0; i < newPartitions.length; i++) {
            if (newPartitions[i].used === 0 && newPartitions[i].size >= size) {
              let leftover = newPartitions[i].size - size;
              if (leftover < bestFitSize) {
                bestFitSize = leftover;
                bestIndex = i;
              }
            }
          }

          if (bestIndex !== -1) {
            newPartitions[bestIndex] = {
              ...newPartitions[bestIndex],
              used: size,
              program: { label: `P${programs.length + 1}`, size }
            };
            assigned = true;
          }
          break;

        case 'worst-fit':
          let worstIndex = -1;
          let worstFitSize = -1;

          for (let i = 0; i < newPartitions.length; i++) {
            if (newPartitions[i].used === 0 && newPartitions[i].size >= size) {
              let leftover = newPartitions[i].size - size;
              if (leftover > worstFitSize) {
                worstFitSize = leftover;
                worstIndex = i;
              }
            }
          }

          if (worstIndex !== -1) {
            newPartitions[worstIndex] = {
              ...newPartitions[worstIndex],
              used: size,
              program: { label: `P${programs.length + 1}`, size }
            };
            assigned = true;
          }
          break;

        default:
          alert("Algoritmo de asignación no válido.");
          return;
      }
    }

    if (assigned) {
      const newProgram = { label: `P${programs.length + 1}`, size, state: 'active' };
      setPrograms([...programs, newProgram]);

      // Actualizar el estado de la memoria
      const newFreeMemory = memory.free - size;
      setMemory({
        ...memory,
        partitions: newPartitions,
        free: newFreeMemory
      });
    } else {
      alert("No se encontró una partición adecuada.");
    }
  };

  const changeProgramState = (programLabel, newState) => {
    const updatedPrograms = programs.map(program => 
      program.label === programLabel ? { ...program, state: newState } : program
    );
    setPrograms(updatedPrograms);

    const updatedPartitions = memory.partitions.map(partition => {
      if (partition.program && partition.program.label === programLabel) {
        return { 
          ...partition, 
          program: newState === 'terminated' ? null : { ...partition.program, state: newState },
          used: newState === 'terminated' ? 0 : partition.used
        };
      }
      return partition;
    });

    setMemory({ ...memory, partitions: updatedPartitions });

    if (newState === 'terminated') {
      const terminatedProgram = programs.find(p => p.label === programLabel);
      if (terminatedProgram) {
        setMemory(prevMemory => ({
          ...prevMemory,
          free: prevMemory.free + terminatedProgram.size,
        }));
      }
    }
  };

  const compactMemory = () => {
    if (currentMethod !== 'dynamic-compact') {
      alert("La compactación solo está disponible en el método de particiones dinámicas con compactación.");
      return;
    }

    let newPartitions = [];
    let freeSpace = 0;
    let usedSpace = 0;

    // Primero, movemos todas las particiones usadas al principio
    memory.partitions.forEach(partition => {
      if (partition.program && partition.program.state !== 'terminated') {
        newPartitions.push({
          ...partition,
          size: partition.used // Ajustamos el tamaño de la partición al tamaño usado
        });
        usedSpace += partition.used;
      } else {
        freeSpace += partition.size;
      }
    });

    // Luego, añadimos una única partición libre al final
    if (freeSpace > 0) {
      newPartitions.push({ size: freeSpace, used: 0, program: null });
    }

    // Calculamos la nueva fragmentación interna
    const internalFragmentation = newPartitions.reduce((acc, partition) => 
      acc + (partition.program ? partition.size - partition.used : 0), 0);

    setMemory({
      ...memory,
      partitions: newPartitions,
      free: freeSpace,
      internalFragmentation: internalFragmentation
    });
  };

  const changeMethod = (method) => {
    setCurrentMethod(method);
    setMemory(configureMemory(method));
    setPrograms([]); // Resetear los programas al cambiar el método
  };

  const configureMemory = (method) => {
    switch (method) {
      case 'static-fixed':
        return {
          total: totalMemory,
          free: totalMemory - osPartitionSize,
          partitions: [
            { size: osPartitionSize, used: osPartitionSize, program: { label: 'Sistema Operativo', size: osPartitionSize } },
            ...Array(5).fill().map(() => ({ size: 3 * 1024, used: 0, program: null }))
          ],
          method: 'static-fixed',
          partitionSizes: [3 * 1024, 3 * 1024, 3 * 1024, 3 * 1024, 3 * 1024]
        };
      case 'static-variable':
        return {
          total: totalMemory,
          free: totalMemory - osPartitionSize,
          partitions: [
            { size: osPartitionSize, used: osPartitionSize, program: { label: 'Sistema Operativo', size: osPartitionSize } },
            { size: 3 * 1024, used: 0, program: null },
            { size: 2 * 1024, used: 0, program: null },
            { size: 6 * 1024, used: 0, program: null },
            { size: 3 * 1024, used: 0, program: null },
            { size: 1 * 1024, used: 0, program: null }
          ],
          method: 'static-variable',
          partitionSizes: [3 * 1024, 2 * 1024, 6 * 1024, 3 * 1024, 1 * 1024]
        };
      case 'dynamic-no-compact':
        return {
          total: totalMemory,
          free: totalMemory - osPartitionSize,
          partitions: [
            { size: osPartitionSize, used: osPartitionSize, program: { label: 'Sistema Operativo', size: osPartitionSize } },
            { size: totalMemory - osPartitionSize, used: 0, program: null }
          ],
          method: 'dynamic-no-compact',
          partitionSizes: []
        };
      case 'dynamic-compact':
        return {
          total: totalMemory,
          free: totalMemory - osPartitionSize,
          partitions: [
            { size: osPartitionSize, used: osPartitionSize, program: { label: 'Sistema Operativo', size: osPartitionSize } },
            { size: totalMemory - osPartitionSize, used: 0, program: null }
          ],
          method: 'dynamic-compact',
          partitionSizes: []
        };
      default:
        return memory;
    }
  };

  const changeAlgorithm = (algorithm) => {
    setCurrentAlgorithm(algorithm);
    setMemory(configureMemory(currentMethod)); // Vacia la memoria al cambiar algoritmo
    setPrograms([]); // Resetear programas al cambiar algoritmo
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Sistema de Gestión de Memoria (16 MiB)</h1>
        <MethodSelector currentMethod={currentMethod} onChangeMethod={changeMethod} />
        <AlgorithmSelector currentAlgorithm={currentAlgorithm} onChangeAlgorithm={changeAlgorithm} />
        <MemoryBlock memory={memory} programs={programs} currentMethod={currentMethod} />
        <MemoryInfo memory={memory} internalFragmentation={memory.internalFragmentation} />
        <ProgramAdder onAddProgram={addProgram} />
        <ProgramStateManager programs={programs} onChangeState={changeProgramState}  memory={memory}/>
        <h3>Acciones:</h3>
        <button onClick={compactMemory}>Compactar Memoria</button>
      </header>
    </div>
  );
}

export default App;