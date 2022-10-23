import { ServerRespond } from './DataStreamer';

export interface Row {
  price_abc: number,
  price_def: number,
  ratio: number,
  timestamp: Date,
  upper_bound: number,
  lower_bound: number,
  trigger_alert: number | undefined,
}


export class DataManipulator {
  static generateRow(serverRespond: ServerRespond[]): Row {
    // calculating the price of each stock and their ratio
    const priceABC = (serverRespond[0].top_ask.price + serverRespond[0].top_bid.price) / 2;
    const priceDEF = (serverRespond[1].top_ask.price + serverRespond[1].top_bid.price) / 2;
    const ratio = priceABC / priceDEF;

    // left the bounds as 5% to better display the trigger_alert functionality
    const upperBound = 1 + 0.05;
    const lowerBound = 1 - 0.05;
    return {
      // returning the necessary values
      price_abc: priceABC,
      price_def: priceDEF,
      ratio,
      timestamp: serverRespond[0].timestamp > serverRespond[1].timestamp ?
        serverRespond[0].timestamp : serverRespond[1].timestamp, // ensures that the timestamps return appropriately
      upper_bound: upperBound,
      lower_bound: lowerBound,

      // ensures that the trigger_alert works when the ratio crosses the upper or lower bounds
      trigger_alert: (ratio > upperBound || ratio < lowerBound) ? ratio : undefined
    };
  }
}