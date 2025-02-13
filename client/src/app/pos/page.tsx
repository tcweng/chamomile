"use client";

import {
  SaleReceipt,
  useCreateSalesReceiptMutation,
  useGetProductsQuery,
  useGetCollectionQuery,
} from "@/state/api";
import { useState } from "react";
import {
  Banknote,
  CreditCard,
  Gift,
  Minus,
  Pencil,
  Plus,
  Trash2,
  Wallet,
} from "lucide-react";
import { Alert, ToggleButton, ToggleButtonGroup } from "@mui/material";

type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  unitPrice?: number;
  totalAmount?: number;
  remark?: string;
};

const POS = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [createSalesReceipt, { isSuccess }] = useCreateSalesReceiptMutation();
  const [cartTotal, setCartTotal] = useState(0);
  const [payment, setPayment] = useState<string>("Cash");
  const [editItem, setEditItem] = useState<string | null>();
  const [discount, setDiscount] = useState<number | null>();
  const [searchCollection, setSearchCollection] = useState<number>();
  const {
    data: products,
    isLoading,
    isError,
  } = useGetProductsQuery({ collectionQuery: searchCollection });
  const {
    data: collections,
    isLoading: isCollectionsLoading,
    isError: isCollectionsError,
  } = useGetCollectionQuery();

  const handleCollectionChange = (newValue: number) => {
    if (newValue == 0) {
      setSearchCollection(undefined);
    } else {
      setSearchCollection(newValue);
    }
  };

  // SET PAYMENT METHOD FOR THE RECEIPT
  const handlePayment = (
    event: React.MouseEvent<HTMLElement>,
    newPayment: string
  ) => {
    setPayment(newPayment);
  };

  // Recalculate Total Amount
  const updateTotalAmount = (tempCart: CartItem[]) => {
    const updatedCartTotal = tempCart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    setCartTotal(updatedCartTotal);
  };

  // ADD ITEM TO CART
  const handleAddToCart = (product: {
    productId: string;
    name: string;
    price: number;
    stockQuantity: number;
  }) => {
    setCart((prevCart) => {
      let newCart;
      // Check if the product already exists in the cart
      const existingProduct = prevCart.find(
        (item) => item.productId === product.productId
      );

      if (existingProduct) {
        // Increment the quantity of the existing product
        newCart = prevCart.map((item) =>
          // If Item click matched with productId in Cart & quantity is less than available total quantity
          item.productId === product.productId &&
          item.quantity < product.stockQuantity
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add the new product with a quantity of 1
        newCart = [...prevCart, { ...product, quantity: 1 }];
      }
      updateTotalAmount(newCart);
      return newCart;
    });
  };

  // INCREASE ITEM QUANTITY IN CART
  const handleQtyIncrement = (item: CartItem) => {
    let newCart;

    setCart((prevCart) => {
      newCart = prevCart.map((cartItem) =>
        cartItem.productId === item.productId
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );

      updateTotalAmount(newCart);
      return newCart;
    });
  };

  // INCREASE ITEM QUANTITY IN CART
  const handleQtyDecrement = (item: CartItem) => {
    let newCart;

    setCart((prevCart) => {
      newCart = prevCart.map((cartItem) =>
        cartItem.productId === item.productId && cartItem.quantity != 1
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      );

      updateTotalAmount(newCart);
      return newCart;
    });
  };

  // REMOVE ITEM FROM CART
  const removeCartItem = (item: CartItem) => {
    const newCart = cart.filter(
      (cartItem) => cartItem.productId !== item.productId
    );
    updateTotalAmount(newCart);
    setCart(newCart);
  };

  // HIDE / SHOW EDIT FIELDS
  const editMode = (productId: string) => {
    setEditItem((prev) => (prev === productId ? null : productId));
  };

  // SET DISCOUNT
  const applyDiscount = (item: CartItem, value: number | null) => {
    let newCart;
    setCart((prevCart) => {
      newCart = prevCart.map((cartItem) =>
        cartItem.productId === item.productId
          ? {
              ...cartItem,
              price: cartItem.price * (1 - (value === null ? 0 : value) / 100),
            }
          : cartItem
      );

      updateTotalAmount(newCart);
      return newCart;
    });
  };

  // SET DISCOUNT BY SPECIFIC AMOUNT
  const applyDiscountByAmount = (
    item: CartItem,
    value: number | null | undefined
  ) => {
    let newCart;
    setCart((prevCart) => {
      newCart = prevCart.map((cartItem) =>
        cartItem.productId === item.productId
          ? {
              ...cartItem,
              price:
                value === null || value === undefined
                  ? cartItem.price
                  : value >= cartItem.price
                  ? 0
                  : cartItem.price - value,
            }
          : cartItem
      );

      updateTotalAmount(newCart);
      return newCart;
    });
  };

  // SET REMARK FOR CART ITEM
  const setRemark = (item: CartItem, value: string) => {
    setCart((prevCart) =>
      prevCart.map((cartItem) =>
        cartItem.productId === item.productId
          ? { ...cartItem, remark: value }
          : cartItem
      )
    );
  };

  // CHECKOUT ITEMS IN CART INTO SALES & SALES RECEIPT
  const handleCheckout = async () => {
    // Check if Cart is Empty
    if (cart.length === 0) {
      console.log("Empty");
      return;
    }

    // Get TotalAmount
    // const sum = total.reduce((previousValue, currentValue, index) => previousValue + currentValue, 0);
    // cart.reduce() access the cart's array values.
    // total = previous value; item = current value; accumulator value is 0.
    const totalAmount = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const checkoutData: SaleReceipt = {
      cart: cart.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        unitPrice: item.price,
        totalAmount: item.price * item.quantity,
        remark: item.remark,
      })),
      total: totalAmount,
      remark: payment,
    };

    try {
      await createSalesReceipt(checkoutData);
      handleClearCart();
      alert("Order successfully created.");
    } catch (error) {
      console.log("Checkout failed:", error);
    }
  };

  const handleClearCart = () => {
    setCart([]);
    setCartTotal(0);
  };

  // CSS STYLE
  const quantityStyle =
    "w-5 h-5 p-0.5 text-slate-400 bg-zinc-100 rounded hover:bg-zinc-300 hover:text-slate:600 transition-all";
  const tabStyle = "bg-blue-500 text-white font-semibold rounded-lg";

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="text center text-red-500 py-4">
        Failed to fetch products
      </div>
    );
  }

  return (
    <div className="mx-auto w-full">
      {/* BODY PRODUCT LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] xl:grid-cols-[3fr_1.5fr] gap-4">
        <div>
          {/* TAB */}
          <div className="flex gap-2 mb-2 bg-white p-2 rounded-md border border-gray-200">
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              collections?.map((collection) => (
                <button
                  key={collection.collectionId}
                  onClick={() =>
                    handleCollectionChange(collection.collectionId)
                  }
                  // Default Style
                  className={`px-4 py-2 rounded-lg transition-all ${
                    // Active Style
                    searchCollection == collection.collectionId
                      ? `${tabStyle}`
                      : collection.name === "None" && searchCollection == null
                      ? `${tabStyle}`
                      : `hover:bg-gray-200`
                  }`}
                >
                  {collection.name == "None" ? "All" : collection.name}
                </button>
              ))
            )}
          </div>
          {/* Product List */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4 h-screen">
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              products?.map((product) => (
                <button
                  key={product.productId}
                  className="bg-white border border-gray-200 rounded-md p-3 w-full h-fit"
                  onClick={() => handleAddToCart(product)}
                >
                  <div className="flex flex-col items-start">
                    <div className="w-full h-36 bg-blue-200 rounded-md mb-2"></div>
                    <h3 className="text-lg text-gray-900 font-semibold">
                      {product.name}
                    </h3>
                    <p className="text-gray-500">
                      RM {product.price.toFixed(2)}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
        {/* Cart */}
        <div className="flex flex-col p-2 justify-between bg-white shadow rounded-2xl lg:h-screen lg:sticky lg:top-4">
          {/* TOP */}
          <div className="flex flex-col gap-4 p-4 pb-2">
            <div className="flex flex-row justify-between items-center">
              <h3 className="text-xl font-medium text-gray-900 ">
                Order Details
              </h3>
              {cart.length > 0 ? (
                <button
                  className="bg-zinc-100 px-4 py-1 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-zinc-200 transition-all"
                  onClick={handleClearCart}
                >
                  Clear
                </button>
              ) : (
                ""
              )}
            </div>

            {/* ITEMS */}
            <div>
              {cart.length === 0 ? (
                <p className="border-t pt-4">Cart is Empty</p>
              ) : (
                cart.map((item) => (
                  <div key={item.productId} className="border-t pb-4 pt-4">
                    <div className="flex flex-row gap-6 items-center">
                      {/* IMAGE */}
                      <div className="h-20 aspect-square bg-slate-200 rounded"></div>
                      {/* NAME & PRICE */}
                      <div className="w-full flex gap-1 flex-col">
                        <p className="text-lg font-medium">{item.name}</p>
                        <p className=" text-sm text-blue-700">
                          RM {(item.quantity * item.price).toFixed(2)}
                        </p>
                        {/* QUANTITY */}
                        <div className="flex flex-row gap-3">
                          <button onClick={() => handleQtyDecrement(item)}>
                            <Minus className={quantityStyle}></Minus>
                          </button>
                          <p className="text-lg">{item.quantity}</p>
                          <button onClick={() => handleQtyIncrement(item)}>
                            <Plus className={quantityStyle}></Plus>
                          </button>
                        </div>
                      </div>
                      {/* EDIT */}
                      <div>
                        <button onClick={() => editMode(item.productId)}>
                          <Pencil className="w-4 h-4 text-gray-400"></Pencil>
                        </button>
                      </div>
                    </div>
                    {/* EDIT FIELDS */}
                    {editItem === item.productId && (
                      <div>
                        <div className="mt-4 flex flex-row items-center gap-2 flex-wrap">
                          <input
                            type="textarea"
                            name="remark"
                            value={item.remark || ""}
                            placeholder="Note: Add some remark"
                            onChange={(e) => setRemark(item, e.target.value)}
                            className="block w-full p-2 border rounded-md"
                          ></input>
                          {/* SET DISCOUNT BY AMOUNT */}
                          <input
                            type="number"
                            name="discount"
                            placeholder="Discount Amount"
                            onChange={(e) => {
                              const value = parseFloat(e.target.value);
                              setDiscount(isNaN(value) ? null : value);
                            }}
                            className="flex-1 p-2 border rounded-md"
                          ></input>
                          <button
                            type="button"
                            value="0"
                            onClick={() =>
                              applyDiscountByAmount(item, discount)
                            }
                            className="w-fit px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition-all"
                          >
                            APPLY
                          </button>
                          {/* FREE GIFT (DISCOUNT ITEM BY 100%) */}
                          <button
                            className="flex items-center p-1 pr-3 bg-blue-600 text-white rounded h-full hover:bg-blue-700 transition-all"
                            onClick={(e) => {
                              applyDiscount(item, 100);
                            }}
                          >
                            <Gift className="p-1 text-slate-100"></Gift>{" "}
                            FREEBIES
                          </button>
                          {/* REMOVE ITEM */}
                          <button
                            className="p-1 bg-red-400 text-white rounded h-full hover:bg-red-500 transition-all"
                            onClick={() => removeCartItem(item)}
                          >
                            <Trash2 className="p-1"></Trash2>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
          {/* BOTTOM */}
          <div className="flex flex-col p-4 bg-gray-50 rounded-2xl">
            <p className="text-4xl font-medium text-end mb-2">
              RM {cartTotal.toFixed(2)}
            </p>
            <ToggleButtonGroup
              value={payment}
              exclusive
              color="primary"
              onChange={handlePayment}
              aria-label="payment"
              className="mt-2 border-gray-200"
            >
              <ToggleButton
                value="Cash"
                aria-label="cash"
                className="flex- flex-col w-full gap-1"
              >
                <Banknote />
                Cash
              </ToggleButton>
              <ToggleButton
                value="E-Wallet"
                aria-label="e-wallet"
                className="flex- flex-col w-full gap-1"
              >
                <Wallet />
                E-Wallet
              </ToggleButton>
              <ToggleButton
                value="Bank"
                aria-label="bank"
                className="flex- flex-col w-full gap-1"
              >
                <CreditCard />
                Bank
              </ToggleButton>
            </ToggleButtonGroup>
            <button
              type="button"
              className="mt-4 px-4 py-4 text-white bg-blue-600 rounded text-lg font-medium hover:bg-blue-700 transition-all"
              onClick={handleCheckout}
            >
              Complete Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POS;
