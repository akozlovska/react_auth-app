import React, { useMemo } from 'react';
import cn from 'classnames';
import { Button, Card, Stack } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext'
import { usePageError } from '../hooks/usePageError';
import { getErrorMessage } from '../utils/getErrorMessage';
import { ReactComponent as GoogleLogo } from '../assets/logos/google-logo-light.svg';
import { ReactComponent as GithubLogo } from '../assets/logos/github-logo-light.svg';
import ErrorAlert from './ErrorAlert';

const SocialAccounts = () => {
  const { user, deleteSocialAccount } = useAuth()!;

  const isGoogleConnected = useMemo(() => !!user?.google, [user]);
  const isGithubConnected = useMemo(() => !!user?.github, [user]);
  const [accountError, setAccountError] = usePageError('');

  const deleteAccount = async(type: 'google' | 'github') => {
    try {
      await deleteSocialAccount(type);
    } catch (error) {
      setAccountError(getErrorMessage(error));
    }
  }

  return (
    <Stack
      gap={3}
      className={cn('px-2', {
        'flex-column-reverse': user?.authType === 'github',
      })}
    >
      <Card
        body
        className={cn({
          'border border-success': isGoogleConnected,
        })}
      >
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex gap-5 align-items-center">
            <GoogleLogo />
            {isGoogleConnected && (
              <p className="m-0 fs-5">
                {user?.google?.name}
              </p>
            )}
          </div>

          {isGoogleConnected ? (
            <>
              {user?.authType !== 'google' && (
                <Button
                  size="sm"
                  variant="outline-danger"
                  onClick={() => deleteAccount('google')}
                >
                  Delete
                </Button>
              )}
            </>
          ) : (
            <a
              href={`${process.env.REACT_APP_API_URL}/connect/google`}
              className="btn btn-outline-success btn-sm"
            >
              Connect Google
            </a>
          )}
        </div>
      </Card>

      <Card
        body
        className={cn({
          'border border-success': isGithubConnected,
        })}
      >
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex gap-5 align-items-center">
            <GithubLogo />
            {isGithubConnected && (
              <p className="m-0 fs-5">
                {user?.github?.name}
              </p>
            )}
          </div>

          {isGithubConnected ? (
            <>
              {user?.authType !== 'github' && (
                <Button
                  size="sm"
                  variant="outline-danger"
                  onClick={() => deleteAccount('github')}
                >
                  Delete
                </Button>
              )}
            </>
          ) : (
            <a
              href={`${process.env.REACT_APP_API_URL}/connect/github`}
              className="btn btn-outline-success btn-sm"
            >
              Connect Github
            </a>
          )}
        </div>
      </Card>
      {!!accountError && (<ErrorAlert message={accountError} />)}
    </Stack>
  )
}

export default SocialAccounts
