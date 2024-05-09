// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { CommunicationUserIdentifier } from '@azure/communication-common';
import { CompoundButton, Spinner, Stack, Text } from '@fluentui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { CallingWidgetComponent } from '../components/CallingWidgetComponent';
import { FluentThemeProvider, StartCallIdentifier, fromFlatCommunicationIdentifier } from '@azure/communication-react';
import { useRef } from 'react';
import { fetchAutoAttendantId, fetchCallQueueId, fetchTokenResponse } from '../utils/AppUtils';
import { solarTheme } from '../styles/CallingWidgetComponent.styles';

export const CallingWidgetScreen = (): JSX.Element => {
  /* eslint-disable @typescript-eslint/no-var-requires */
  const hero = require('../assets/images/icon_conversation.svg') as string;
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
      <div className="home-container">
      <nav>
        <div className="logo">
          <b>Contoso</b> Energy
        </div>
        <div className="menu-items">
          <a href="#">Menu</a>
          <a href="#">Pay Bill</a>
          <a href="#">Outages</a>
          <a href="#">Support</a>
          <a href="#" className="search">
            Search
          </a>
        </div>
        <div className="right-items">
          <a href="#" className="language">
            English
          </a>
          <a href="#" className="account">
            Account
          </a>
        </div>
      </nav>
      <div className="content">
        <p className="title">Looking for ways to save? Try solar</p>
        <hr />
        <p className="subtitle">You may qualify for tax savings and other benefits.</p>
        <p className="subtitle">Chat with customer support to learn more</p>
      </div>
      {userToken && userIdentifier && targetCallees && (
        <CallingWidgetComponent
          adapterArgs={{
            targetCallees: targetCallees,
            token: userToken,
            userId: userIdentifier,
            displayName: userDisplayName
          }}
          onRenderLogo={() => {
            return (
              <img
                style={{
                  height: '4rem',
                  width: '4rem',
                  margin: 'auto',
                  filter: 'invert(27%) sepia(61%) saturate(5372%) hue-rotate(75deg) brightness(53%) contrast(101%)'
                }}
                src={hero}
                alt="logo"
              />
            );
          }}
          onSetDisplayName={setUserDisplayName}
          onSetUseVideo={setUseVideo}
        />
      )}
    </div>    
  );
};
