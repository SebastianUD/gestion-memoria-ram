import React from 'react';

function AlgorithmSelector({ currentAlgorithm, onChangeAlgorithm }) {
  return (
    <div className="algorithm-selector-a">
      <h3>Algoritmo de Asignación:</h3>
      <div className="toggle-container-a">
        <div className="toggle-option-a">
          <input
            type="radio"
            id="first-fit"
            name="algorithm"
            value="first-fit"
            checked={currentAlgorithm === 'first-fit'}
            onChange={() => onChangeAlgorithm('first-fit')}
          />
          <label htmlFor="first-fit">Primer Ajuste</label>
        </div>
        <div className="toggle-option-a">
          <input
            type="radio"
            id="best-fit"
            name="algorithm"
            value="best-fit"
            checked={currentAlgorithm === 'best-fit'}
            onChange={() => onChangeAlgorithm('best-fit')}
          />
          <label htmlFor="best-fit">Mejor Ajuste</label>
        </div>
        <div className="toggle-option-a">
          <input
            type="radio"
            id="worst-fit"
            name="algorithm"
            value="worst-fit"
            checked={currentAlgorithm === 'worst-fit'}
            onChange={() => onChangeAlgorithm('worst-fit')}
          />
          <label htmlFor="worst-fit">Peor Ajuste</label>
        </div>
      </div>
    </div>
  );
}

export default AlgorithmSelector;