import React, { Component } from "react";
import logo from "../logo.png";
import "./App.css";
import Web3 from "web3";
import Marketplace from "../abis/Marketplace";
import NavbarComponent from "./NavBarComponent";

import { Navbar } from "react-bootstrap";
import Body from "./Body";
import InputField from "./InputFields";

class App extends Component {
  // component will mount
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    window.addEventListener("load", async () => {
      // Modern dapp browsers...
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        const web3 = window.web3;
        // // load accounts
        const accounts = await web3.eth.getAccounts(); // returns all the account in our wallet
        console.log(accounts);

        // console.log("Window Ethereum Enabled")
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
      } else {
        alert(
          "Non-Ethereum browser detected. You should consider trying MetaMask!"
        );
        console.log(
          "Non-Ethereum browser detected. You should consider trying MetaMask!"
        );
      }
    });
  }

  //load Blockchain Data
  async loadBlockchainData() {
    // console.log(ProductDapp)
    window.web3 = new Web3(window.ethereum);
    const web3 = window.web3;
    // // load accounts
    const accounts = await web3.eth.getAccounts(); // returns all the account in our wallet
    this.setState({ account: accounts[0] });

    const networkId = await web3.eth.net.getId();
    const abi = Marketplace.abi;

    const networkData = Marketplace.networks[networkId];

    if (networkData) {
      const marketplace = web3.eth.Contract(abi, networkData.address);
      const productCount = await marketplace.methods.productCount().call();
      console.log(productCount.toString());
      console.log("Contract : ", marketplace);

      this.setState({ marketplace });

      for (var i = 1; i <= productCount; i++) {
        const product = await marketplace.methods.products(i).call();
        this.setState({
          products: [...this.state.products, product]
        });
      }
      console.log("Fetching from BLockchain", this.state.products);

      this.setState({ loading: false });
      console.log("Fetching from BLockchain", this.state.products);
    } else {
      window.alert("Could not fetch network data line 66 app.js");
    }
  }

  // Constructor
  constructor(props) {
    super(props);

    this.state = {
      account: "",
      productCount: "",
      products: [],
      loading: true
    };
    this.createProduct = this.createProduct.bind(this);
    this.purchaseProduct = this.purchaseProduct.bind(this);
  }

  // Create a product call from smart contract

  createProduct(name, price) {
    this.setState({ loading: true });
    this.state.marketplace.methods
      .createProduct(name, price)
      .send({ from: this.state.account })
      .once("receipt", recept => {
        this.setState({ loading: false });
      });
  }

  purchaseProduct(id, price) {
    this.setState({ loading: true });
    this.state.marketplace.methods
      .purchaseProduct(id)
      .send({ from: this.state.account, value: price })
      .once("receipt", receipt => {
        this.setState({
          loading: false
        });
      });
  }

  render() {
    return (
      <div>
        <NavbarComponent />

        <br></br>
        <br></br>
        <br></br>
        <br></br>

        {this.state.loading ? (
          <div className="container-fluid">loading....</div>
        ) : (
          <Body />
        )}

        <InputField
          createProduct={this.createProduct}
          products={this.state.products}
          purchaseProduct = {this.purchaseProduct} 
        />
      </div>
    );
  }
}

export default App;
