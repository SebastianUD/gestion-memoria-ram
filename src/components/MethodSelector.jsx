import React from 'react';

function MethodSelector({ currentMethod, onChangeMethod }) {
  return (
    <div className="method-selector">
      <h3>Métodos de Gestión:</h3>
      <div className="toggle-container-m">
        <div className="toggle-option-m">
          <input
            type="radio"
            id="fixed-size-static"
            name="method"
            value="fixed-size-static"
            checked={currentMethod === 'fixed-size-static'}
            onChange={() => onChangeMethod('fixed-size-static')}
          />
          <label htmlFor="fixed-size-static">Particiones Estáticas - Fijo</label>
        </div>
        <div className="toggle-option-m">
          <input
            type="radio"
            id="variable-size-static"
            name="method"
            value="variable-size-static"
            checked={currentMethod === 'variable-size-static'}
            onChange={() => onChangeMethod('variable-size-static')}
          />
          <label htmlFor="variable-size-static">Particiones Estáticas - Variable</label>
        </div>
        <div className="toggle-option-m">
          <input
            type="radio"
            id="dynamic-size-NOcompaction"
            name="method"
            value="dynamic-size-NOcompaction"
            checked={currentMethod === 'dynamic-size-NOcompaction'}
            onChange={() => onChangeMethod('dynamic-size-NOcompaction')}
          />
          <label htmlFor="dynamic-size-NOcompaction">Particiones Dinámicas - Sin Compactación</label>
        </div>
        <div className="toggle-option-m">
          <input
            type="radio"
            id="dynamic-size-compaction"
            name="method"
            value="dynamic-size-compaction"
            checked={currentMethod === 'dynamic-size-compaction'}
            onChange={() => onChangeMethod('dynamic-size-compaction')}
          />
          <label htmlFor="dynamic-size-compaction">Particiones Dinámicas - Con Compactación</label>
        </div>
      </div>
    </div>
  );
}

export default MethodSelector;