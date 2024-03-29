// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import './App.css';
import React, { useEffect, useMemo, useState } from 'react';
import { CommunicationUserIdentifier } from '@azure/communication-common';
import { Spinner, Stack, initializeIcons, registerIcons } from '@fluentui/react';
import { CallAdd20Regular, Dismiss20Regular } from '@fluentui/react-icons';
import { NewWindowCallScreen } from './views/NewWindowCallScreen';
import { CallingWidgetScreen } from './views/CallingWidgetScreen';
import { AdapterArgs, getStartSessionFromURL } from './utils/AppUtils';

type AppPages = 'calling-widget' | 'new-window-call';

registerIcons({
  icons: { dismiss: <Dismiss20Regular />, callAdd: <CallAdd20Regular /> }
});
initializeIcons();
function App(): JSX.Element {
  const [page, setPage] = useState<AppPages>('calling-widget');
  const [adapterArgs, setAdapterArgs] = useState<AdapterArgs | undefined>();
  const [useVideo, setUseVideo] = useState<boolean>(false);

  const startSession = useMemo(() => {
    return getStartSessionFromURL();
  }, []);

  useEffect(() => {
    window.addEventListener('message', (event) => {
      if (event.origin !== window.location.origin) {
        return;
      }

      if ((event.data as AdapterArgs).userId && (event.data as AdapterArgs).displayName !== '') {
        setAdapterArgs({
          userId: (event.data as AdapterArgs).userId as CommunicationUserIdentifier,
          displayName: (event.data as AdapterArgs).displayName,
          token: (event.data as AdapterArgs).token,
          targetCallees: (event.data as AdapterArgs).targetCallees
        });
        setUseVideo(!!event.data.useVideo);
      }
    });
  }, []);

  useEffect(() => {
    if (startSession) {
      console.log('asking for args');
      if (window.opener) {
        window.opener.postMessage('args please', window.opener.origin);
      }
    }
  }, [startSession]);

  useEffect(() => {
    if (adapterArgs) {
      console.log('starting session');
      setPage('new-window-call');
    }
  }, [adapterArgs]);

  switch (page) {
    case 'calling-widget': {
      return <CallingWidgetScreen />;
    }
    case 'new-window-call': {
      if (!adapterArgs) {
        return (
          <Stack verticalAlign="center" style={{ height: '100%', width: '100%' }}>
            <Spinner label={'Getting user credentials from server'} ariaLive="assertive" labelPosition="top" />;
          </Stack>
        );
      }
      return (
        <NewWindowCallScreen
          adapterArgs={{
            userId: adapterArgs.userId as CommunicationUserIdentifier,
            displayName: adapterArgs.displayName ?? '',
            token: adapterArgs.token,
            targetCallees: adapterArgs.targetCallees
          }}
          useVideo={useVideo}
        />
      );
    }
  }
}

export default App;
