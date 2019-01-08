import React, { Component } from 'react';

import { Image } from 'semantic-ui-react';

class Character extends Component {

    constructor(props) {
        super(props);
        this.state = {
            prettyname: 'Name',
            name: this.props.name
        }
    }

    render() {
        return (
            <div>
                <Image style={style.image} src={require(`../res/${this.state.name}.png`)}></Image>
            </div>
        );
    }
}

const style = {
    image: {
        'width': '64px',
        'height': '64px'
    }
}

export default Character;
