import React, { Component } from "react";

export default class InputField extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className="input-group mb-3">
          <input
            type="text"
            ref={input => {
              this.productName = input;
            }}
            className="form-control"
            placeholder="Recipient's username"
            aria-label="Recipient's username"
            aria-describedby="basic-addon2"
          />
          <div className="input-group-append">
            <span className="input-group-text" id="basic-addon2"></span>
          </div>
        </div>

        <br></br>

        <div className="input-group">
          <input
            type="text"
            ref={input => {
              this.productPrice = input;
            }}
            className="form-control"
            placeholder="Price"
            aria-label="Dollar amount (with dot and two decimal places)"
          />
          <div className="input-group-append">
            <span className="input-group-text">$</span>
            <span className="input-group-text">0.00</span>
          </div>
        </div>
        <br></br>

        <button
          type="button"
          onClick={event => {
            event.preventDefault();
            const name = this.productName.value;
            const price = window.web3.utils.toWei(
              this.productPrice.value.toString(),
              "Ether"
            );
            this.props.createProduct(name, price);
          }}
          className="btn btn-primary btn-sm"
        >
          Add Product
        </button>

        <div className="container-fluid">
          <h1 className="text-center">BUY PRODUCT</h1>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">FirstName</th>
              <th scope="col">Price</th>
              <th scope="col">Owner</th>
            </tr>
          </thead>
          <tbody id="productList">
            {this.props.products.map((product, key) => {
              // console.log("Running tests", product.name[key])
              console.log("Key", key);
              return (
                <tr key={key}>
                  <th scope="row">{product.id.toString()}</th>
                  <td>{product.name}</td>
                  <td>
                    {window.web3.utils.fromWei(
                      product.price.toString(),
                      "Ether"
                    )}{" "}
                    Eth
                  </td>
                  <td>{product.owner}</td>

                  <td>
                    {!product.purchased ? (
                      <button
                        name={product.id}
                        value={product.price}
                        onClick={event => {
                          this.props.purchaseProduct(
                            event.target.name,
                            event.target.value
                          );
                        }}
                        type="button"
                        className="btn btn-outline-primary"
                      >
                        Buy
                      </button>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
