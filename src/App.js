import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import './App.css';
import grid from './res/grid.png';
import 'semantic-ui-css/semantic.min.css'

import Character from './components/Character.js';

import { Grid, Image, List, Container, Header, Button, Icon, Menu, Segment } from 'semantic-ui-react';

const characters = [
    'bayonetta', 'bowser', 'bowserjr', 'captainfalcon',
    'charizard', 'chrom', 'cloud', 'corrin', 'corrinfemale', 'daisy',
    'darkpit', 'darksamus', 'diddykong', 'donkeykong', 'drmario', 'duckhunt',
    'falco', 'fox', 'ganondorf', 'greninja', 'icies', 'ike', 'incineroar',
    'inkling', 'inklingmale', 'isabelle', 'jigglypuff', 'ken', 'kingdedede',
    'kingkrool', 'kirby', 'link', 'littlemac', 'lucario', 'lucas', 'lucina',
    'luigi', 'mario', 'marth', 'megaman', 'metaknight', 'mewtwo', 'miifighter-brawler',
    'miifighter-shooter', 'miifighter-sword', 'mrgameandwatch',
    'ness', 'pacman', 'palutena', 'peach', 'pichu', 'pikachu', 'alph', 'pikminandolimar',
    'piranhaplant', 'pit', 'pokemontrainer', 'pokemontrainerfemale',
    'richter', 'ridley', 'rob', 'robin', 'robinfemale', 'rosalinaandluma',
    'roy', 'ryu', 'samus', 'sheik', 'shulk', 'simon', 'snake', 'sonicthehedgehog',
    'squirtle', 'toonlink', 'villager', 'wario', 'wiifitmale', 'wiifittrainer', 'wolf',
    'yoshi', 'younglink', 'zelda', 'zerosuitsamus'
];

class App extends Component {
    
    constructor() {
        super();
        this.state = {
            chars: characters,
            tiergrid: {}
        }
        this.tierbox = React.createRef();
    }

    reset() {
        this.setState({
            tiergrid: {}   
        });
    }

    onDragOver(e) {
        let char = e.dataTransfer.getData("char");
        
        e.stopPropagation();
        e.preventDefault();
    }

    onDrop(e) {
        let char = e.dataTransfer.getData("char");
        if(!char) return;
        
        let newtier = this.state.tiergrid;
        newtier[char] = {
            name: char,
            x: e.clientX,
            y: e.clientY
        }

        let box = this.state.tierareabox;
        if(this.tierbox.current) {
            box = findDOMNode(this.tierbox.current).getBoundingClientRect();

            this.setState({
            })
        }

        this.setState({
            tiergrid: newtier,
            tierareabox: box
        });
    }

    draggableCharAtPosition(name, key, x, y) {
        return (
            <div style={{
                'position': 'absolute',
                'left': x,
                'top': y  
            }} className="droppable"
            onDragOver={this.onDragOver.bind(this)}
            onDrop={this.onDrop.bind(this)}>
                {this.draggableChar(name, key)}
            </div>
        );
    }

    draggableChar(name, key) {
        return (
            <div
                onDragStart={(e)=>{
                    console.log('dragstart', e, this, name, key);
                    e.dataTransfer.setData("char", name);
                }}                    
                draggable                    
                className="draggable">
                <Character
                    name={name} key={key}>
                </Character>
            </div>
        );
    }

    updatePositions(newBox) {
        if(!this.state.tierareabox) return;
        
        let diffX = newBox.width / this.state.tierareabox.width;
        let diffY = newBox.height / this.state.tierareabox.height;

        console.log("Updating positions with", newBox, this.state.tierareabox, diffX, diffY);

        let newgrid = this.state.tiergrid;
        for(let key in newgrid) {
            newgrid[key].x *= diffX;
            newgrid[key].y *= diffY;
        }
        this.setState({tiergrid: newgrid});
    }

    updateTierbox() {
        console.log("Tierbox:", this.tierbox);
        if(this.tierbox.current) {
            let box = findDOMNode(this.tierbox.current).getBoundingClientRect();
            this.updatePositions(box);

            this.setState({
                tierareabox: box
            })

            console.log("Tier area box:", box);
        }
    }

    componentDidMount() {
        this.updateTierbox();

        window.addEventListener("resize", () => {
            this.updateTierbox();

            this.setState({
                height: window.innerHeight, 
                width: window.innerWidth
            });
        });
    }

    componentWillReceiveProps(props) {
        this.updateTierbox();
    }

    render() {
        let charlist = characters.map((val, index) => {
            if(!this.state.tiergrid[val]) {
                return this.draggableChar(val, index);
            } else return null;
        });

        let tierlist =[];
        for(let key in this.state.tiergrid) {
            let charobj = this.state.tiergrid[key];
            tierlist.push(this.draggableCharAtPosition(charobj.name, key, charobj.x - this.state.tierareabox.left - 20, charobj.y - this.state.tierareabox.top - 30));
        }

        console.log("Tierlist is:", tierlist, this.state.tiergrid);

        let mobile = true;
        let fixed = false;

        return (
            <div className="App" style={style.root}>
                <Grid className="MainGrid" style={style.maingrid}>
                    <Grid.Row className="nopad">
                        <Grid.Column width={16} className="TierContainer">
                            <Segment
                                inverted
                                textAlign='center'
                                style={{ height: 200, padding: '1em 0em', backgroundColor: '#65622F' }}
                                vertical>
                                <Container text>
                                    <Header
                                        as='h2'
                                        content='TimesUp'
                                        inverted
                                        style={{
                                            fontSize: mobile ? '1.5em' : '4em',
                                            fontWeight: 'normal',
                                            marginBottom: 0,
                                            marginTop: mobile ? '1.0em' : '3em',
                                        }}/>
                                    <Header
                                        as='h3'
                                        content='Random Tiergrid maker.'
                                        inverted
                                        style={{
                                            fontSize: mobile ? '1.0em' : '1.7em',
                                            fontWeight: 'normal',
                                            marginTop: mobile ? '0.5em' : '1.5em',
                                        }}/>
                                    <Button onClick={this.reset.bind(this)}>Reset</Button>
                                    <div style={{ marginTop: '16px' }}>
                                        <a style={{ fontSize: '18px', color: 'white' }} href='https://www.smashtierlist.com/'>Image source: smashtierlist</a>
                                    </div>
                                </Container>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row className="nopad TierRow">
                        <Grid.Column width={11} className="TierContainer">
                            <div ref={this.tierbox} className="gridcontainer droppable"
                                onDragOver={this.onDragOver.bind(this)}
                                onDrop={this.onDrop.bind(this)}>
                                <Image centered src={grid} className="grid"></Image>
                            </div>
                            {tierlist}
                        </Grid.Column>
                        <Grid.Column style={style.chargrid} width={5} className="CharacterContainer">
                        {charlist.map((value, index) => {
                            return (<List horizontal relaxed>
                                <List.Item>
                                    {value}
                                </List.Item>
                            </List>);
                        })}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
            );
    }
}

const style = {
    root: {
        'height': '100vh'
    },
    maingrid: {
        'overflow': 'hidden',
        'height': '100vh',
        'maxHeight': '100vh',
        'margin': '0px'
    },
    chargrid: {
        'overflowY': 'scroll'
    },
    testposition: {
        'position': 'absolute',
        'left': '431px',
        'top': '431px'
    }
}

export default App;