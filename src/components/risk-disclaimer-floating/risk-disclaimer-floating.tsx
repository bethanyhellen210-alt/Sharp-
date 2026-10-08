import { useRef, useState } from 'react';
import styles from './risk-disclaimer-floating.module.scss';

const RiskDisclaimerFloating = () => {
    const [is_open, setIsOpen] = useState(false);
    const [position, setPosition] = useState(() => ({
        x: typeof window === 'undefined' ? 20 : Math.max(12, window.innerWidth - 190),
        y: typeof window === 'undefined' ? 80 : Math.max(12, window.innerHeight - 90),
    }));
    const drag_offset = useRef({ x: 0, y: 0 });
    const drag_start = useRef({ x: 0, y: 0 });
    const did_drag = useRef(false);

    const onPointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        drag_offset.current = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
        drag_start.current = { x: event.clientX, y: event.clientY };
        did_drag.current = false;
        event.currentTarget.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
        if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;

        const moved_x = Math.abs(event.clientX - drag_start.current.x);
        const moved_y = Math.abs(event.clientY - drag_start.current.y);
        if (moved_x > 4 || moved_y > 4) did_drag.current = true;

        const width = event.currentTarget.offsetWidth;
        const height = event.currentTarget.offsetHeight;
        const max_x = Math.max(12, window.innerWidth - width - 12);
        const max_y = Math.max(12, window.innerHeight - height - 12);

        setPosition({
            x: Math.min(max_x, Math.max(12, event.clientX - drag_offset.current.x)),
            y: Math.min(max_y, Math.max(12, event.clientY - drag_offset.current.y)),
        });
    };

    const onPointerUp = (event: React.PointerEvent<HTMLButtonElement>) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
    };

    const onTriggerClick = () => {
        if (!did_drag.current) setIsOpen(true);
        did_drag.current = false;
    };

    return (
        <>
            <button
                className={styles.trigger}
                style={{ left: position.x, top: position.y }}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onClick={onTriggerClick}
                type='button'
                aria-label='Move or open Risk Disclaimer'
            >
                <span className={styles.icon}>!</span>
                <span>Risk Disclaimer</span>
            </button>

            {is_open && (
                <div className={styles.overlay} onClick={() => setIsOpen(false)}>
                    <div
                        className={styles.modal}
                        onClick={event => event.stopPropagation()}
                        role='dialog'
                        aria-modal='true'
                        aria-labelledby='risk-disclaimer-title'
                    >
                        <div className={styles.header}>
                            <div className={styles.badge}>!</div>
                            <h3 className={styles.title} id='risk-disclaimer-title'>
                                Risk Disclaimer
                            </h3>
                            <button
                                className={styles.close}
                                onClick={() => setIsOpen(false)}
                                type='button'
                                aria-label='Close risk disclaimer'
                            >
                                x
                            </button>
                        </div>

                        <div className={styles.body}>
                            <p>
                                Deriv offers complex derivatives, such as options and contracts for difference
                                (&ldquo;CFDs&rdquo;). These products may not be suitable for all clients, and trading
                                them puts you at risk. Please make sure that you understand the following risks before
                                trading Deriv products:
                            </p>
                            <ul className={styles.list}>
                                <li>You may lose some or all of the money you invest in the trade.</li>
                                <li>
                                    If your trade involves currency conversion, exchange rates will affect your profit
                                    and loss.
                                </li>
                                <li>
                                    You should never trade with borrowed money or with money that you cannot afford to
                                    lose.
                                </li>
                            </ul>
                        </div>

                        <div className={styles.footer}>
                            <button className={styles.confirm} onClick={() => setIsOpen(false)} type='button'>
                                I Understand
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default RiskDisclaimerFloating;
