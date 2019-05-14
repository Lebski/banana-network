/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

"use strict";

var NS = "sc.demonstrator.net";

/**
 * Use this Function for setting up each of a kind
 * @param {sc.demonstrator.net.Setup} SetupParam - Yeah basically nothing...
 * @transaction
 */

async function executeSetup(SetupParam) {
  const ProductReg = await getAssetRegistry(NS + ".Product");
  const CompanyReg = await getAssetRegistry(NS + ".Company");

  var factory = getFactory();

  var newCompany1 = factory.newResource(
    NS,
    "Company",
    "BananasCorpSouthAmerica"
  );
  var newCompany2 = factory.newResource(NS, "Company", "TruckfleetCo");
  var newCompany3 = factory.newResource(NS, "Company", "WeArePackagingPower");
  var newCompany4 = factory.newResource(NS, "Company", "Middlepeople");
  var newCompany5 = factory.newResource(NS, "Company", "EinzelhandelsGmbH");

  newCompany1.name = "BananasCorpSouthAmerica";
  newCompany1.lat = 50.110924;
  newCompany1.long = 8.682127;
  newCompany2.name = "TruckfleetCo";
  newCompany2.lat = 50.110924;
  newCompany2.long = 8.682127;
  newCompany3.name = "WeArePackagingPower";
  newCompany3.lat = 50.110924;
  newCompany3.long = 8.682127;
  newCompany4.name = "Middlepeople";
  newCompany4.lat = 50.110924;
  newCompany4.long = 8.682127;
  newCompany5.name = "EinzelhandelsGmbH";
  newCompany5.lat = 50.110924;
  newCompany5.long = 8.682127;

  await CompanyReg.addAll([
    newCompany1,
    newCompany2,
    newCompany3,
    newCompany4,
    newCompany5
  ]);
}

/**
 * Create new Product
 * @param {sc.demonstrator.net.ProductCreation} ProductInfo - Information about new product
 * @transaction
 */
async function executeProductCreation(ProductInfo) {
  const assetRegistry = await getAssetRegistry(NS + ".Product");

  var factory = getFactory();
  var newProduct = factory.newResource(NS, "Product", ProductInfo.ID);
  var newContract = factory.newConcept(NS, "HandoverContract");

  newContract.issuer = ProductInfo.issuer;
  newContract.next = ProductInfo.next;
  newContract.ready = false;

  newProduct.contracts = [newContract];
  newProduct.position = "PLANTATION";

  await assetRegistry.add(newProduct);
}

/**
 * Release a product
 * @param {sc.demonstrator.net.ProductRelease} ProductInfo - Issuer and product to update
 * @transaction
 */
async function executeProductRelease(ProductInfo) {
  const assetRegistry = await getAssetRegistry(NS + ".Product");

  var product = ProductInfo.product;

  var latestContract = product.contracts[product.contracts.length - 1];
  if (latestContract.issuer != ProductInfo.issuer) {
    throw new Error(
      "Issuer must be the same in latest contract and this transaction call"
    );
  } else {
    latestContract.ready = true;
  }

  await assetRegistry.update(product);
}

/**
 * Handover a product to next owner
 * @param {sc.demonstrator.net.ProductHandover} ProductInfo - Issuer, next and product to update
 * @transaction
 */
async function executeProductHandover(ProductInfo) {
  const assetRegistry = await getAssetRegistry(NS + ".Product");

  var product = ProductInfo.product;

  // The new issuer must match the "next" company from the latest contract
  var latestContract = product.contracts[product.contracts.length - 1];
  if (!latestContract.ready) {
    throw new Error("Last contract must be marked as ready");
  } else if (latestContract.next != ProductInfo.issuer) {
    throw new Error(
      "Issuer must be the same in latest contract and this transaction call"
    );
  } else {
    latestContract.ready = true;
  }

  // Then we can add a new Contract...
  var factory = getFactory();
  var newContract = factory.newConcept(NS, "HandoverContract");

  newContract.issuer = ProductInfo.issuer;
  newContract.next = ProductInfo.next;
  newContract.ready = false;

  product.contracts.push(newContract);

  switch (product.position) {
    case "PLANTATION":
      product.position = "SHIPPING";
      break;
    case "SHIPPING":
      product.position = "PACKAGING";
      break;
    case "PACKAGING":
      product.position = "WHOLESALE";
      break;
    case "WHOLESALE":
      product.position = "RETAIL";
      break;
    case "RETAIL":
      throw new Error("Supply chains ends after retails");
    default:
      throw new Error("Product positions not valid: " + product.position);
  }

  await assetRegistry.update(product);
}

