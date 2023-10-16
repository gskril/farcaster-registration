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

    ${mq.xs.min(css`
      /* font-size: 1.5rem; */
    `)}
  `
)

export const PurpleHelper = styled(Helper)(
  ({ theme }) => css`
    border-color: ${theme.colors.purple};
    background-color: hsl(280 62% 90% / 10%);

    svg {
      color: ${theme.colors.purple};
    }
  `
)
