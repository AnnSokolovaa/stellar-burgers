import { useDispatch, useSelector } from '@selectors';
import { getFeeds, getIngredients, getOrdersSelector } from '@slices';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';

export const Feed: FC = () => {
  const { orders } = useSelector(getOrdersSelector);
  const dispatch = useDispatch();

  const refresh = () => {
    dispatch(getFeeds());
  };

  useEffect(() => {
    refresh();
  }, []);

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={refresh} />;
};
