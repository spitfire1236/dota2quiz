import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { getRandom, shuffle } from 'utils';

import Item from 'components/Item';
import GameOver from 'components/GameOver';
import Tooltip from 'components/Tooltip';
import ItemTooltip from 'components/ItemTooltip';

import styles from './styles.css';

const range = (max, step = 1) => [...new Array(max).keys((item, index) => index + step)];

class Game extends Component {
    constructor(props) {
        super(props);
        const { randomItem, randomComponents, selected, components } = this.getRandomItem();

        this.state = {
            components,
            randomItem,
            selected: [],
            randomComponents,
            score: 0,
            combo: 0,
            guesses: props._GUESSES,
            gameover: false,
        };
    }
    componentDidUpdate(prevProps, prevState) {
        const { guesses, randomItem } = this.state;

        if (guesses == 0) {
            this.setState({
                gameover: true,
            });
        }

        if (prevState.guesses !== guesses) return;

        if (this.state.selected.length === randomItem.components.length) {
            const validate = randomItem.components.every(item => this.state.selected.indexOf(item) !== -1);

            if (validate) {
                const { selected, randomItem, randomComponents } = this.getRandomItem();

                this.setState(prevState => ({
                    selected: [],
                    randomItem,
                    randomComponents,
                    score: prevState.score
                        ? prevState.score + this.props._ANSWER_POINT
                        : prevState.score + this.props._INITIAL_POINT,
                    combo: prevState.combo + 1,
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

        const index = getRandom(allIdsCreatedItems.length);
        const id = allIdsCreatedItems[index];
        const item = createdItems.find(item => item.id === id);
        const { components } = item;
        const length = components.length;

        const needItems = _RANDOM_ITEMS - length;
        const arrayOfItems = range(needItems).map(item => {
            const index = getRandom(baseItems.length);

            return baseItems[index];
        });

        const dataComponents = components.map(name => ({ ...itemdata[name], name: name }));
        const selected = range(length);
        const randomComponents = shuffle([...dataComponents, ...arrayOfItems]);

        return { randomItem: item, randomComponents, selected };
    }
    handleClickItem = name => {
        if (this.state.selected.length === this.state.randomItem.components.length) return;

        this.setState(prevState => ({
            selected: [...prevState.selected, name],
        }));
    };
    handleClickRecipeItem = name => {
        this.setState(prevState => ({
            selected: prevState.selected.filter(item => item !== name),
        }));
    };
    render() {
        const { itemdata } = this.props;
        const { score, randomItem, randomComponents, selected, guesses, combo, gameover } = this.state;

        const game = (
            <div className={styles.inner}>
                <div className={styles.randomItem}>
                    <Tooltip tooltip={<ItemTooltip {...randomItem} />}>
                        <Item {...randomItem} />
                    </Tooltip>
                    <ol hidden>
                        {randomItem.components.map((comp, index) => (
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
                                <Tooltip tooltip={<ItemTooltip {...itemdata[item]} />}>
                                    <Item
                                        {...itemdata[item]}
                                        name={item}
                                        onClick={this.handleClickRecipeItem}
                                    />
                                </Tooltip>
                            ) : (
                                <Item />
                            )}
                        </div>
                    ))}
                </div>
                <div className={styles.buttons}>
                    {randomComponents.map((item, index) => (
                        <div key={index} className={styles.button}>
                            <Tooltip tooltip={<ItemTooltip {...item} />}>
                                <Item {...item} name={item.name} onClick={this.handleClickItem} />
                            </Tooltip>
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
