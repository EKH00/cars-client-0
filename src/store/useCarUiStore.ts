// import {
//     create,
// } from 'zustand';

// import {
//     persist,
// } from 'zustand/middleware';

// interface CarUiStore {
//     searchTerm: string;
//     showFavoritesOnly: boolean;
//     favoriteCarIds: string[];

//     setSearchTerm:
//         (value: string) => void;

//     setShowFavoritesOnly:
//         (value: boolean) => void;

//     toggleFavorite:
//         (id: string) => void;

//     removeFavorite:
//         (id: string) => void;
//     clearFavorites:
//         () => void;
// }

// export const useCarUiStore =
// create<CarUiStore>()(
//     persist(
//         (set) => ({
//             searchTerm: '',
//             showFavoritesOnly: false,
//             favoriteCarIds: [],

//             setSearchTerm: (value) =>
//             set({
//                 searchTerm: value,
//             }),

//             setShowFavoritesOnly: (value) =>
//             set({
//                 showFavoritesOnly: value,
//             }),

//             toggleFavorite: (id) =>
//             set((state) => ({
//                 favoriteCarIds:
//                 state.favoriteCarIds.includes(id) ? state.favoriteCarIds.filter(
//                     (item) => item !== id,
//                 )
//                 : [
//                     ...state.favoriteCarIds,
//                     id,
//                 ],
//             })),

//             removeFavorite: (id) =>
//             set((state) => ({
//                 favoriteCarIds:
//                     state.favoriteCarIds.filter(
//                         (item) => item !== id,
//                 ),
//             })),

//             clearFavorites: () =>
//             set({
//                 favoriteCarIds: [],
//             }),
//         }),
//         {
//             name: 'cars-ui-store',

//             partialize: (state) => ({
//                 favoriteCarIds:
//                     state.favoriteCarIds,
//             }),
//         },
//     ),
// );

import {
    create,
} from 'zustand';

import {
    persist,
} from 'zustand/middleware';

interface CarUiStore {
    searchTerm: string;
    showFavoritesOnly: boolean;
    // { id_użytkonwika, [id_ulubione_1, id_ulubione_2 , ...] }
    favoriteCarIdsByUser:
    Record<string, string[]>;

    setSearchTerm:
        (value: string) => void;
    setShowFavoritesOnly:
        (value: boolean) => void;
    toggleFavorite:
    (
        userId: string,
        carId: string,
    ) => void;
    removeFavorite:
    (
        userId: string,
        carId: string,
    ) => void;
    clearFavorites:
        (userId: string) => void;
}

export const useCarUiStore =
    create<CarUiStore>()
(
    persist(
        (set) => ({
            searchTerm: '',
            showFavoritesOnly: false,
            // Klucz = id użytkownika.
            // Wartość = lista id jego ulubionych aut.
            favoriteCarIdsByUser: {},
            setSearchTerm: (value) =>
                set({
                    searchTerm: value,
                }),
                
            setShowFavoritesOnly: (value) =>
                set({
                    showFavoritesOnly: value,
                }),
            toggleFavorite:
            (
                userId,
                carId,
            ) =>
                set((state) => {
                    const current =
                        state.favoriteCarIdsByUser[
                            userId
                        ] ?? [];
                    const updated =
                        current.includes(carId)
                    ? current.filter(
                        (id) =>
                            id !== carId,
                    )
                    : [
                        ...current,
                        carId,
                    ];
                    return {
                        favoriteCarIdsByUser: {
                            ...state.favoriteCarIdsByUser,
                            [userId]:
                                updated,
                        },
                    };
                }),

            removeFavorite:
            (
                userId,
                carId,
            ) =>
                set((state) => {
                    const current =
                        state.favoriteCarIdsByUser[
                            userId
                        ] ?? [];        
                    return {
                        favoriteCarIdsByUser: {
                            ...state.favoriteCarIdsByUser,
                            [userId]:
                                current.filter(
                                    (id) =>
                                        id !== carId,
                                ),
                        },
                    };
                }),

            clearFavorites:
            (userId) =>
            set((state) => ({
                favoriteCarIdsByUser: {
                    ...state.favoriteCarIdsByUser,
                    [userId]: [],
                },
            })),
        }),

        {
            name: 'cars-ui-store',

            partialize: (state) => ({
                favoriteCarIdsByUser:
                state.favoriteCarIdsByUser,
            }),
        },
    ),
);