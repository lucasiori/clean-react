import React, { useContext, memo } from 'react'
import { Logo } from '@/presentation/components'
import { ApiContext } from '@/presentation/contexts'
import { useLogout } from '@/presentation/hooks'
import Styles from './header-styles.scss'

const Header: React.FC = () => {
  const { getCurrentAccount } = useContext(ApiContext)
  const logout = useLogout()

  const buttonClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ): void => {
    event.preventDefault()

    logout()
  }

  return (
    <header className={Styles.headerWrap}>
      <div className={Styles.headerContent}>
        <Logo />

        <div className={Styles.logoutWrap}>
          <span data-testid="username">{getCurrentAccount().name}</span>
          <a href="#" data-testid="logout" onClick={buttonClick}>Sair</a>
        </div>
      </div>
    </header>
  )
}

export default memo(Header)
