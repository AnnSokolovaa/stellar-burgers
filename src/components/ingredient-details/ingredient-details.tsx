import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '@selectors';
import { getIngredients, getIngredientsSelector } from '@slices';

export const IngredientDetails: FC = () => {
  const { id } = useParams();
  const { data } = useSelector(getIngredientsSelector);
  const dispatch = useDispatch();
  const ingredientData = data.find((item) => item._id === id);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
