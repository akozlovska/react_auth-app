import React from 'react'
import { ReactComponent as GoogleLogo } from '../assets/logos/google-logo-light.svg';
import { ReactComponent as GithubLogo } from '../assets/logos/github-logo-light.svg';

const SocialButtons = () => {

  return (
    <div className="d-flex gap-5 justify-content-center mb-3">
      <a
        href={`${process.env.REACT_APP_API_URL}/auth/google`}
        className="w-auto h-auto"
      >
        <GoogleLogo />
      </a>

      <a
        href={`${process.env.REACT_APP_API_URL}/auth/github`}
        className="w-auto h-auto"
      >
        <GithubLogo />
      </a>
    </div>
  )
}

export default SocialButtons
