import React from 'react';
import MunchieDisplay from './MunchieDisplay';
import MunchieAbilitiesManager from "./MunchieAbilitiesManager"; // Adjust the path if needed

const TestMunchieDisplay = () => {
    return (
        <div>
          {/*  <MunchieDisplay munchieId={465} />*/}
            <MunchieAbilitiesManager munchieId={465} />
        </div>
    );
};

export default TestMunchieDisplay;
