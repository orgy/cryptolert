var interval = 300; //seconds. currently 5 minutes because that's how long it takes for coinmarketcaps api to update
checkCoins();

function checkCoins() {
    chrome.storage.local.get("coins", function(items) {
        Object.keys(items.coins).forEach(function(coin) {
            getCoinPrice(coin, items.coins[coin].less, items.coins[coin].more);
        });
    });

    setTimeout(checkCoins, interval*1000);
}

var Notification=(function(){
    var notification = null;

    return {
        display: function(opt){
            notification = chrome.notifications.create(opt);
        },
        hide: function(){
            notification.close();
        }
    };
})();

function getCoinPrice(coin, less, more) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://api.coinmarketcap.com/v1/ticker/"+coin, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            var r = JSON.parse(xhr.responseText);
            var price = r[0].price_usd;

            if (price > more) {
                var opt = {
                    type: "basic",
                    title: "Cryptolert Alert",
                    message: coin + " now costs $" + price + ", which is higher than your alert threshold.",
                    iconUrl: "icon.png"
                };
                Notification.display(opt);
            } else if (price < less) {
                var opt = {
                    type: "basic",
                    title: "Cryptolert Alert",
                    message: coin + " now costs $" + price + ", which is lower than your alert threshold.",
                    iconUrl: "icon.png"
                };
                Notification.display(opt);
            }
        }
    }
    xhr.send();
}