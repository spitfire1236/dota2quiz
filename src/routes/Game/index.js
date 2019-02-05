import React, { Component } from 'react';
import { getRandom, shuffle, range } from 'utils';

import Item from 'components/Item';
import GameOver from 'components/GameOver';
import Tooltip from 'components/Tooltip';
import ItemTooltip from 'components/ItemTooltip';

import styles from './styles.css';

class Game extends Component {
    constructor(props) {
        super(props);
        const { randomItem, randomComponents } = this.getRandomItem();

        this.state = {
            randomItem,
            randomComponents,
            selected: [],
            score: 0,
            combo: 0,
            guesses: props._GUESSES,
            gameover: false,
        };
    }

    componentDidUpdate(prevProps, prevState) {
        const { guesses, selected, randomItem } = this.state;

        if (guesses === 0) {
            this.setState({
                gameover: true,
            });
        }

        if (prevState.guesses !== guesses) return;

        if (selected.length === randomItem.components.length) {
            this.validateSelectedItems();
        }
    }

    handleNewGame = () => {
        const { _GUESSES: guesses, _INITIAL_SCORE: score, _INITIAL_COMBO: combo } = this.props;
        const { randomItem, randomComponents } = this.getRandomItem();

        this.setState({
            randomItem,
            randomComponents,
            guesses,
            score,
            combo,
            selected: [],
            gameover: false,
        });
    };

    getRandomItem = () => {
        const { _RANDOM_ITEMS, baseItems, itemdata, allItems } = this.props;

        const createdItems = allItems.filter(item => item.created && item.components);
        const allIdsCreatedItems = createdItems.map(item => item.id);

        const randomIndex = getRandom(allIdsCreatedItems.length);
        const randomId = allIdsCreatedItems[randomIndex];
        const randomItem = createdItems.find(item => item.id === randomId);
        const { components } = randomItem;
        const { length } = components;

        const dataComponents = components.map(name => ({ ...itemdata[name], name }));

        const needItems = _RANDOM_ITEMS - length;
        const arrayOfItems = range(needItems).map(() => {
            const index = getRandom(baseItems.length);

            return baseItems[index];
        });

        const selected = range(length);
        const randomComponents = shuffle([...dataComponents, ...arrayOfItems]);

        return { randomItem, randomComponents, selected };
    };

    validateSelectedItems = () => {
        const { randomItem, selected } = this.state;
        const validate = randomItem.components.every(item => selected.indexOf(item) !== -1);

        if (validate) {
            const { _ANSWER_POINT, _INITIAL_POINT } = this.props;
            const { randomItem: newRandomItem, randomComponents } = this.getRandomItem();

            this.setState(prevState => ({
                randomItem: newRandomItem,
                randomComponents,
                selected: [],
                score: prevState.score ? prevState.score + _ANSWER_POINT : prevState.score + _INITIAL_POINT,
                combo: prevState.combo + 1,
            }));
        } else {
            this.setState(prevState => ({
                guesses: prevState.guesses - 1,
                combo: 0,
            }));
        }
    };

    handleClickItem = name => {
        const { selected, randomItem } = this.state;

        if (selected.length === randomItem.components.length) return;

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
                    {selected.map((item, index) => {
                        const dataItem = itemdata[item];

                        return (
                            <div key={index} className={styles.button}>
                                {dataItem && (
                                    <Tooltip tooltip={<ItemTooltip {...dataItem} />}>
                                        <Item
                                            {...dataItem}
                                            name={item}
                                            onClick={this.handleClickRecipeItem}
                                        />
                                    </Tooltip>
                                )}
                            </div>
                        );
                    })}
                </div>
                <div className={styles.buttons}>
                    {randomComponents.map((item, index) => (
                        <div key={index} className={styles.button}>
                            <Tooltip tooltip={<ItemTooltip {...item} />}>
                                <Item
                                    {...item}
                                    name={item.name}
                                    onClick={this.handleClickItem}
                                    disabled={selected.indexOf(item.name) !== -1}
                                />
                            </Tooltip>
                        </div>
                    ))}
                    <div className={styles.button}>
                        <Item
                            {...itemdata.recipe}
                            name="recipe"
                            onClick={this.handleClickItem}
                            disabled={selected.indexOf('recipe') !== -1}
                        />
                    </div>
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
