// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { CommunicationUserIdentifier, AzureCommunicationTokenCredential } from '@azure/communication-common';
import {
  CallAdapter,
  CallComposite,
  StartCallIdentifier,
  useAzureCommunicationCallAdapter
} from '@azure/communication-react';
import { Spinner, Stack } from '@fluentui/react';
import React, { useMemo } from 'react';

export const NewWindowCallScreen = (props: {
  adapterArgs: {
    userId: CommunicationUserIdentifier;
    displayName: string;
    token: string;
    targetCallees: StartCallIdentifier[];
    alternateCallerId?: string;
  };
  useVideo: boolean;
}): JSX.Element => {
  const { adapterArgs, useVideo } = props;

  const credential = useMemo(() => {
    try {
      return new AzureCommunicationTokenCredential(adapterArgs.token);
    } catch {
      console.error('Failed to construct token credential');
      return undefined;
    }
  }, [adapterArgs.token]);

  const args = useMemo(() => {
    return {
      userId: adapterArgs.userId,
      displayName: adapterArgs.displayName,
      credential,
      token: adapterArgs.token,
      locator: adapterArgs.targetCallees,
      alternateCallerId: adapterArgs.alternateCallerId
    };
  }, [
    adapterArgs.userId,
    adapterArgs.displayName,
    credential,
    adapterArgs.token,
    adapterArgs.targetCallees,
    adapterArgs.alternateCallerId
  ]);

  const afterCreate = (adapter: CallAdapter): Promise<CallAdapter> => {
    adapter.on('callEnded', () => {
      window.close();
    });
    adapter.joinCall({ cameraOn: false, microphoneOn: true });
    return new Promise((resolve) => resolve(adapter));
  };

  const adapter = useAzureCommunicationCallAdapter(args, afterCreate);

  if (!adapter) {
    return (
      <Stack verticalAlign="center" styles={{ root: { height: '100vh', width: '100vw' } }}>
        <Spinner label={'Creating adapter'} ariaLive="assertive" labelPosition="top" />
      </Stack>
    );
  }
  return (
    <Stack styles={{ root: { height: '100vh', width: '100vw' } }}>
      <CallComposite
        options={{
          callControls: {
            cameraButton: useVideo,
            screenShareButton: useVideo,
            moreButton: false,
            peopleButton: false,
            displayType: 'compact'
          },
          localVideoTile: useVideo ? { position: 'floating' } : false
        }}
        adapter={adapter}
      />
    </Stack>
  );
};
