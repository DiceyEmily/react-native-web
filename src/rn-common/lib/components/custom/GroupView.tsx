import { Component, ReactElement } from 'react';
import { TextStyle, ViewProps } from "react-native";

export interface GroupViewProp extends ViewProps {
}

export class GroupViewState {
    list = Array<ReactElement>();
}


export class GroupView extends Component<GroupViewProp, GroupViewState> {

    padingVer = (this.props.style as TextStyle)?.paddingVertical ?? 3

    constructor(props: GroupViewProp) {
        super(props);
        this.state = new GroupViewState();

    }

    addView(ele?: ReactElement) {
        if (ele) {
            this.state.list.push(ele)
            this.setState({ list: this.state.list })
        }
    }

    removeAll() {
        if (this.state.list.length > 0)
            this.setState({ list: [] })
    }

    removeView(ele?: ReactElement | null) {
        if (!ele)
            return;

        for (let i = this.state.list.length - 1; i >= 0; i--) {
            if (this.state.list[i] === ele) {
                if (i === this.state.list.length - 1)
                    this.state.list.pop();
                else
                    this.state.list.splice(i, 1);

                this.setState({ list: this.state.list })
                return;
            }
        }
    }

    render() {

        return (
            this.state.list.map(it => it)
        );
    }




}
