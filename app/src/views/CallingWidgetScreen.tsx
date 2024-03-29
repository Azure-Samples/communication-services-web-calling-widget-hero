// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { CommunicationUserIdentifier } from '@azure/communication-common';
import { CompoundButton, Spinner, Stack, Text } from '@fluentui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { CallingWidgetComponent } from '../components/CallingWidgetComponent';
import { StartCallIdentifier, fromFlatCommunicationIdentifier } from '@azure/communication-react';
import { useRef } from 'react';
import { fetchAutoAttendantId, fetchCallQueueId, fetchTokenResponse } from '../utils/AppUtils';

export const CallingWidgetScreen = (): JSX.Element => {
  /* eslint-disable @typescript-eslint/no-var-requires */
  const hero = require('../hero.svg') as string;
  const [userDisplayName, setUserDisplayName] = useState<string>();
  const newWindowRef = useRef<Window | null>(null);
  const [useVideo, setUseVideo] = useState<boolean>(false);

  const [userIdentifier, setUserIdentifier] = useState<CommunicationUserIdentifier>();
  const [userToken, setUserToken] = useState<string>('');
  const [callQueueId, setCallQueueId] = useState<string>();
  const [autoAttendantId, setAutoAttendantId] = useState<string>();
  const [currentLocator, setCurrentLocator] = useState<'queue' | 'attendant'>('queue');
  const [targetCallees, setTargetCallees] = useState<StartCallIdentifier[]>();
  const [userCredentialFetchError, setUserCredentialFetchError] = useState<boolean>(false);

  // Get Azure Communications Service token and Voice app identification from the server.
  useEffect(() => {
    (async () => {
      try {
        const { token, user } = await fetchTokenResponse();
        const responseCallQueueId = await fetchCallQueueId();
        const responseAutoAttendantId = await fetchAutoAttendantId();

        setCallQueueId(`28:orgid:${responseCallQueueId}`);
        setAutoAttendantId(`28:orgid:${responseAutoAttendantId}`);

        setUserToken(token);
        setUserIdentifier(user);

        setTargetCallees([fromFlatCommunicationIdentifier(`28:orgid:${responseCallQueueId}`) as StartCallIdentifier]);
      } catch (e) {
        console.error(e);
        setUserCredentialFetchError(true);
      }
    })();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const startNewWindow = useCallback(() => {
    const startNewSessionString = 'newSession=true';
    newWindowRef.current = window.open(
      window.origin + `/?${startNewSessionString}`,
      'call screen',
      'width=500, height=450'
    );
  }, []);

  useEffect(() => {
    window.addEventListener('message', (event) => {
      if (event.origin !== window.origin) {
        return;
      }
      if (event.data === 'args please') {
        const data = {
          userId: userIdentifier,
          displayName: userDisplayName,
          token: userToken,
          targetCallees: targetCallees,
          useVideo: useVideo
        };
        console.log(data);
        newWindowRef.current?.postMessage(data, window.origin);
      }
    });
  }, [userIdentifier, userToken, targetCallees, userDisplayName, useVideo]);

  if (userCredentialFetchError) {
    return (
      <Stack verticalAlign="center" style={{ height: '100%', width: '100%' }}>
        <Spinner label={'There was an issue getting credentials'} ariaLive="assertive" labelPosition="top" />;
      </Stack>
    );
  }

  return (
    <Stack style={{ height: '100%', width: '100%', padding: '3rem' }} tokens={{ childrenGap: '1.5rem' }}>
      <Stack style={{ margin: 'auto' }} tokens={{ childrenGap: '1rem' }}>
        <Stack style={{ padding: '3rem' }} horizontal tokens={{ childrenGap: '2rem' }}>
          <Text style={{ marginTop: 'auto' }} variant="xLarge">
            Welcome to a Calling Widget and Teams Voice Application sample
          </Text>
          <img style={{ width: '7rem', height: 'auto' }} src={hero} alt="logo" />
        </Stack>

        <Text>Sample has the ability to:</Text>
        <ul>
          <li>Make calls to Teams voice applications like Call Queues and Auto Attendants.</li>
          <li>
            Adhoc call Teams users with a tenant set that allows for calls from your Azure Communication Services
            resource.
          </li>
        </ul>
        <Text>
          Make the selection to which Teams voice application you would like to call with the buttons below. Then use
          the widget in the corner to start your call!
        </Text>
        <Stack tokens={{ childrenGap: '1rem' }}>
          <CompoundButton
            primary={currentLocator === 'queue' ? true : false}
            secondaryText={'Select for Call Queue'}
            onClick={() => {
              if (callQueueId) {
                setTargetCallees([fromFlatCommunicationIdentifier(callQueueId) as StartCallIdentifier]);
                setCurrentLocator('queue');
                return;
              }
              console.warn('No Call Queue id found.');
            }}
          >
            Call Queue
          </CompoundButton>
          <CompoundButton
            primary={currentLocator === 'attendant' ? true : false}
            secondaryText={'Select for Auto Attendant'}
            onClick={() => {
              if (autoAttendantId) {
                setTargetCallees([fromFlatCommunicationIdentifier(autoAttendantId) as StartCallIdentifier]);
                setCurrentLocator('attendant');
                return;
              }
              console.warn('No Auto Attendant id found.');
            }}
          >
            Auto Attendant
          </CompoundButton>
        </Stack>
      </Stack>
      <Stack horizontal tokens={{ childrenGap: '1.5rem' }} style={{ overflow: 'hidden', margin: 'auto' }}>
        {userToken && userIdentifier && targetCallees && (
          <CallingWidgetComponent
            adapterArgs={{
              targetCallees: targetCallees,
              token: userToken,
              userId: userIdentifier,
              displayName: userDisplayName
            }}
            onRenderLogo={() => {
              return <img style={{ height: '4rem', width: '4rem', margin: 'auto' }} src={hero} alt="logo" />;
            }}
            onSetDisplayName={setUserDisplayName}
            onSetUseVideo={setUseVideo}
          />
        )}
      </Stack>
    </Stack>
  );
};
