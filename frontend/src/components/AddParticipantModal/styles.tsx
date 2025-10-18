import styled from 'styled-components';

export const Overlay = styled.div`
  position: fixed; /* Sit on top of the page content */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); /* Black background with opacity */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000; /* Specify a stack order */
`;

export const ModalContainer = styled.div`
  background-color: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  min-width: 400px; /* Adjust as needed */
  max-width: 90%;
  position: relative; /* For positioning the close button */
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  font-size: 1.8rem;
  color: #aaa;
  cursor: pointer;

  &:hover {
    color: #333;
  }
`;

export const Title = styled.h2`
  margin-top: 0;
  margin-bottom: 25px;
  color: #333;
  text-align: center;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const InputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  /* Make input take most space, button less */
  & > input {
    flex-grow: 1;
  }
  & > button {
    flex-shrink: 0; /* Prevent button from shrinking */
    width: auto; /* Allow button width to adjust */
    padding: 10px 15px; /* Adjust button padding */
    height: 50px; /* Match input height */
    white-space: nowrap; /* Prevent button text wrapping */
  }
`;

export const ErrorText = styled.p`
  color: #d9534f; /* Red */
  font-size: 0.9rem;
  margin-top: -10px; /* Reduce gap */
  text-align: center;
`;

export const SuccessText = styled.p`
  color: #5cb85c; /* Green */
  font-size: 0.9rem;
  margin-top: -10px;
  text-align: center;
`;