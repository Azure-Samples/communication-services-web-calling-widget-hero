// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

const appSettings = require('../../appsettings.json');

export const getResourceConnectionString = (): string => {
  const resourceConnectionString = process.env['ResourceConnectionString'] || appSettings.ResourceConnectionString;

  if (!resourceConnectionString) {
    throw new Error('No ACS connection string provided');
  }

  return resourceConnectionString;
};

export const getEndpoint = (): string => {
  const uri = new URL(process.env['EndpointUrl'] || appSettings.EndpointUrl);
  return `${uri.protocol}//${uri.host}`;
};

export const getAdminUserId = (): string => {
  const adminUserId = process.env['AdminUserId'] || appSettings.AdminUserId;

  if (!adminUserId) {
    throw new Error('No ACS Admin UserId provided');
  }

  return adminUserId;
};

export const getCallQueueId = (): string => {
  console.log(appSettings);

    const id = process.env['CallQueueId'] || appSettings.CallQueueId;
    console.log(id);
    return `${id}`;
}

export const getAutoAttendantId = (): string => {
    const id = process.env['AutoAttendantId'] || appSettings.AutoAttendantId;
    console.log(id);
    return `${id}`;
}