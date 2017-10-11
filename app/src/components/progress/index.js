import React, {Component} from 'react';
import './index.css'
import PropTypes from 'prop-types';

class ProgressBar extends Component {


    render() {

        const {percentage, title} = this.props;

        return (<div className={'app-progress-bar'}>
            <div className="progress4">
                <div className="app-progress-bar-bar app-progress-bar-success"
                     style={{width: percentage ? percentage : '100%'}}>
                    {title ? <span className="app-progress-bar-label">{title}</span> : null}
                </div>
            </div>
        </div> )
    }
}

ProgressBar.propTypes = {
    percentage: PropTypes.any,
}
export default ProgressBar;