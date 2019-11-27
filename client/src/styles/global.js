import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

export default createGlobalStyle`
  ${reset}

	* {
    box-sizing: border-box;
  }
	
	body {
    min-height: 100vh;
  }

	a {
    text-decoration: none;
  }

	img {
    height: auto;
    max-width: 100%;
  }
`;
