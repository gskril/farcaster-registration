import { Heading, Helper, mq } from '@ensdomains/thorin'
import styled, { css } from 'styled-components'

export const Title = styled(Heading)`
  line-height: 1;
  font-size: 2.25rem !important;

  ${mq.xs.min(css`
    font-size: 3rem !important;
  `)}
`

export const SubTitle = styled(Heading)`
  line-height: 1;
  font-size: 1.5rem;
  font-weight: 600;

  ${mq.xs.min(css`
    font-size: 1.875rem;
  `)}
`

export const PurpleHelper = styled(Helper)(
  ({ theme }) => css`
    border-color: ${theme.colors.purple};
    background-color: hsl(280 62% 90% / 10%);

    svg {
      color: ${theme.colors.purple};
    }
  `
)
