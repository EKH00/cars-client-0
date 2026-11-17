// import {
//     useEffect,
//     useRef,
//     useState,
// } from 'react';

// import {
//     Link,
//     useLocation,
// } from 'react-router';

// import {
//     confirmEmail,
// } from '../services/authService';

// type ConfirmationState = {
//     requestKey: string | null;
//     status: 'waiting' | 'confirming' | 'confirmed' | 'failed';
//     message?: string;
// };

// type ConfirmationRequest = {
//     requestKey: string;
//     attempt: number;
//     promise: Promise<string>;
// };

// export default function ConfirmEmailPage() {
//     const { search } = useLocation();
//     const searchParams = new URLSearchParams(search);
//     const userId = searchParams.get('userId');
//     const token = searchParams.get('token');
//     const requestKey =
//         userId && token
//             ? JSON.stringify([userId, token])
//             : null;

//     const [retryCount, setRetryCount] =
//         useState(0);
//     const [confirmation, setConfirmation] =
//         useState<ConfirmationState>(() => ({
//             requestKey,
//             status: requestKey
//                 ? 'confirming'
//                 : 'waiting',
//         }));
//     const cachedRequest =
//         useRef<ConfirmationRequest | null>(null);

//     useEffect(() => {
//         if (!userId || !token || !requestKey) {
//             return;
//         }

//         let isCurrent = true;
//         let request = cachedRequest.current;

//         if (
//             !request
//             || request.requestKey !== requestKey
//             || request.attempt !== retryCount
//         ) {
//             request = {
//                 requestKey,
//                 attempt: retryCount,
//                 promise: confirmEmail(userId, token),
//             };
//             cachedRequest.current = request;
//         }

//         request.promise
//             .then((message) => {
//                 if (isCurrent) {
//                     setConfirmation({
//                         requestKey,
//                         status: 'confirmed',
//                         message,
//                     });
//                 }
//             })
//             .catch((caughtError: unknown) => {
//                 if (isCurrent) {
//                     setConfirmation({
//                         requestKey,
//                         status: 'failed',
//                         message: caughtError instanceof Error
//                             ? caughtError.message
//                             : 'Nie udało się potwierdzić adresu e-mail.',
//                     });
//                 }
//             });

//         return () => {
//             isCurrent = false;
//         };
//     }, [requestKey, retryCount, token, userId]);

//     const currentConfirmation =
//         confirmation.requestKey === requestKey
//             ? confirmation
//             : {
//                 requestKey,
//                 status: requestKey
//                     ? 'confirming' as const
//                     : 'waiting' as const,
//             };

//     if (!userId && !token) {
//         return (
//             <section>
//                 <h1>Potwierdź swój adres e-mail</h1>
//                 <p>
//                     Na Twój adres e-mail został wysłany link do potwierdzenia konta.
//                     Otwórz go, aby aktywować konto.
//                 </p>
//             </section>
//         );
//     }

//     if (!userId || !token) {
//         return (
//             <section>
//                 <h1>Nieprawidłowy link</h1>
//                 <p className="error-message">
//                     Link potwierdzający jest niekompletny. Użyj pełnego linku z wiadomości e-mail.
//                 </p>
//                 <p>
//                     <Link to="/register">
//                         Wróć do rejestracji
//                     </Link>
//                 </p>
//             </section>
//         );
//     }

//     return (
//         <section>
//             <h1>Potwierdź swój adres e-mail</h1>
//             {currentConfirmation.status === 'confirming' && (
//                 <p>Potwierdzanie adresu e-mail...</p>
//             )}
//             {currentConfirmation.status === 'confirmed' && (
//                 <>
//                     <p>
//                         {currentConfirmation.message
//                             || 'Adres e-mail został potwierdzony.'}
//                     </p>
//                     <p>
//                         <Link to="/login">
//                             Przejdź do logowania
//                         </Link>
//                     </p>
//                 </>
//             )}
//             {currentConfirmation.status === 'failed' && (
//                 <>
//                     <p className="error-message">
//                         {currentConfirmation.message}
//                     </p>
//                     <button
//                         type="button"
//                         onClick={() => {
//                             setConfirmation({
//                                 requestKey,
//                                 status: 'confirming',
//                             });
//                             setRetryCount((count) => count + 1);
//                         }}
//                     >
//                         Spróbuj ponownie
//                     </button>
//                 </>
//             )}
//         </section>
//     );
// }


import {
    useEffect,
    useState,
} from 'react';

import {
    Link,
    useSearchParams,
} from 'react-router';

import {
    confirmEmail,
} from '../services/authService';

export default function ConfirmEmailPage() {
    const [searchParams] =
        useSearchParams();

    const userId =
        searchParams.get('userId');

    const token =
        searchParams.get('token');

    const [message, setMessage] =
        useState('Potwierdzanie konta...');

    useEffect(() => {
        if (!userId || !token) {
            return;
        }
        async function confirm() {
            try {
                const result =
                    await confirmEmail(
                        userId!,
                        token!,
                );
                setMessage(result);
            }
            catch {
                setMessage(
                    'Nie udało się potwierdzić konta.',
                );
            }
        }

        confirm();
    }, [userId, token]);

    if (!userId && !token) {
        return (
            <section>
                <h1>Potwierdź swój adres e-mail</h1>
                <p>
                    Na Twój adres e-mail został wysłany link do potwierdzenia konta.
                    Otwórz go, aby aktywować konto.
                </p>
            </section>
        );
    }

    if (!userId || !token) {
        return (
            <section>
                <h1>Nieprawidłowy link</h1>
                <Link to="/login">
                    Przejdź do logowania
                </Link>
            </section>
        );
    }
    return (
        <section>
            <h1>Potwierdzenie adresu e-mail</h1>
            <p>{message}</p>
            <Link to="/login">
                Przejdź do logowania
            </Link>
        </section>
    );
}