import React, { Component } from 'react'
import { PureComponent } from 'react';


interface SubContainerProp {

    p: {
        view: any;
    }
}




/**
 * 用于局部子view更新
 */
export class SubContainer extends PureComponent<SubContainerProp> {

    componentDidMount() {
    }

    componentWillUnmount() {
    }


    update(view: any) {
        this.props.p.view = view;
        this.forceUpdate();
    }

    render() {
        return (
            this.props.p.view
        )
    } //render end

}

