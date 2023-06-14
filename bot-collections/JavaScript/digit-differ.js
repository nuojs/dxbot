// initial variables
let amount = 1;
let martingle = 2;
let maximum_martingle = 3;
let numberOfTick = 100;
let targetMinimumPercentage = 4;
let market = "R_100";
// end initial

let firstAmount = amount;
let martingleCount = 0;
let activeTrade = false;
let spots = [];
let i = 0;
let pip_size = 0;
function getMinPercentage(_data, req) {
  let res = {};
  let digits = Array(10).fill(0);
  _data.forEach((price) => {
    let digit = price.toFixed(pip_size).slice(-1);
    digits[digit] = digits[digit] + 1;
  });
  let min,
    max = 0,
    _max = 0,
    _min = Infinity,
    _digit_min = 0;

  for (let digit in digits) {
    res[digit] = parseInt((digits[digit] / _data.length) * 100);
    let percent = res[digit];
    if (percent > _max) {
      max = i;
      _max = percent;
    }
    if (percent < _min) {
      _min = percent;
      _digit_min = digit;
    }
    if (percent <= req) min = i;
  }
  Notify({
    message:
      " " +
      _digit_min +
      " :: " +
      _min +
      " % target " +
      targetMinimumPercentage +
      " %",
    className: "warning",
  });
  //  console.log(_data, pip_size)
  return { min, max };
}
let Param = (prediction, _amount) => {
  return {
    contract: "DIFFER",
    amount: _amount,
    duration: 5,
    prediction: String(prediction),
  };
};
console.log("link start");
function main(data) {
  let d = data[data.msg_type];
  switch (data.msg_type) {
    case "login":
      // read 'id' for read 'limitAccounts'
      // d.id =  data.login.id
      console.log("client id : " + d.id);
      break;
    case "error":
      // if bot error 'more action'
      console.log(d);
      alert(d.message);
      Stop();
      break;
    case "portfolio":
      // portfolio onread
      if (activeTrade) {
        if (d.status == "won") {
          amount = firstAmount;
          martingleCount = 0;
          activeTrade = false;
        }
        if (d.status == "lost") {
          amount *= martingle;
          martingleCount++;
          activeTrade = false;
          if (martingleCount > maximum_martingle) {
            martingleCount = 0;
            amount = firstAmount;
          }
        }
      }
      break;
    case "price":
      // create triger logic
      // set pip_size
      // ex -> 123.45 -> pip_size = 3 -> 123.450
      pip_size = d.pip_size;
      // getMinPercentage(<array>, number)
      let percentage = getMinPercentage(
        // d.prices = 5.000 length
        d.prices.slice(-numberOfTick),
        // [0,1,2,3].slice(-2) -> [2,3]
        targetMinimumPercentage
      );
      // show notify
      // Notify({message: "percentage "+JSON.stringify(percentage), className: "warning"})
      if (percentage.min != undefined && !activeTrade) {
        activeTrade = true; // close queue trade
        Trade(Param(percentage.min, amount));
      }
      break;
  }
}
// Run(callback, market)
Run(main, market);
