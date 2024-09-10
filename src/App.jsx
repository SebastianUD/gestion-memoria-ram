import React, { useState } from 'react';
import MemoryBlock from './components/MemoryBlock';
import MethodSelector from './components/MethodSelector';
import ProgramAdder from './components/ProgramAdder';
import MemoryInfo from './components/MemoryInfo';
import AlgorithmSelector from './components/AlgorithmSelector';
import './App.css';

function App() {
  const totalMemory = 16 * 1024; // 16 MiB en KiB
  const osPartitionSize = 2 * 1024; // 2 MiB para el sistema operativo
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
      setPrograms([...programs, { label: `P${programs.length + 1}`, size }]);

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

  const compactMemory = () => {
    // Compacta todos los bloques libres en uno solo al final
    if (currentMethod !== 'dynamic-compact') {
      alert("Compactación solo disponible en modo dinámico con compactación.");
      return;
    }

    let newPartitions = [...memory.partitions];
    let freeSpace = 0;
    let usedPartitions = [];

    newPartitions.forEach(partition => {
      if (partition.program !== null) {
        usedPartitions.push(partition);
      } else {
        freeSpace += partition.size;
      }
    });

    usedPartitions.push({ size: freeSpace, used: 0, program: null });

    setMemory({
      ...memory,
      partitions: usedPartitions,
      free: freeSpace
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
            ...Array(7).fill().map(() => ({ size: 2 * 1024, used: 0, program: null }))
          ],
          method: 'static-fixed',
          partitionSizes: [2 * 1024, 2 * 1024, 2 * 1024, 2 * 1024, 2 * 1024, 2 * 1024, 2 * 1024]
        };
      case 'static-variable':
        return {
          total: totalMemory,
          free: totalMemory - osPartitionSize,
          partitions: [
            { size: osPartitionSize, used: osPartitionSize, program: { label: 'Sistema Operativo', size: osPartitionSize } },
            { size: 2 * 1024, used: 0, program: null },
            { size: 2 * 1024, used: 0, program: null },
            { size: 6 * 1024, used: 0, program: null },
            { size: 4 * 1024, used: 0, program: null }
          ],
          method: 'static-variable',
          partitionSizes: [4 * 1024, 6 * 1024, 4 * 1024]
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
        <MemoryInfo memory={memory} />
        <ProgramAdder onAddProgram={addProgram} />
        <h3>Acciones:</h3>
        <button onClick={compactMemory}>Compactar Memoria</button>
      </header>
    </div>
  );
}

function mostrarPopup() {
  document.getElementById("popup").style.display = "block";
}

function cerrarPopup() {
  document.getElementById("popup").style.display = "none";
}

export default App;