amount = 0.35
firstAmount = amount
martingle = 2.2
maximum_martingle = 5
martingleCount = 0
market = "R_75"
settings = 
 OverBought: 75
 OverSold: 25
activeTrade = false
spots = []
i = 0
Param = (contract, _amount) ->
 { contract, amount: _amount, duration: 5 };
main = (data) -> 
  d = data[data.msg_type]
  switch data.msg_type
   when "login" then console.log "client id : " + d.id
   when "price"
    i++
    spots[i] = Number d.price
    rsi = indicator.rsi 
      values: d.prices.slice(-100), 
      period: 14 
    rsi = parseInt rsi[rsi.length - 1]
    console.log d.price, rsi
    if rsi <= settings.OverSold and !activeTrade
      activeTrade = true
      Trade Param "RISE", amount
    if rsi >= settings.OverBought and !activeTrade
      activeTrade = true
      Trade Param "FALL", amount
   when "portfolio"
    if activeTrade
     if d.status == "won" 
       amount = firstAmount 
       martingleCount = 0
       activeTrade = false
     if d.status == "lost"
       amount *= martingle
       martingleCount++
       activeTrade = false
       if martingleCount > maximum_martingle
         martingleCount = 0
         amount = firstAmount
    break
Run(main, market)
`;