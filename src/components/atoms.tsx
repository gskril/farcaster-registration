import { Heading, Helper } from '@ensdomains/thorin'
import styled, { css } from 'styled-components'

export const Title = styled(Heading)`
  font-size: 3rem !important;
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
