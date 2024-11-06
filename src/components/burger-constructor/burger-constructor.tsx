import { FC, useEffect, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '@selectors';
import {
  checkUserAuth,
  cleanIngredients,
  getConstructorState,
  getIsAuthChecked,
  getUser,
  placeOrder
} from '@slices';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const { constructorItems, orderRequest, orderModalData } =
    useSelector(getConstructorState);
  const dispatch = useDispatch();
  const isAuthChecked = useSelector(getIsAuthChecked);
  const user = useSelector(getUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthChecked) {
      dispatch(checkUserAuth);
    }
  }, []);

  const onOrderClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    dispatch(placeOrder(constructorItems));
  };
  const closeOrderModal = () => {
    dispatch(cleanIngredients());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
