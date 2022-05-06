import { css } from '@emotion/react';

export default {
  appContainer: css`
    display: flex;
    align-items: flex-start;
    font-family: Courier;
    font-size: 14px;

    button {
      font-family: Courier;
      font-size: 14px;
    }
  `,
  toolContainer: css`
    display: flex;
    flex-direction: column;
  `,
  leftButtons: css`
    display: flex;
    flex-direction: column;
    margin-right: 24px;
  `,
  button: css`
    width: 200px;
    height: 50px;
    background: transparent;
    border: 1px solid #000;
    cursor: pointer;
    margin: 18px 0 0 24px;
  `,
  canvas: css`
    border: 1px solid #000;
  `,
  editor: css`
    display: flex;
    flex-direction: column;
    width: 250px;
    height: 250px;
    border: 1px solid #000;
    margin-left: 24px;
    padding: 12px;
  `,
  shapePropsHead: css`
    display: flex;
    align-items: center;
    margin-bottom: 16px;
  `,
  delete: css`
    width: 60px;
    height: 30px;
    background: transparent;
    border: 1px solid #000;
    margin-right: 16px;
    cursor: pointer;
  `,
  label: css`
    margin-right: 24px;
  `,
  input: css`
    display: flex;
    align-items: center;
    margin-top: 16px;
  `,
  sliders: css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-items: center;
  `
}