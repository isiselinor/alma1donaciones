function parseMonto(valor){
  if(valor===null||valor===undefined)return 0;
  if(typeof valor==='number')return isFinite(valor)?valor:0;
  var s=String(valor).trim(); if(!s)return 0;
  var negativo=/^-|\(.*\)/.test(s);
  s=s.replace(/[^0-9.,]/g,''); if(!s)return 0;
  var tienePunto=s.indexOf('.')!==-1, tieneComa=s.indexOf(',')!==-1, n;
  if(tienePunto&&tieneComa){
    if(s.lastIndexOf(',')>s.lastIndexOf('.')){s=s.replace(/\./g,'').replace(',','.');}
    else{s=s.replace(/,/g,'');}
  }else if(tieneComa){
    var pc=s.split(',');
    if(pc.length>2){s=s.replace(/,/g,'');}
    else{var dc=pc[1]||''; s=(dc.length===3)?s.replace(',',''):s.replace(',','.');}
  }else if(tienePunto){
    var pp=s.split('.');
    if(pp.length>2){s=s.replace(/\./g,'');}
    else{var dp=pp[1]||''; s=(dp.length===3)?s.replace('.',''):s;}
  }
  n=parseFloat(s); if(!isFinite(n))return 0;
  return negativo?-n:n;
}
function normalizar(t){return String(t==null?'':t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').trim();}
var MONEDAS=[
 {codigo:'USD',keywords:['zelle','dolar','dólar','dolares','dólares','usd','usdt','cripto','binance','paypal','wise','us$','u$s']},
 {codigo:'ARS',keywords:['mercado pago','mercadopago','mp','pesos','peso','transferencia','cvu','cbu','alias','ars','$','efectivo']}
];
function detectarMoneda(m){m=normalizar(m);for(var i=0;i<MONEDAS.length;i++){var k=MONEDAS[i].keywords;for(var j=0;j<k.length;j++){if(m.indexOf(normalizar(k[j]))!==-1)return MONEDAS[i].codigo;}}return 'ARS';}
function aUSD(monto,moneda,tasas){var c=String(moneda).toUpperCase();if(c==='USD'||c==='USDT')return monto;var t=tasas[c];if(!t||t<=0)return null;return monto/t;}

// Montos reales que aparecen en la planilla:
var reales=['10000','40000','5000','3000','15000','1770','135434','7449','100','1800','14.399,00','50.000','120.50'];
console.log('--- parseMonto (datos reales) ---');
reales.forEach(function(v){console.log(JSON.stringify(v)+' -> '+parseMonto(v));});

console.log('\n--- detectarMoneda (método real) ---');
['Pesos Argentinos Mercado Pago','Zelle USD','USDT Binance'].forEach(function(m){
  console.log(JSON.stringify(m)+' -> '+detectarMoneda(m));});

// Simulación: total ARS verificado de la captura (104 donaciones = 1.100.053,00 ARS) a tasa 1550
var tasas={USD:1,ARS:1550};
var totalARS=1100053;
console.log('\n--- consolidado USD ---');
console.log('ARS '+totalARS+' / 1550 = US$ '+aUSD(totalARS,'ARS',tasas).toFixed(2)+'  (captura mostraba US$709,71)');
