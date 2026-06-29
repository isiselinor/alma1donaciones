// Copia de las funciones críticas extraídas del .gs
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

var casos=[['14.399,00',14399],['50000',50000],['50.000',50000],['10.5',10.5],['10,5',10.5],
 ['$ 1.200,50',1200.5],['1,234,567',1234567],['1.234.567',1234567],['14,399.00',14399],
 ['100.00',100],['1.000',1000],['10,50',10.5],['US$ 120.50',120.5],['',0],[5000,5000],['  2.500,75 ',2500.75]];
console.log('--- parseMonto ---');
var ok=true;
casos.forEach(function(c){var r=parseMonto(c[0]);var pass=Math.abs(r-c[1])<1e-9;if(!pass)ok=false;console.log((pass?'OK ':'XX ')+JSON.stringify(c[0])+' -> '+r+' (esperado '+c[1]+')');});

console.log('\n--- detectarMoneda ---');
[['Mercado Pago','ARS'],['Zelle','USD'],['Transferencia en pesos','ARS'],['Dólar / USDT','USD'],
 ['Binance','USD'],['CVU alias','ARS'],['algo raro','ARS']].forEach(function(c){
  var r=detectarMoneda(c[0]);var pass=r===c[1];if(!pass)ok=false;
  console.log((pass?'OK ':'XX ')+JSON.stringify(c[0])+' -> '+r+' (esperado '+c[1]+')');});

console.log('\nRESULTADO: '+(ok?'TODOS OK':'HAY FALLOS'));
