export const learnableMovesEndpoints = (builder) => ({
    getLearnableMovesByMunchieName: builder.query({
        query: (name) => ({
            url: `/learnable-moves/${name}/moves`,
            method: 'GET',
        }),
        transformResponse: (response) => response,
        providesTags: (result, error, name) => [{ type: 'LearnableMoves', id: name }],
    }),

    addLearnableMoves: builder.mutation({
        query: ({ name, moves }) => ({
            url: `/learnable-moves/${name}/add-moves`,
            method: 'POST',
            data: { moves },
        }),
        invalidatesTags: (result, error, { name }) => [{ type: 'LearnableMoves', id: name }],
    }),

    removeLearnableMoves: builder.mutation({
        query: ({ name, move_ids }) => ({
            url: `/learnable-moves/${name}/remove-moves`,
            method: 'DELETE',
            data: { move_ids },
        }),
        invalidatesTags: (result, error, { name }) => [{ type: 'LearnableMoves', id: name }],
    }),
});