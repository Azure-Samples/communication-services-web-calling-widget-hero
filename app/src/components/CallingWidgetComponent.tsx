// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { IconButton, PrimaryButton, Stack, TextField, useTheme, Checkbox, Icon } from '@fluentui/react';
import React, { useEffect, useRef, useState } from 'react';
import {
  callingWidgetSetupContainerStyles,
  checkboxStyles,
  startCallButtonStyles,
  callingWidgetContainerStyles,
  callIconStyles,
  logoContainerStyles,
  collapseButtonStyles
} from '../styles/CallingWidgetComponent.styles';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import {
  CallAdapter,
  CallComposite,
  CallAdapterState,
  CommonCallAdapterOptions,
  createAzureCommunicationCallAdapter
} from '@azure/communication-react';
import { useMemo } from 'react';
import { AdapterArgs } from '../utils/AppUtils';
import { callingWidgetInCallContainerStyles } from '../styles/CallingWidgetComponent.styles';

export interface CallingWidgetComponentProps {
  /**
   *  arguments for creating an AzureCommunicationCallAdapter for your Calling experience
   */
  adapterArgs: AdapterArgs;
  /**
   * if provided, will be used to create a new window for call experience. if not provided
   * will use the current window.
   */
  onRenderStartCall?: () => void;
  /**
   * Custom render function for displaying logo.
   * @returns
   */
  onRenderLogo?: () => JSX.Element;
  /**
   * Handler to set displayName for the user in the call.
   * @param displayName
   * @returns
   */
  onSetDisplayName?: (displayName: string | undefined) => void;
  /**
   * Handler to set whether to use video in the call.
   */
  onSetUseVideo?: (useVideo: boolean) => void;
}

/**
 * Widget for Calling Widget
 * @param props
 */
export const CallingWidgetComponent = (props: CallingWidgetComponentProps): JSX.Element => {
  const { onRenderStartCall, onRenderLogo, onSetDisplayName, onSetUseVideo, adapterArgs } = props;

  const [widgetState, setWidgetState] = useState<'new' | 'setup' | 'inCall'>('new');
  const [displayName, setDisplayName] = useState<string>();
  const [consentToData, setConsentToData] = useState<boolean>(false);
  const [useLocalVideo, setUseLocalVideo] = useState<boolean>(false);
  const [adapter, setAdapter] = useState<CallAdapter>();

  const callIdRef = useRef<string>();

  const theme = useTheme();

  useEffect(() => {
    if (widgetState === 'new' && onSetUseVideo) {
      onSetUseVideo(false);
    }
  }, [widgetState, onSetUseVideo]);

  const credential = useMemo(() => {
    try {
      return new AzureCommunicationTokenCredential(adapterArgs.token);
    } catch {
      console.error('Failed to construct token credential');
      return undefined;
    }
  }, [adapterArgs.token]);

  const adapterOptions: CommonCallAdapterOptions = useMemo(
    () => ({
      callingSounds: {
        callEnded: { url: '/sounds/callEnded.mp3' },
        callRinging: { url: '/sounds/callRinging.mp3' },
        callBusy: { url: '/sounds/callBusy.mp3' }
      }
    }),
    []
  );

  const callAdapterArgs = useMemo(() => {
    if (displayName && credential) {
      return {
        userId: adapterArgs.userId,
        credential: credential,
        locator: adapterArgs.locator,
        displayName: displayName,
        options: adapterOptions
      };
    }
    return;
  }, [adapterArgs.locator, adapterArgs.userId, credential, displayName, adapterOptions]);

  useEffect(() => {
    if (adapter) {
      adapter.on('callEnded', () => {
        setDisplayName(undefined);
        setWidgetState('new');
      });

      adapter.onStateChange((state: CallAdapterState) => {
        if (state?.call?.id && callIdRef.current !== state?.call?.id) {
          callIdRef.current = state?.call?.id;
          console.log(`Call Id: ${callIdRef.current}`);
        }
      });
    }
  }, [adapter]);

  console.log(adapter);
  /** widget template for when widget is open, put any fields here for user information desired */
  if (widgetState === 'setup' && onSetDisplayName && onSetUseVideo) {
    return (
      <Stack styles={callingWidgetSetupContainerStyles(theme)} tokens={{ childrenGap: '1rem' }}>
        <IconButton
          styles={collapseButtonStyles}
          iconProps={{ iconName: 'Dismiss' }}
          onClick={() => {
            setDisplayName(undefined);
            setConsentToData(false);
            setUseLocalVideo(false);
            setWidgetState('new');
          }}
        />
        <Stack tokens={{ childrenGap: '1rem' }} styles={logoContainerStyles}>
          <Stack style={{ transform: 'scale(1.8)' }}>{onRenderLogo && onRenderLogo()}</Stack>
        </Stack>
        <TextField
          label={'Name'}
          required={true}
          placeholder={'Enter your name'}
          onChange={(_, newValue) => {
            setDisplayName(newValue);
          }}
        />
        <Checkbox
          styles={checkboxStyles(theme)}
          label={'Use video - Checking this box will enable camera controls and screen sharing'}
          onChange={(_, checked?: boolean | undefined) => {
            onSetUseVideo(!!checked);
            setUseLocalVideo(true);
          }}
        ></Checkbox>
        <Checkbox
          required={true}
          styles={checkboxStyles(theme)}
          disabled={displayName === undefined}
          label={
            'By checking this box, you are consenting that we will collect data from the call for customer support reasons'
          }
          onChange={async (_, checked?: boolean | undefined) => {
            setConsentToData(!!checked);
            if (callAdapterArgs) {
              setAdapter(
                await createAzureCommunicationCallAdapter({
                  displayName: callAdapterArgs.displayName ?? '',
                  userId: callAdapterArgs.userId,
                  credential: callAdapterArgs.credential,
                  locator: callAdapterArgs.locator,
                  options: callAdapterArgs.options
                })
              );
            }
          }}
        ></Checkbox>
        <PrimaryButton
          styles={startCallButtonStyles(theme)}
          onClick={() => {
            if (displayName && consentToData && onRenderStartCall) {
              onSetDisplayName(displayName);
              onRenderStartCall();
            } else if (displayName && consentToData && adapter) {
              setWidgetState('inCall');
              adapter?.joinCall({ cameraOn: false, microphoneOn: true });
            }
          }}
        >
          StartCall
        </PrimaryButton>
      </Stack>
    );
  }

  if (widgetState === 'inCall' && adapter) {
    return (
      <Stack styles={callingWidgetInCallContainerStyles(theme)}>
        <CallComposite
          adapter={adapter}
          options={{
            callControls: {
              cameraButton: useLocalVideo,
              screenShareButton: useLocalVideo,
              moreButton: false,
              peopleButton: false,
              displayType: 'compact'
            },
            localVideoTile: !useLocalVideo ? false : { position: 'floating' }
          }}
        ></CallComposite>
      </Stack>
    );
  }

  return (
    <Stack
      horizontalAlign="center"
      verticalAlign="center"
      styles={callingWidgetContainerStyles(theme)}
      onClick={() => {
        setWidgetState('setup');
      }}
    >
      <Stack
        horizontalAlign="center"
        verticalAlign="center"
        style={{
          height: '4rem',
          width: '4rem',
          borderRadius: '50%',
          background: theme.palette.themePrimary
        }}
      >
        <Icon iconName="callAdd" styles={callIconStyles(theme)} />
      </Stack>
    </Stack>
  );
};
