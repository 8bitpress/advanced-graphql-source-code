import styled, { keyframes } from "styled-components";

const rotate = keyframes`
	0% {
		transform: rotate(0deg);
	}
	50% {
		transform: rotate(180deg);
	}
	100% {
		transform: rotate(360deg);
	}
`;

const StyledLoader = styled.div`
  ${prop =>
    prop.centered &&
    "left: 50%; position: absolute; top: 50%; transform: translate(-50%, -50%);"}

  svg {
    animation: ${rotate} 1.5s infinite;
  }
`;

export default StyledLoader;
