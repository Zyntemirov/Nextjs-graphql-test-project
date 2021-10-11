import React, {Component, Fragment} from 'react';
import Header from './Header'

export default class DashboardLayout extends Component {
    render() {
        return (
            <Fragment>
                <div>
                    <Header/>
                    <div>
                        {this.props.children}
                    </div>
                </div>

            </Fragment>
        )
    }
}
