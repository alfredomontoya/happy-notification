import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

jest.mock('react-native-sqlite-storage', () => ({
  enablePromise: jest.fn(),
  openDatabase: jest.fn(() => ({
    executeSql: jest.fn(() => [[{rows: {length: 50, item: () => ({count: 50})}}]]),
  })),
}));

jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({children}: {children: React.ReactNode}) => children,
  useNavigation: () => ({navigate: jest.fn(), addListener: jest.fn(() => jest.fn())}),
}));

jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({children}: {children: React.ReactNode}) => children,
    Screen: () => null,
  }),
}));

jest.mock('@react-native-documents/picker', () => ({
  pick: jest.fn(() => Promise.resolve([])),
  types: {
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    xls: 'application/vnd.ms-excel',
  },
}));

jest.mock('@react-native-community/datetimepicker', () => {
  const {View} = require('react-native');
  return View;
});

jest.mock('../src/database/init', () => ({
  getDatabase: jest.fn(() => Promise.resolve({
    executeSql: jest.fn(() => [[{rows: {length: 0, item: () => ({count: 0})}}]]),
  })),
}));

jest.mock('../src/database/personas', () => ({
  getAllPersonas: jest.fn(() => Promise.resolve([])),
  getPersonaById: jest.fn(() => Promise.resolve(null)),
  createPersonaFromApp: jest.fn(() => Promise.resolve(1)),
  updatePersona: jest.fn(() => Promise.resolve()),
  deletePersona: jest.fn(() => Promise.resolve()),
  importPersonas: jest.fn(() => Promise.resolve(0)),
}));

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
