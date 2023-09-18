
// import { useContext } from "react";
// import { CartContext } from "../store";

export default function Cart() {
    //   const [state,dispatch] =useContext(CartContext)
    return (
        <div className="bg-light p-3">
            {/* align-middle-整列垂直置中 */}
            <table className="table align-middle">
                <tbody>
                    {/* {state.cartList.map((item) => { */}
                    return (
                    <tr>
                        {/* <tr key={item.id}> */}
                        <td>
                            <button type="button" className="btn btn-sm"
                            // onClick={
                            //     () => {
                            //         dispatch({
                            //             type: "REMOVE_CART_ITEM",
                            //             payload: {
                            //                 ...item,
                            //             }
                            //         })
                            //     }
                            // }
                            >x</button>
                        </td>
                        <td>
                            iphone
                            {/* {item.title} */}
                            <br />
                            <small className="text-muted">NT$18000
                                {/* {item.price} */}
                            </small>
                        </td>
                        <td>
                            <select className="form-select"
                                // value={item.quantity}
                                // onChange={(e) => {
                                //     e.preventDefault();
                                //     // 選擇項目時，把數值取出來，並轉為純數值，計算才不會出錯
                                //     const quantity = parseInt(e.target.value);
                                //     dispatch({
                                //         type: 'CHANGE_CART_QUANTITY',
                                //         payload: {
                                //             ...item,
                                //             quantity,
                                //         }
                                //     })
                                // }}
                                >
                                {/*給他一個陣列 .map((_,i)) 第一個值是陣列內的參數 */}
                                {[...Array(20)].map((_, i) => {
                                    return (
                                        <option value={i + 1} key={i}>{i + 1}</option>
                                    )
                                })}
                            </select>
                        </td>
                        <td className="text-end">
                            $$NT180000
                            {/* {item.price * item.quantity} */}
                        </td>
                    </tr>)
                    {/* })} */}

                </tbody>
                <tfoot>
                    <tr>
                        {/* colSpan-與上方td做整合 */}
                        <td colSpan={5} className="text-end">
                            $NT
                            {/* {state.total || 0} */}
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    )
}