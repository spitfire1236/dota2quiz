import React from 'react';

import styles from './styles.css';
import shopIcon from './images/shop_main.png';
import shopSide from './images/shop_side.png';
import goldIcon from './images/gold_icon.png';
import manaIcon from './images/mana_icon.png';
import cooldownIcon from './images/cooldown_icon.png';

const createMarkup = html => ({
    __html: html,
});

export default ({ dname, img, desc, attrib, notes, cost, lore, builds, mc, cd }) => (
    <div className={styles.tooltip}>
        <div className={styles.header}>
            <div className={styles.avatar}>
                <div className={styles.image}>
                    <a href="/items/power-treads">
                        <img src={`/images/items/${img}`} title="" alt={dname} />
                    </a>
                </div>
            </div>
            <div className={styles.name}>{dname}</div>
            <div className={styles.shopIcons}>
                <img src={shopIcon} alt="Shop main" />
                <img src={shopSide} alt="Shop side" />
            </div>
            <div className={styles.price}>
                <span className={styles.goldIcon}>
                    <img src={goldIcon} alt="Gold icon reborn" />
                </span>
                {cost}
            </div>
        </div>
        {attrib && <div className={styles.attrib} dangerouslySetInnerHTML={createMarkup(attrib)} />}
        {desc && (
            <div className={styles.description}>
                <div className={styles.descriptionBlock} dangerouslySetInnerHTML={createMarkup(desc)} />
                {cd || mc ? (
                    <div className={styles.cooldownAndCost}>
                        {cd && (
                            <div className={styles.cooldown}>
                                <img src={cooldownIcon} alt="Cooldown icon" />
                                <span className="value">{cd}</span>
                            </div>
                        )}
                        {mc && (
                            <div className={styles.manacost}>
                                <img src={manaIcon} alt="Mana icon" />
                                <span className="value">{mc}</span>
                            </div>
                        )}
                    </div>
                ) : (
                    ''
                )}
            </div>
        )}
        {notes && <div className={styles.notes} dangerouslySetInnerHTML={createMarkup(notes)} />}
        {lore && <div className={styles.lore}>{lore}</div>}
        {builds && builds.length ? (
            <div className={styles.build}>
                <div className={styles.title}>
                    <span className="smaller">Builds from</span>
                </div>
                <div className={styles.order}>
                    {builds.map((item, index) => (
                        <div key={`${item.dname}${index}`} className={styles.buildItem}>
                            {item.img && (
                                <div className={styles.buildIcon}>
                                    <div className="image-container image-container-icon image-container-item">
                                        <a href="/items/belt-of-strength">
                                            <img
                                                className={styles.buildItemImage}
                                                src={item.img}
                                                title={item.dname}
                                                alt={item.dname}
                                            />
                                        </a>
                                    </div>
                                </div>
                            )}

                            <div className={styles.buildItemCost}>
                                <span className="number">{item.cost}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        ) : (
            ''
        )}
    </div>
);
