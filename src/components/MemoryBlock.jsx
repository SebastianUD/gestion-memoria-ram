import React from 'react';
import Popup from './Popup.jsx'
import { useState } from 'react';

function MemoryBlock({ memory, currentMethod }) {


  const renderPartitions = () => {
    const [buttonPopup, setButtonPopup] = useState(false);
    if (currentMethod === "static-fixed" || currentMethod === "static-variable") {

      return (
        <div className="memory-block">
          {memory.partitions.map((partition, index) => (
            <div key={index} className="partition">
              <div 
                className="partition-used" 
                style={{ width: `${(partition.used / partition.size) * 100}%` }}
              >
                {partition.program ? `${partition.program.label} - ${partition.used} KiB` : ''}
                <div className='change-state'>
                  <button className='change-state-b' onClick={() => setButtonPopup(true)}>Cambiar Estado</button>
                  </div>
              </div>
              <div 
                className="partition-free" 
                style={{ width: `${((partition.size - partition.used) / partition.size) * 100}%` }}
              >
                {partition.used === 0 ? `Libre ${partition.size} KiB` : `${partition.size - partition.used} KiB libre`}
              </div>
            </div>
          ))}
        </div>
      );
    } else if (currentMethod === "dynamic-no-compact" || currentMethod === "dynamic-compact") {
      return (
        <div className="memory-block">
          {memory.partitions.map((partition, index) => (
            <div key={index} className="partition">
              <div 
                className="partition-used" 
                style={{ width: `${(partition.used) * 100}%` }}
              >
                {partition.program ? `${partition.program.label} - ${partition.used} KiB` : ''}
                <div className='change-state'>
                  <button className='change-state-b'>Cambiar Estado</button>
                  <Popup trigger={buttonPopup}>
                    <h3>Cambio de estado del Programa {partition.program ? `${partition.program.label} ` : ''}</h3>
                    <button className='option-state'>Pausar Programa</button>
                    <button className='option-state'>Finalizar Programa</button>
                  </Popup>
                </div>
              </div>
              <div 
                className="partition-free" 
                style={{ width: `${(1 - partition.used) * 100}%` }}
              >
                {partition.used === 0 ? `Libre ${memory.free} KiB` : `${memory.free} KiB libre`}
              </div>
            </div>
          ))}
        </div>
      );
    }
  }
  return renderPartitions();
}

export default MemoryBlock;