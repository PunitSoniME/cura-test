import React from "react";
import { BsChevronRight, BsChevronLeft } from 'react-icons/bs';
import { VisibilityContext } from "react-horizontal-scrolling-menu";

export function LeftArrow() {
    const {
        isFirstItemVisible,
        scrollPrev,
        visibleItemsWithoutSeparators,
        initComplete
    } = React.useContext(VisibilityContext);

    const [disabled, setDisabled] = React.useState(
        !initComplete || (initComplete && isFirstItemVisible)
    );
    React.useEffect(() => {
        // NOTE: detect if whole component visible
        if (visibleItemsWithoutSeparators.length) {
            setDisabled(isFirstItemVisible);
        }
    }, [isFirstItemVisible, visibleItemsWithoutSeparators]);

    return (
        disabled ? <BsChevronLeft style={{ color: "#D8D8D8" }} /> : <BsChevronLeft className="cursor-pointer" onClick={() => scrollPrev()} />
    );
}

export function RightArrow() {
    const {
        isLastItemVisible,
        scrollNext,
        visibleItemsWithoutSeparators
    } = React.useContext(VisibilityContext);

    // console.log({ isLastItemVisible });
    const [disabled, setDisabled] = React.useState(
        !visibleItemsWithoutSeparators.length && isLastItemVisible
    );
    React.useEffect(() => {
        if (visibleItemsWithoutSeparators.length) {
            setDisabled(isLastItemVisible);
        }
    }, [isLastItemVisible, visibleItemsWithoutSeparators]);

    return (
        disabled ? <BsChevronRight style={{ color: "#D8D8D8" }} /> : <BsChevronRight className="cursor-pointer" onClick={() => scrollNext()} />
    );
}
