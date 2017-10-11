import React, {Component} from 'react'

export default class RegisterComplete extends Component {

    constructor(props) {
        super(props);

        this.state = {
            user: {},
            error: null

        };
    }



    render() {

        return (
            <div className={'app-page-register-complete'}>

                <div className={'app-page-register-complete-circle'}>
                    <i className={'icon-check'}/>
                </div>

                <button type={'submit'} className={'app-button go-to-dashboard'}>
                    Dashboard <i className={'icon-angle-right'}/>
                </button>


            </div>
        )
    }
}



