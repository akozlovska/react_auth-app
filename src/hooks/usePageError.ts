import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export const usePageError = (pageError: string): [string, Dispatch<SetStateAction<string>>] => {
  const [error, setError] = useState(pageError);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timerId = setTimeout(() => {
      setError('');
    }, 3000);

    return () => {
      clearTimeout(timerId);
    };
  }, [error]);

  return [error, setError];
}
