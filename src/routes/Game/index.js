import React, { Component } from 'react';
import { hot } from 'react-hot-loader';

import { getRandom } from 'utils';

import Item from 'components/Item';
import GameOver from 'components/GameOver';

import styles from './styles.css';

const range = (max, step = 1) => [...new Array(max).keys((item, index) => index + step)];

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: [],
            score: 0,
            combo: 0,
            guesses: props._GUESSES,
            app: this.getRandomItem(),
            gameover: false,
        };
    }
    componentDidUpdate(prevProps, prevState) {
        const { app, guesses } = this.state;

        if (guesses == 0) {
            this.setState({
                gameover: true,
            });
        }

        if (prevState.guesses !== guesses) return;

        if (this.state.selected.length === this.componentsLength) {
            const validate = app.randomItem.components.every(
                item => this.state.selected.indexOf(item) !== -1
            );

            if (validate) {
                this.setState(prevState => ({
                    selected: [],
                    score: prevState.score
                        ? prevState.score + this.props._ANSWER_POINT
                        : prevState.score + this.props._INITIAL_POINT,
                    combo: prevState.combo + 1,
                    app: this.getRandomItem(),
                }));
                return;
                // get new random item
            } else {
                this.setState(prevState => ({
                    guesses: prevState.guesses - 1,
                    combo: 0,
                }));

                return;
            }
        }
    }
    handleNewGame = () => {
        const { _GUESSES } = this.props;

        this.setState({
            guesses: _GUESSES,
            selected: [],
            combo: 0,
            app: this.getRandomItem(),
            score: 0,
            gameover: false,
        });
    };
    getRandomItem() {
        const { _RANDOM_ITEMS, baseItems, itemdata, allItems } = this.props;

        const createdItems = allItems.filter(item => item.created && item.components);
        const allIdsCreatedItems = createdItems.map(item => item.id);
        const randomIndex = getRandom(allIdsCreatedItems.length);
        const randomId = allIdsCreatedItems[randomIndex];
        const randomItem = createdItems.find(item => item.id === randomId);

        this.componentsLength = randomItem.components.length;
        const needItems = _RANDOM_ITEMS - this.componentsLength;
        const arrayOfItems = range(needItems).map(item => {
            const index = getRandom(baseItems.length);

            return baseItems[index];
        });

        const dataComponents = randomItem.components.map(name => ({ ...itemdata[name], name: name }));
        const selected = range(this.componentsLength);
        const randomComponents = [...dataComponents, ...arrayOfItems].sort((a, b) => a.id - b.id);
        console.log(randomItem);
        return { randomItem, randomComponents, selected };
    }
    handleClickItem = name => {
        if (this.state.selected.length === this.componentsLength) return;

        this.setState(prevState => ({
            selected: [...prevState.selected, name],
        }));
    };
    handleClickRecipeItem = name => {
        console.log(name);
        this.setState(prevState => ({
            selected: prevState.selected.filter(item => item !== name),
        }));
    };
    render() {
        const { itemdata } = this.props;
        const { score, app, selected, guesses, combo, gameover } = this.state;

        const game = (
            <div>
                <div className={styles.inner}>
                    <div className={styles.randomItem}>
                        <Item {...app.randomItem} />
                        <ol>
                            {app.randomItem.components.map((comp, index) => (
                                <li key={index}>
                                    <b>{comp}</b>
                                </li>
                            ))}
                        </ol>
                    </div>
                    <div className={styles.buttons}>
                        {selected.map((item, index) => (
                            <div key={index} className={styles.button}>
                                {itemdata[item] ? (
                                    <Item
                                        {...itemdata[item]}
                                        name={item}
                                        onClick={this.handleClickRecipeItem}
                                    />
                                ) : (
                                    <Item />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div className={styles.buttons}>
                    {app.randomComponents.map((item, index) => (
                        <div key={index} className={styles.button}>
                            <Item
                                img={item.img}
                                name={item.name}
                                dname={item.dname}
                                onClick={this.handleClickItem}
                            />
                        </div>
                    ))}
                </div>
                <div className={styles.score}>
                    <div>Осталось попыток: {guesses}</div>
                    <div>Счёт: {score}</div>
                    <div>Комбо: {combo}</div>
                </div>
            </div>
        );

        return (
            <div className={styles.container}>
                {gameover ? <GameOver score={score} onClick={this.handleNewGame} /> : game}
            </div>
        );
    }
}

export default Game;
