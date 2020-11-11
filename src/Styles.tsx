import styled, { createGlobalStyle } from 'styled-components'
import './inter-ui.css'
import 'inter-ui/Inter (web)/Inter-BlackItalic.woff'
import 'inter-ui/Inter (web)/Inter-BlackItalic.woff2'
import 'inter-ui/Inter (web)/Inter-Black.woff'
import 'inter-ui/Inter (web)/Inter-Black.woff2'
import 'inter-ui/Inter (web)/Inter-BoldItalic.woff'
import 'inter-ui/Inter (web)/Inter-BoldItalic.woff2'
import 'inter-ui/Inter (web)/Inter-Bold.woff'
import 'inter-ui/Inter (web)/Inter-Bold.woff2'
import 'inter-ui/Inter (web)/Inter-ExtraBoldItalic.woff'
import 'inter-ui/Inter (web)/Inter-ExtraBoldItalic.woff2'
import 'inter-ui/Inter (web)/Inter-ExtraBold.woff'
import 'inter-ui/Inter (web)/Inter-ExtraBold.woff2'
import 'inter-ui/Inter (web)/Inter-ExtraLightItalic.woff'
import 'inter-ui/Inter (web)/Inter-ExtraLightItalic.woff2'
import 'inter-ui/Inter (web)/Inter-ExtraLight.woff'
import 'inter-ui/Inter (web)/Inter-ExtraLight.woff2'
import 'inter-ui/Inter (web)/Inter-italic.var.woff2'
import 'inter-ui/Inter (web)/Inter-Italic.woff'
import 'inter-ui/Inter (web)/Inter-Italic.woff2'
import 'inter-ui/Inter (web)/Inter-LightItalic.woff'
import 'inter-ui/Inter (web)/Inter-LightItalic.woff2'
import 'inter-ui/Inter (web)/Inter-Light.woff'
import 'inter-ui/Inter (web)/Inter-Light.woff2'
import 'inter-ui/Inter (web)/Inter-MediumItalic.woff'
import 'inter-ui/Inter (web)/Inter-MediumItalic.woff2'
import 'inter-ui/Inter (web)/Inter-Medium.woff'
import 'inter-ui/Inter (web)/Inter-Medium.woff2'
import 'inter-ui/Inter (web)/Inter-Regular.woff'
import 'inter-ui/Inter (web)/Inter-Regular.woff2'
import 'inter-ui/Inter (web)/Inter-roman.var.woff2'
import 'inter-ui/Inter (web)/Inter-SemiBoldItalic.woff'
import 'inter-ui/Inter (web)/Inter-SemiBoldItalic.woff2'
import 'inter-ui/Inter (web)/Inter-SemiBold.woff'
import 'inter-ui/Inter (web)/Inter-SemiBold.woff2'
import 'inter-ui/Inter (web)/Inter-ThinItalic.woff'
import 'inter-ui/Inter (web)/Inter-ThinItalic.woff2'
import 'inter-ui/Inter (web)/Inter-Thin.woff'
import 'inter-ui/Inter (web)/Inter-Thin.woff2'

export const mobileBreakpoint = '600px'

export const Main = styled.main`
	@media (min-width: ${mobileBreakpoint}) {
		max-width: ${mobileBreakpoint};
		margin: 2rem auto;
	}
`

export const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Inter', sans-serif; 
  }
  :root { 
    --font-family-sans-serif: 'Inter', sans-serif; 
  }
  @supports (font-variation-settings: normal) {
    body {
      font-family: 'Inter var', sans-serif;
    }
    :root { 
      --font-family-sans-serif: 'Inter var', sans-serif;
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
