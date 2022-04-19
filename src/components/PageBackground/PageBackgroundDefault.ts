import { createGlobalStyle } from 'styled-components';
import RegulationsImage from '../../assets/img/home.png';

export const PageBackgroundDefault = createGlobalStyle`
  body, html {
    background: url(${RegulationsImage}) no-repeat !important;
    background-size: cover !important;
  }
`;
