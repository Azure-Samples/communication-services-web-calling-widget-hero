// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IButtonStyles, ICheckboxStyles, IIconStyles, IStackStyles, Theme, createTheme } from '@fluentui/react';

export const checkboxStyles = (theme: Theme, checked: boolean, disabled: boolean): ICheckboxStyles => {
  return {
    label: {
      color: theme.palette.neutralPrimary
    }
  };
};

export const callingWidgetContainerStyles = (theme: Theme): IStackStyles => {
  return {
    root: {
      width: '5rem',
      height: '5rem',
      padding: '0.5rem',
      boxShadow: theme.effects.elevation16,
      borderRadius: '50%',
      bottom: '1rem',
      right: '1rem',
      position: 'absolute',
      background: theme.palette.white,
      overflow: 'hidden',
      cursor: 'pointer',
      ':hover': {
        boxShadow: theme.effects.elevation64
      }
    }
  };
};

export const callingWidgetSetupContainerStyles = (theme: Theme): IStackStyles => {
  return {
    root: {
      width: '18rem',
      minHeight: '20rem',
      maxHeight: '25rem',
      padding: '0.5rem',
      boxShadow: theme.effects.elevation16,
      borderRadius: theme.effects.roundedCorner6,
      bottom: 0,
      right: '1rem',
      position: 'absolute',
      overflow: 'hidden',
      cursor: 'pointer',
      background: theme.palette.white
    }
  };
};

export const callIconStyles = (theme: Theme): IIconStyles => {
  return {
    root: {
      paddingTop: '0.2rem',
      color: theme.palette.white,
      transform: 'scale(1.6)'
    }
  };
};

export const startCallButtonStyles = (theme: Theme): IButtonStyles => {
  return {
    root: {
      background: theme.palette.themePrimary,
      borderRadius: theme.effects.roundedCorner6,
      borderColor: theme.palette.themePrimary
    },
    textContainer: {
      color: theme.palette.white
    }
  };
};

export const logoContainerStyles: IStackStyles = {
  root: {
    margin: 'auto',
    padding: '0.2rem',
    height: '5rem',
    width: '10rem',
    zIndex: 0
  }
};

export const collapseButtonStyles: IButtonStyles = {
  root: {
    position: 'absolute',
    top: '0.2rem',
    right: '0.2rem',
    zIndex: 1
  }
};

export const callingWidgetInCallContainerStyles = (theme: Theme): IStackStyles => {
  return {
    root: {
      width: '37rem',
      height: '37rem',
      padding: '0.5rem',
      boxShadow: theme.effects.elevation16,
      borderRadius: theme.effects.roundedCorner6,
      bottom: 0,
      right: '1rem',
      position: 'absolute',
      overflow: 'hidden',
      cursor: 'pointer',
      background: theme.semanticColors.bodyBackground
    }
  };
};

export const callingWidgetWaitingContainerStyles = (theme: Theme): IStackStyles => {
  return {
    root: {
      height: '4rem',
      width: '4rem',
      borderRadius: '50%',
      background: theme.palette.themePrimary,
    }
  };
};

export const solarTheme = createTheme({
  palette: {
    themePrimary: '#04643c',
    themeLighterAlt: '#eff9f5',
    themeLighter: '#c3e6d7',
    themeLight: '#94d0b7',
    themeTertiary: '#45a27b',
    themeSecondary: '#12764d',
    themeDarkAlt: '#045a36',
    themeDark: '#034c2d',
    themeDarker: '#023821',
    neutralLighterAlt: '#faf9f8',
    neutralLighter: '#f3f2f1',
    neutralLight: '#edebe9',
    neutralQuaternaryAlt: '#e1dfdd',
    neutralQuaternary: '#d0d0d0',
    neutralTertiaryAlt: '#c8c6c4',
    neutralTertiary: '#a19f9d',
    neutralSecondary: '#605e5c',
    neutralSecondaryAlt: '#8a8886',
    neutralPrimaryAlt: '#3b3a39',
    neutralPrimary: '#323130',
    neutralDark: '#201f1e',
    black: '#000000',
    white: '#ffffff',
  }});