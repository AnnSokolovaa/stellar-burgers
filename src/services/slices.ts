import {
  TLoginData,
  TRegisterData,
  getFeedsApi,
  getIngredientsApi,
  getOrderByNumberApi,
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  orderBurgerApi,
  registerUserApi,
  updateUserApi
} from '@api';
import {
  PayloadAction,
  createAsyncThunk,
  createSlice,
  nanoid
} from '@reduxjs/toolkit';
import {
  TConstructorIngredient,
  TIngredient,
  TOrder,
  TUser
} from '@utils-types';
import { deleteCookie, getCookie, setCookie } from '../utils/cookie';

export const getIngredients = createAsyncThunk('common/ingredients', async () =>
  getIngredientsApi()
);

export const getFeeds = createAsyncThunk('common/feeds', async () =>
  getFeedsApi()
);

export const getOrderByNumber = createAsyncThunk(
  'common/order',
  async (orderNumber: number) => getOrderByNumberApi(orderNumber)
);

type TConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
  orderRequest: boolean;
  orderModalData: TOrder | null;
};

type TCommonState = {
  data: TIngredient[];
  orderData: TOrder | null;
  orders: TOrder[];
  total: number;
  totalToday: number;
  isIngredientsLoading: boolean;
  isOrderLoading: boolean;
};

export enum Direction {
  MoveUP,
  MoveDown,
  Delete
}

type TMoveAction = {
  index: number;
  direction: Direction;
};

const commonInitialState: TCommonState = {
  data: [],
  orderData: null,
  orders: [],
  total: 0,
  totalToday: 0,
  isIngredientsLoading: false,
  isOrderLoading: false
};

const constructorInitialState: TConstructorState = {
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderModalData: null
};

const commonSlice = createSlice({
  name: 'common',
  initialState: commonInitialState,
  selectors: {
    getIngredientsSelector: (state) => ({
      data: state.data,
      isIngredientsLoading: state.isIngredientsLoading
    }),
    getOrdersSelector: (state) => ({
      orders: state.orders,
      feed: { total: state.total, totalToday: state.totalToday }
    }),
    getOrderData: (state) => state.orderData
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.isIngredientsLoading = true;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.isIngredientsLoading = false;
        console.log(
          `Не удалось загрузить ингредиенты, ошибка: ${action.error}`
        );
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.isIngredientsLoading = false;
        state.data = action.payload;
      })
      .addCase(getFeeds.rejected, (_, action) => {
        console.log(`Не удалось загрузить заказы: ${action.error}`);
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.isOrderLoading = true;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.isOrderLoading = false;
        [state.orderData] = action.payload.orders;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.isOrderLoading = false;
        console.log(`Не удалось загрузить заказ: ${action.error}`);
      });
  },
  reducers: {}
});

type TPlaceOrder = {
  ingredients: TConstructorIngredient[];
};

export const placeOrder = createAsyncThunk(
  'orderConstructor/place',
  ({ ingredients }: TPlaceOrder) =>
    orderBurgerApi(ingredients.map((ingredient) => ingredient._id))
);

const constructorSlice = createSlice({
  name: 'orderConstructor',
  initialState: constructorInitialState,
  selectors: {
    getConstructorItems: (state) => ({
      bun: state.bun,
      ingredients: state.ingredients
    }),
    getConstructorState: (state) => ({
      constructorItems: {
        bun: state.bun,
        ingredients: state.ingredients
      },
      orderRequest: state.orderRequest,
      orderModalData: state.orderModalData
    })
  },
  reducers: {
    cleanIngredients: (state) => {
      state.orderRequest = false;
      state.orderModalData = null;
    },
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      const ingredient = action.payload;
      if (ingredient.type === 'bun') {
        state.bun = ingredient;
        return;
      }

      state.ingredients.push({
        id: nanoid(),
        ...ingredient
      });
    },
    moveIngredient: (state, action: PayloadAction<TMoveAction>) => {
      const { index, direction } = action.payload;
      const { ingredients } = state;
      console.log(ingredients);
      const temp = ingredients[index];
      switch (direction) {
        case Direction.Delete:
          ingredients.splice(index, 1);
          break;
        case Direction.MoveUP:
          ingredients[index] = ingredients[index - 1];
          ingredients[index - 1] = temp;
          break;
        case Direction.MoveDown:
          ingredients[index] = ingredients[index + 1];
          ingredients[index + 1] = temp;
          break;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
        state.bun = null;
        state.ingredients = [];
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.orderRequest = false;
        console.log(`Не удалось создать заказ, ошибка: ${action.error}`);
      });
  }
});

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => registerUserApi(data)
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => loginUserApi(data)
);

export const updateUser = createAsyncThunk(
  'user/update',
  async (user: Partial<TRegisterData>) => updateUserApi(user)
);

export const logoutUser = createAsyncThunk('user/logout', async () =>
  logoutApi()
);

export const getOrders = createAsyncThunk('user/orders', async () =>
  getOrdersApi()
);

type TUserState = {
  user: {
    name: string;
    email: string;
  } | null;
  isAuthChecked: boolean;
  orders: TOrder[];
};

const userInitialState: TUserState = {
  user: null,
  isAuthChecked: false,
  orders: []
};

const userSlice = createSlice({
  name: 'user',
  initialState: userInitialState,
  selectors: {
    getUser: (state) => state.user,
    getIsAuthChecked: (state) => state.isAuthChecked,
    selectUserOrders: (state) => state.orders
  },
  reducers: {
    authChecked: (state) => {
      state.isAuthChecked = true;
    },
    setUser: (state, action: PayloadAction<TUser>) => {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        setCookie('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        setCookie('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        deleteCookie('accessToken');
        localStorage.removeItem('refreshToken');
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      });
  }
});

export const checkUserAuth = createAsyncThunk(
  'user/checkUser',
  (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      getUserApi()
        .then(({ user }) => {
          dispatch(userSlice.actions.setUser(user));
        })
        .finally(() => {
          dispatch(authChecked());
        });
    } else {
      dispatch(authChecked());
    }
  }
);

export const rootReducer = {
  common: commonSlice.reducer,
  orderConstructor: constructorSlice.reducer,
  user: userSlice.reducer
};
export const { getIngredientsSelector, getOrdersSelector, getOrderData } =
  commonSlice.selectors;
export const { getUser, getIsAuthChecked, selectUserOrders } =
  userSlice.selectors;
export const { getConstructorItems, getConstructorState } =
  constructorSlice.selectors;

export const { authChecked } = userSlice.actions;
export const { cleanIngredients, addIngredient, moveIngredient } =
  constructorSlice.actions;
