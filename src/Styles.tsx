import styled, { createGlobalStyle } from 'styled-components'

export const mobileBreakpoint = '600px'

export const Main = styled.main`
	@media (min-width: ${mobileBreakpoint}) {
		max-width: ${mobileBreakpoint};
		margin: 2rem auto;
	}
`

export const GlobalStyle = createGlobalStyle`
  body {
    font-family: "Inter UI", sans-serif;
  }
  
  @supports (font-variation-settings: normal) {
    body {
      font-family: "Inter UI var alt", sans-serif;
    }
  }
  
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  label,
  legend,
  dt {
    font-weight: 600;
  }
  
  legend {
    font-size: 100%;
  }
}
`
