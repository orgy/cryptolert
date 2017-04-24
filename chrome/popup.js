var form = document.getElementById('cryptolert-form')
form.addEventListener('submit', processForm);

chrome.storage.local.get("coins", function(items) {
    Object.keys(items.coins).forEach(function(coin) {
        addRow(coin, items.coins[coin].less, items.coins[coin].more);
    });
});

function processForm(e) {
    e.preventDefault();

    var coin = form.coin.value.toLowerCase();

    var coins = chrome.storage.local.get("coins", function(items) {
        if (typeof(items.coins) == 'undefined') {
            items.coins = {};
        }

        items.coins[coin] = {
            less: form.less.value,
            more: form.more.value
        };

        chrome.storage.local.set(items, function() {
            addRow(coin, form.less.value, form.more.value);

            form.coin.value = '';
            form.less.value = '';
            form.more.value = '';
        });
    });

    return false;
}

function deleteCoin(coin) {
    var coins = chrome.storage.local.get("coins", function(items) {
        if (typeof(items.coins) == 'undefined') {
            items.coins = {};
        }

        delete items.coins[coin];

        chrome.storage.local.set(items, function() {
            var el = document.querySelector('tr[coin="' + coin + '"]');
            el.parentNode.removeChild(el);
        });
    });
}

function addRow(coin, less, more) {
    var tableRef = document.getElementById('coins-table').getElementsByTagName('tbody')[0];
    var newRow   = tableRef.insertRow(tableRef.rows.length);
    newRow.setAttribute('coin', coin);
    var coinCell  = newRow.insertCell(0);
    var lessCell  = newRow.insertCell(1);
    var moreCell  = newRow.insertCell(2);
    var delCell = newRow.insertCell(3);

    coinCell.appendChild(document.createTextNode(coin));
    lessCell.appendChild(document.createTextNode(less));
    moreCell.appendChild(document.createTextNode(more));

    var a = document.createElement('a');
    a.appendChild(document.createTextNode('Delete'));
    a.href = "#";
    delCell.appendChild(a);

    a.addEventListener('click', function(){
        deleteCoin(coin);
    });
}