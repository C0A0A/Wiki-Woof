import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import { MemoryRouter } from 'react-router-dom'
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

import { App } from './App.js';
import Home from './components/Home/Home.js';
import Landing from './components/Landing/Landing.js';
import Dog from './components/Dog/Dog.js';
import NavBar from './components/NavBar/Navbar.js';
import FormDog from './components/FormDog/FormDog.js';

configure({adapter: new Adapter()});

describe('App', () => {
  let store
  const middlewares = []
  const mockStore = configureStore(middlewares);

  beforeEach(() => {
    store = mockStore([]);
  });

  describe('El componente NavBar debe renderizar en todas las rutas.', () => {
    it('Debería renderizarse en la ruta "/"', () => {
      const wrapper = mount(
          <Provider store={store}>
            <MemoryRouter initialEntries={[ '/' ]}>
              <App />
            </MemoryRouter>
          </Provider>
      );
        expect(wrapper.find(NavBar)).toHaveLength(1);
    });
    it('Debería renderizarse en la ruta "/otraRuta"', () => {
      const wrapper = mount(
          <Provider store={store}>
            <MemoryRouter initialEntries={[ '/otraRuta' ]}>
              <App />
            </MemoryRouter>
          </Provider>
      );
        expect(wrapper.find(NavBar)).toHaveLength(1);
    });
  });

  it('El componente Landing debe renderizar en la ruta / (Sólo en la ruta "/")', () => {
    const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={[ '/' ]}>
            <App />
          </MemoryRouter>
        </Provider>
    );

      expect(wrapper.find(Landing)).toHaveLength(1);
      expect(wrapper.find(NavBar)).toHaveLength(1);
      expect(wrapper.find(Home)).toHaveLength(0);
  });

  it('El componente FormDog debe renderizar en la ruta /creation - este test no pasará si Otro componente (que no sea Nav) se renderiza en esta ruta.', () => {
    const container = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={[  '/creation' ]}>
            <App />
          </MemoryRouter>
        </Provider>
    );
    expect(container.find(NavBar)).toHaveLength(1);
    expect(container.find(Home)).toHaveLength(0);
    expect(container.find(FormDog)).toHaveLength(1);
  });

  describe('Dog detail', () => {

    it('El componente Dog detail debe renderizar en la ruta /dogs/:id', () => {
      const container = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={[  '/dogs/1' ]}>
            <App />
          </MemoryRouter>
        </Provider>
      );
      expect(container.find(NavBar)).toHaveLength(1);
      expect(container.find(Home)).toHaveLength(0);
      expect(container.find(FormDog)).toHaveLength(0);
      expect(container.find(Dog)).toHaveLength(1);
    });
  });
});