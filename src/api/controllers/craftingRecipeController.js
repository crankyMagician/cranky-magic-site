// src/features/api/controllers/craftingRecipesController.js
export const craftingRecipesEndpoints = (builder) => ({
    getAllRecipes: builder.query({
        query: () => ({
            url: '/crafting-recipes',
            method: 'GET',
        }),
        transformResponse: (response) => response,
        providesTags: [{ type: 'CraftingRecipes', id: 'LIST' }],
    }),

    getRecipeById: builder.query({
        query: (id) => ({
            url: `/crafting-recipes/get-recipe/${id}`,
            method: 'GET',
        }),
        transformResponse: (response) => response,
        providesTags: (result, error, id) => [{ type: 'CraftingRecipes', id }],
    }),

    createRecipe: builder.mutation({
        query: (data) => ({
            url: '/crafting-recipes/create-recipe',
            method: 'POST',
            data,
        }),
        transformResponse: (response) => response,
        invalidatesTags: ['CraftingRecipes'],
    }),

    editRecipe: builder.mutation({
        query: ({ id, ...data }) => ({
            url: `/crafting-recipes/edit-recipe/${id}`,
            method: 'PUT',
            data,
        }),
        transformResponse: (response) => response,
        invalidatesTags: (result, error, { id }) => [
            'CraftingRecipes',
            { type: 'CraftingRecipes', id }
        ],
    }),
});