import React from 'react';
import { useGetAllMovesQuery } from "../../api/apiSlice";

const MovesList = () => {
    const { data: moves, error, isLoading } = useGetAllMovesQuery();

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    // Handle cases where the API response is empty or malformed
    if (!moves || !Array.isArray(moves)) return <p>No moves available.</p>;

    return (
        <ul>
            {moves.map((move) => (
                <li key={move.id}>{move.name}</li>
            ))}
        </ul>
    );
};

export default MovesList;
