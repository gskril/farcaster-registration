import { Heading, Helper, mq } from '@ensdomains/thorin'
import styled, { css } from 'styled-components'

export const Title = styled(Heading)`
  line-height: 1;
  font-size: 2.25rem !important;
  font-weight: 850;

  ${mq.xs.min(css`
    font-size: 3rem !important;
  `)}
`

export const SubTitle = styled(Heading)(
  ({ theme }) => css`
    line-height: 1;
    font-size: 1.25rem;
    font-weight: 500;
    color: ${theme.colors.textTertiary};
  `
)

export const PurpleHelper = styled(Helper)<{ showIcon?: boolean }>(
  ({ theme, showIcon = true }) => css`
    border-color: ${theme.colors.purple};
    background-color: hsl(280 62% 90% / 10%);

    ${showIcon === false &&
    css`
      padding-top: ${theme.space['4']};
      padding-bottom: ${theme.space['4']};
    `}

    svg {
      display: ${showIcon ? 'block' : 'none'};
      color: ${theme.colors.purple};
    }
  `
)
