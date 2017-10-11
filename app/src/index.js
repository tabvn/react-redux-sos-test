import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux'
import store from './store'
import Layout from './layout'
import './css/app.css'


render(<Provider store={store}>
    <Layout />
</Provider>, document.getElementById('root'));
