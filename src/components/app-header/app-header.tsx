import { FC, useEffect } from 'react';
import { AppHeaderUI } from '@ui';
import { useDispatch, useSelector } from '@selectors';
import { checkUserAuth, getIsAuthChecked, getUser } from '@slices';

export const AppHeader: FC = () => {
  const user = useSelector(getUser);
  useEffect(() => {}, [user]);
  return <AppHeaderUI userName={user?.name || ''} />;
};
