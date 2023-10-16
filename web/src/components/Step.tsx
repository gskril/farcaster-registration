import {
  CheckSVG,
  RightArrowSVG,
  Spinner,
  Typography,
} from '@ensdomains/thorin'
import styled, { css } from 'styled-components'

type State = 'disabled' | 'loading' | 'active' | 'complete'

type Props = {
  state: State
  label: string
  onClick?: () => void
  type?: 'button' | 'submit' | undefined
}

const Wrapper = styled.div<{ state: State }>(
  ({ state, theme }) => css`
    --bg-color: ${theme.colors.purpleSurface};
    --text-color: ${theme.colors.purplePrimary};
    --border-color: transparent;

    width: 100%;
    display: flex;
    align-items: center;
    color: var(--text-color);
    gap: ${theme.space['4']};
    padding: ${theme.space['4']};
    justify-content: space-between;
    background-color: var(--bg-color);
    border-radius: ${theme.radii.input};
    border: 1px solid var(--border-color);

    ${state === 'complete' &&
    css`
      --bg-color: ${theme.colors.purplePrimary};
      --text-color: ${theme.colors.textAccent};
      --border-color: transparent;
    `}

    ${state === 'disabled' &&
    css`
      --bg-color: ${theme.colors.greySurface};
      --text-color: ${theme.colors.grey};
      --border-color: ${theme.colors.border};
    `}
  `
)

const IconWrapper = styled.div<{ state: State }>(
  ({ state, theme }) => css`
    --size: ${theme.space['7']};

    color: var(--bg-color);
    display: flex;
    width: var(--size);
    height: var(--size);
    min-width: var(--size);
    min-height: var(--size);
    align-items: center;
    justify-content: center;
    border-radius: ${theme.radii.full};
    background-color: var(--text-color);

    ${state === 'active' &&
    css`
      color: ${theme.colors.textAccent};

      @media (hover: hover) {
        &:hover {
          cursor: pointer;
        }
      }
    `}

    ${state === 'disabled' &&
    css`
      border: 2px solid var(--border-color);
      background-color: transparent;
    `}
  `
)

export function Step({ state, label, onClick: _onClick, type }: Props) {
  const onClick = state === 'active' ? _onClick : undefined

  return (
    <>
      <Wrapper state={state}>
        <Typography asProp="span" weight="bold" color="inherit">
          {label}
        </Typography>

        <IconWrapper
          as={state === 'active' ? 'button' : 'div'}
          type={state === 'active' ? type : undefined}
          state={state}
          onClick={onClick}
        >
          {state === 'loading' ? (
            <Spinner color="textAccent" />
          ) : state === 'active' ? (
            <RightArrowSVG />
          ) : 'complete' ? (
            <CheckSVG />
          ) : null}
        </IconWrapper>
      </Wrapper>
    </>
  )
}
