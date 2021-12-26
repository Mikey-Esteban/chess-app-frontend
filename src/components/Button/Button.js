import React from 'react'
import styled from 'styled-components'

const StyledButton = styled.button`
  background: #39a2cd;

  background: #E32636;

  background: ${props => props.primary ? '#39a2cd' : '#e32636'};
  border: ${props => props.primary ? '2px solid #39a2cd' : '2px solid #e32636'};
  border-radius: 2px;
  color: white;
  cursor: pointer;
  padding: 10px 20px;
  transition: all ease-in-out 150ms;

  &:hover {
    /* darker blue #1079a4 */
    /* darker red #c50818 */

    background: ${props => props.primary ? '#1079a4' : '#c50818'};
    border: ${props => props.primary ? '2px solid #1079a4' : '2px solid #c50818'};
  }
`

const Button = ({text, handleClick, primary}) => {
  return (
    <StyledButton primary={primary} onClick={handleClick}>{text}</StyledButton>
  )
}

export default Button
