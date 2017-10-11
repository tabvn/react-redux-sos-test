import React, {Component} from 'react'
import Register from "../pages/users/register";


export default class Layout extends Component {

    render() {

        return (
            <div className={'app-wrapper'}>
                <Register/>
            </div>
        )
    }
}