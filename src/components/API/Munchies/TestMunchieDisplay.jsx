import React from 'react';
import MunchieDisplay from './MunchieDisplay';
import MunchieAbilitiesManager from "./MunchieAbilitiesManager";
import MunchieEvolutionManager from "./MunchieEvolutionManager";
import MunchieLearnableMovesManager from "./MunchieLearnableMovesManager"; // Adjust the path if needed

const TestMunchieDisplay = () => {
    return (
        <div>
          {/*  <MunchieDisplay munchieId={465} />*/}
{/*
            <MunchieAbilitiesManager munchieId={465} />
*/}
{/*
            <MunchieEvolutionManager munchieId={465} />
*/}
            <MunchieLearnableMovesManager munchieId={465} munchieName="Affrogato" />
        </div>
    );
};

export default TestMunchieDisplay;
