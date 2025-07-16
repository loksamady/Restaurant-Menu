import { useState } from "react";
import { ShoppingCartIcon, Trash2, XIcon } from "lucide-react";
import { MinusCircle, PlusCircle } from "lucide-react"; //
import amok from "@src/assets/menus/amok.jpg";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

import { Button } from "primereact/button";

// import kapi_phav from "@src/assets/menus/kapi_phav.jpg";
// import morn_bom_pong from "@src/assets/menus/morn_bom_pong.jpg";
// import nom_banh_jok from "@src/assets/menus/nom_banh_jok.jpg";
const ShoppingCart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  return (
    <>
      <div
        className={`w-[500px] h-screen bg-gray-200 fixed right-0 top-0 z-30 border-l-1 rounded-tl-lg
          ${isOpen ? "right-0" : "right-[-500px]"}`}
      >
        <div className="w-full h-16 bg-white absolute left-0 top-0 z-10 grid place-items-center border rounded-lg">
          <h1 className="text-xl text-gray-600 font-semibold uppercase">
            Shopping Cart
          </h1>
          <button
            className=" w-9 h-9 bg-yellow-400 absolute right-3 z-20 grid place-items-center  rounded-full
           hover:bg-yellow-500 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <XIcon className="text-white" />
          </button>
        </div>
        <button
          className="w-9 h-9 bg-yellow-400 absolute -left-14 top-3
        z-20 grid place-items-center  rounded-full mt-3"
          onClick={() => setIsOpen(true)}
        >
          <ShoppingCartIcon className="text-xs text-white" />
          <span
            className="w-6 h-6 bg-white border absolute -top-4
            left-5 grid place-items-center borde rounded-full text-sm font-bold text-red-500"
          >
            1
          </span>
        </button>
        <div className="h-screen flex flex-col gap-y-3 overflow-y-auto px-3 pb-24 pt-20 ">
          <div className="flex justify-between items-center gap-10 p-3 hover:bg-yellow-400">
            <img alt="logo" className="h-14" src={amok}></img>
            <h3>amok</h3>
            <div className="flex gap-6 flex-row justify-center items-center ml-14">
              <button
                type="button"
                className="ml-4 flex items-center justify-center rounded-full p-2 shadow transition"
                title="Add to cart"
              >
                <MinusCircle className="w-6 h-6" />
                <p className="flex items-center gap-x5 mx-1">
                  <span className="min-w-7 grid place-items-center rounded-full">
                    1
                  </span>
                </p>
                <PlusCircle className="w-6 h-6" />
              </button>
              <p>$10</p>
            </div>
            <Trash2 className="cursor-pointer w-6 h-6 text-red-600" />
          </div>
          <div className="flex justify-between items-center gap-10 p-3 hover:bg-yellow-400">
            <img alt="logo" className="h-14" src={amok}></img>
            <h3>amok</h3>
            <div className="flex gap-6 flex-row justify-center items-center ml-14">
              <button
                type="button"
                className="ml-4 flex items-center justify-center rounded-full p-2 shadow transition"
                title="Add to cart"
              >
                <MinusCircle className="w-6 h-6" />
                <p className="flex items-center gap-x5 mx-1">
                  <span className="min-w-7 grid place-items-center rounded-full">
                    1
                  </span>
                </p>
                <PlusCircle className="w-6 h-6" />
              </button>
              <p>$10</p>
            </div>
            <Trash2 className="cursor-pointer w-6 h-6 text-red-600" />
          </div>
          <div className="flex justify-between items-center gap-10 p-3 hover:bg-yellow-400">
            <img alt="logo" className="h-14" src={amok}></img>
            <h3>amok</h3>
            <div className="flex gap-6 flex-row justify-center items-center ml-14">
              <button
                type="button"
                className="ml-4 flex items-center justify-center rounded-full p-2 shadow transition"
                title="Add to cart"
              >
                <MinusCircle className="w-6 h-6" />
                <p className="flex items-center gap-x5 mx-1">
                  <span className="min-w-7 grid place-items-center rounded-full">
                    1
                  </span>
                </p>
                <PlusCircle className="w-6 h-6" />
              </button>
              <p>$10</p>
            </div>
            <Trash2 className="cursor-pointer w-6 h-6 text-red-600" />
          </div>
          <div className="flex justify-between items-center gap-10 p-3 hover:bg-yellow-400">
            <img alt="logo" className="h-14" src={amok}></img>
            <h3>amok</h3>
            <div className="flex gap-6 flex-row justify-center items-center ml-14">
              <button
                type="button"
                className="ml-4 flex items-center justify-center rounded-full p-2 shadow transition"
                title="Add to cart"
              >
                <MinusCircle className="w-6 h-6" />
                <p className="flex items-center gap-x5 mx-1">
                  <span className="min-w-7 grid place-items-center rounded-full">
                    1
                  </span>
                </p>
                <PlusCircle className="w-6 h-6" />
              </button>
              <p>$10</p>
            </div>
            <Trash2 className="cursor-pointer w-6 h-6 text-red-600" />
          </div>
          <div className="flex justify-between items-center gap-10 p-3 hover:bg-yellow-400">
            <img alt="logo" className="h-14" src={amok}></img>
            <h3>amok</h3>
            <div className="flex gap-6 flex-row justify-center items-center ml-14">
              <button
                type="button"
                className="ml-4 flex items-center justify-center rounded-full p-2 shadow transition"
                title="Add to cart"
              >
                <MinusCircle className="w-6 h-6" />
                <p className="flex items-center gap-x5 mx-1">
                  <span className="min-w-7 grid place-items-center rounded-full">
                    1
                  </span>
                </p>
                <PlusCircle className="w-6 h-6" />
              </button>
              <p>$10</p>
            </div>
            <Trash2 className="cursor-pointer w-6 h-6 text-red-600" />
          </div>
          <div className="flex justify-between items-center gap-10 p-3 hover:bg-yellow-400">
            <img alt="logo" className="h-14" src={amok}></img>
            <h3>amok</h3>
            <div className="flex gap-6 flex-row justify-center items-center ml-14">
              <button
                type="button"
                className="ml-4 flex items-center justify-center rounded-full p-2 shadow transition"
                title="Add to cart"
              >
                <MinusCircle className="w-6 h-6" />
                <p className="flex items-center gap-x5 mx-1">
                  <span className="min-w-7 grid place-items-center rounded-full">
                    1
                  </span>
                </p>
                <PlusCircle className="w-6 h-6" />
              </button>
              <p>$10</p>
            </div>
            <Trash2 className="cursor-pointer w-6 h-6 text-red-600" />
          </div>
          <div className="flex justify-between items-center gap-10 p-3 hover:bg-yellow-400">
            <img alt="logo" className="h-14" src={amok}></img>
            <h3>amok</h3>
            <div className="flex gap-6 flex-row justify-center items-center ml-14">
              <button
                type="button"
                className="ml-4 flex items-center justify-center rounded-full p-2 shadow transition"
                title="Add to cart"
              >
                <MinusCircle className="w-6 h-6" />
                <p className="flex items-center gap-x5 mx-1">
                  <span className="min-w-7 grid place-items-center rounded-full">
                    1
                  </span>
                </p>
                <PlusCircle className="w-6 h-6" />
              </button>
              <p>$10</p>
            </div>
            <Trash2 className="cursor-pointer w-6 h-6 text-red-600" />
          </div>
        </div>
        <div className="w-full h-[250px] bg-white absolute bottom-0 left-0 z-10 grid p-5 border rounded-lg">
          {/* Right: Payment Summary */}
          <div>
            <div className="font-bold text-lg mb-4">Payment Summary</div>
            <div className="flex justify-between mb-2 text-sm">
              <span>Subtotal</span>
            </div>
            <div className="flex justify-between mb-2 text-sm">
              <span>Discount</span>
              <span>—</span>
            </div>
            <div className="flex justify-between mb-2 text-sm">
              <span>Tax (10%)</span>
            </div>
            <div className="flex justify-between mb-4 text-base font-bold border-t pt-2">
              <span>Total Payable</span>
            </div>
            <button
              onClick={() => setVisible(true)}
              className="flex-1 rounded bg-green-600 p-4 w-full hover:bg-green-700 text-white font-semibold border border-green-700"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
      <Dialog
        className="font-bold uppercase"
        header="info-user"
        visible={visible}
        style={{ width: "35vw" }}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
      >
        <div className="flex flex-col gap-4">
          <InputText className="w-full" placeholder="ID" />
          <InputText className="w-full" placeholder="UserName" />
          <InputText className="w-full" placeholder="PhoneNumber" />
          <InputText className="w-full" placeholder="Location" />
          <div className="card flex justify-content-center">
            <Button label="Submit" />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default ShoppingCart;
