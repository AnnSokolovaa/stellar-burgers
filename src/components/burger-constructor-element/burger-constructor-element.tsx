import { FC, memo, useEffect } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch } from '@selectors';
import { Direction, moveIngredient } from '@slices';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();
    const handleMoveDown = () => {
      dispatch(moveIngredient({ index, direction: Direction.MoveDown }));
    };

    const handleMoveUp = () => {
      dispatch(moveIngredient({ index, direction: Direction.MoveUP }));
    };

    const handleClose = () => {
      dispatch(moveIngredient({ index, direction: Direction.Delete }));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
